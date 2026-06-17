import * as readline from 'node:readline';
import type { AgiContext } from '@src/util/types';
import { createDeferred } from '@src/util/utils';
import { parseEnvLine } from './parser';

export const createAgiReadline = (): readline.Interface =>
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

export const createAgiContext = (rl: readline.Interface): AgiContext => ({
  rl,
  mode: 'env',
  env: {},
  envWaiters: [],
  cmdWaiters: [],
});

const resolveEnvReady = (ctx: AgiContext): void => {
  while (ctx.envWaiters.length) ctx.envWaiters.shift()!.resolve();
};

const rejectAllWaiters = (ctx: AgiContext, err: Error): void => {
  while (ctx.envWaiters.length) ctx.envWaiters.shift()!.reject(err);
  while (ctx.cmdWaiters.length) ctx.cmdWaiters.shift()!.reject(err);
};

export const handleIncomingLine = (ctx: AgiContext, line: string): void => {
  const text = String(line).trimEnd(); // убираем \r и хвостовые пробелы

  if (ctx.mode === 'env') {
    if (text === '') {
      ctx.mode = 'cmd';
      resolveEnvReady(ctx);
      return;
    }

    const parsed = parseEnvLine(text);
    if (parsed) {
      ctx.env[parsed.key] = parsed.value;
    }
    return;
  }

  const waiter = ctx.cmdWaiters.shift();
  if (waiter) waiter.resolve(text);
};

export const wireReadline = (ctx: AgiContext): void => {
  ctx.rl.on('line', (line) => handleIncomingLine(ctx, line));
  ctx.rl.on('close', () => rejectAllWaiters(ctx, new Error('AGI input closed')));
};

export const waitEnvReady = (ctx: AgiContext): Promise<void> => {
  if (ctx.mode === 'cmd') return Promise.resolve();

  const { promise, deferred } = createDeferred<void>();
  ctx.envWaiters.push(deferred);
  return promise;
};

export const sendCommand = (ctx: AgiContext, cmd: string): Promise<string> => {
  const { promise, deferred } = createDeferred<string>();
  ctx.cmdWaiters.push(deferred);

  process.stdout.write(`${cmd.trim()}\n`);
  return promise;
};
