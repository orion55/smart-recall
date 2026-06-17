import { spawn } from 'node:child_process';
import * as readline from 'node:readline';

const child = spawn('node', ['dist/index.js', '9129241518'], {
  stdio: ['pipe', 'pipe', 'inherit'], // stdin/out child, stderr в консоль
});

// 1) отправляем env (как делает Asterisk)
const agiEnv: Record<string, string> = {
  agi_request: 'simple-agi.js',
  agi_channel: 'SIP/tmn.7112-0000040a',
  agi_language: 'ru',
  agi_type: 'SIP',
  agi_uniqueid: '1768305545.9459',
  agi_version: '16.27.0',
  agi_callerid: '34527112',
  agi_calleridname: 'grebenev',
  agi_callingpres: '0',
  agi_callingani2: '0',
  agi_callington: '0',
  agi_callingtns: '0',
  agi_dnid: '015635',
  agi_rdnis: 'unknown',
  agi_context: 'tyumen',
  agi_extension: '015635',
  agi_priority: '3',
  agi_enhanced: '0.0',
  agi_accountcode: '',
  agi_threadid: '34441539584',
  agi_arg_1: '34527112',
};

const envLines = [
  ...Object.entries(agiEnv).map(([key, value]) => `${key}: ${value}`),
  '', // конец env — ОБЯЗАТЕЛЕН
];

child.stdin.write(`${envLines.join('\n')}\n`);

// 2) читаем команды, которые пишет скрипт, и отвечаем
const rl = readline.createInterface({ input: child.stdout, terminal: false });

rl.on('line', (cmd) => {
  const s = cmd.trim();
  console.log('[SCRIPT -> ASTERISK]', s);

  // Простейшая логика ответов:
  if (s.startsWith('VERBOSE')) {
    child.stdin.write('200 result=1\n');
  } else if (s.startsWith('SET VARIABLE')) {
    child.stdin.write('200 result=1\n');
  } else if (s.startsWith('EXEC Playback')) {
    child.stdin.write('200 result=0\n'); // обычно 0 = успех/ок (зависит от команды)
  } else if (s.startsWith('HANGUP')) {
    child.stdin.write('200 result=1\n');
  } else {
    child.stdin.write('510 Invalid or unknown command\n');
  }
});

child.on('exit', (code) => {
  console.log('[SCRIPT EXIT]', code);
  process.exit(code ?? 0);
});
