import path from 'node:path';
import { type DotenvConfigOutput, type DotenvParseOutput, config as dotenvConfig } from 'dotenv';
import type { IConfigService } from './config.interface';

export class ConfigService implements IConfigService {
  private readonly config!: DotenvParseOutput;

  constructor() {
    const envPath = path.resolve(__dirname, '.env');

    const result: DotenvConfigOutput = dotenvConfig({
      path: envPath,
    });

    if (result.error || !result.parsed) {
      throw result.error ?? new Error('Dotenv parsing error');
    }

    this.config = result.parsed;
  }

  public get(key: string): string {
    const value = this.config[key];

    if (value === undefined) {
      throw new Error(`[ConfigService] Отсутствует ключ "${key}" в конфигурации`);
    }

    return value;
  }
}
