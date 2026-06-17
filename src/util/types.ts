import type * as readline from 'node:readline';
import type { RowDataPacket } from 'mysql2/promise';

export type Mode = 'env' | 'cmd';

export interface Deferred<T> {
  resolve: (value: T) => void;
  reject: (err: Error) => void;
}

export interface AgiContext {
  rl: readline.Interface;
  mode: Mode;
  env: Record<string, string>;

  // Ждём окончания env (пустую строку)
  envWaiters: Deferred<void>[];

  // Ждём ответ на последнюю AGI-команду
  cmdWaiters: Deferred<string>[];
}

export type EnvLine = {
  key: string;
  value: string;
};

export interface LastAnsweredChannelRow extends RowDataPacket {
  channel_short: string;
}
