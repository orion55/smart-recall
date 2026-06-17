import type { EnvLine } from '@src/util/types';

export const parseEnvLine = (line: string): EnvLine | null => {
  const idx = line.indexOf(':');
  if (idx <= 0) return null;

  const key = line.slice(0, idx).trim();
  const value = line.slice(idx + 1).trim();

  if (!key) return null;
  return { key, value };
};
