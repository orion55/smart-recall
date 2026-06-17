import { getLastAnsweredChannel } from '@src/db/cdr-last-channel';
import { createAgiContext, createAgiReadline, waitEnvReady, wireReadline } from './agi/agi';
import { agiSetVariable, agiVerbose } from './agi/commands';
import { escapeForAgiValue, sanitizePhone } from './util/utils';

const run = async (): Promise<void> => {
  const rl = createAgiReadline();
  const ctx = createAgiContext(rl);

  wireReadline(ctx);
  await waitEnvReady(ctx);

  const rawPhone = process.argv[2];
  const phone = sanitizePhone(rawPhone);

  await agiVerbose(ctx, `[smart-call] AGI started. phone(raw)=${rawPhone ?? ''} phone=${phone}`);

  const recipient = await getLastAnsweredChannel(phone);
  await agiVerbose(ctx, `[smart-call] The recipient was found to be equal ${recipient}`);
  await agiSetVariable(ctx, 'SALES_PHONE', recipient ?? '0');

  rl.close();
  process.exit(0);
};

const main = async (): Promise<void> => {
  try {
    await run();
  } catch (err) {
    try {
      const msg = escapeForAgiValue(err instanceof Error ? err.stack || err.message : String(err));
      process.stdout.write(`VERBOSE "Node AGI error: ${msg}" 1\n`);
    } catch {}
    process.exit(1);
  }
};

void main();
