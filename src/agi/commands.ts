import type { AgiContext } from '@src/util/types';
import { escapeForAgiValue } from '@src/util/utils';
import { sendCommand } from './agi';

export const agiVerbose = async (ctx: AgiContext, message: string): Promise<void> => {
  const safe = escapeForAgiValue(message);
  await sendCommand(ctx, `VERBOSE "${safe}"`);
};

export const agiSetVariable = async (
  ctx: AgiContext,
  name: string,
  value: string,
): Promise<void> => {
  const safe = escapeForAgiValue(value);
  await sendCommand(ctx, `SET VARIABLE ${name} "${safe}"`);
};
