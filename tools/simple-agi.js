#!/usr/local/bin/node

const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// --- очередь ожиданий ответов на команды AGI ---
const pending = [];
let mode = 'env'; // 'env' -> читаем переменные, потом 'cmd'

// AGI env
const env = {};

rl.on('line', (line) => {
  const s = String(line).trimEnd();

  if (mode === 'env') {
    if (s === '') {
      mode = 'cmd';
      // разбудить тех, кто ждёт "env готов"
      while (pending.length) pending.shift().resolve(null);
      return;
    }
    const idx = s.indexOf(':');
    if (idx > 0) {
      env[s.slice(0, idx).trim()] = s.slice(idx + 1).trim();
    }
    return;
  }

  // mode === 'cmd' => это ответ Asterisk на последнюю команду
  const waiter = pending.shift();
  if (waiter) waiter.resolve(s);
});

// обязательно, чтобы не падать молча
rl.on('close', () => {
  while (pending.length) pending.shift().reject(new Error('AGI input closed'));
});

function waitEnvReady() {
  if (mode === 'cmd') return Promise.resolve();
  return new Promise((resolve, reject) => pending.push({ resolve, reject }));
}

function send(cmd) {
  return new Promise((resolve, reject) => {
    pending.push({ resolve, reject });
    process.stdout.write(`${cmd.trim()}\n`);
  });
}

function escapeAgiString(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

(async () => {
  await waitEnvReady();

  for (const [key, value] of Object.entries(env)) {
    await send(`VERBOSE "AGI env ${escapeAgiString(`${key}=${value}`)}" 1`);
  }

  // Аргумент #1 из dialplan: AGI(script.js,<phone>)
  const phone =
    [process.argv[2], env.agi_arg_1, env.agi_callerid, env.agi_callerid_number].find(Boolean) || '';
  const safePhone = escapeAgiString(phone);

  await send(`VERBOSE "Node AGI started. phone=${safePhone}" 1`);
  await send(`SET VARIABLE SALES_PHONE "${safePhone}"`);

  // пример
  await send(`EXEC Playback hello-world`);
  //  await send(`HANGUP`);

  rl.close();
  process.exit(0);
})().catch(async (err) => {
  try {
    const msg = escapeAgiString(err?.stack ? err.stack : err);
    await send(`VERBOSE "Node AGI error: ${msg}" 1`);
  } catch {}
  process.exit(1);
});
