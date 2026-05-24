import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface PlankaConfig {
  apiKey?: string;
  baseUrl?: string;
  username?: string;
  bearerToken?: string;
}

export class ConfigManager {
  private configPath: string;

  constructor() {
    this.configPath = path.join(os.homedir(), '.planka', 'config.json');
  }

  load(): PlankaConfig {
    try {
      const data = fs.readFileSync(this.configPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  save(obj: PlankaConfig): void {
    const dir = path.dirname(this.configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const current = this.load();
    const merged = { ...current, ...obj };
    fs.writeFileSync(this.configPath, JSON.stringify(merged, null, 2), 'utf-8');
  }

  get(key: string): string | undefined {
    const config = this.load();
    return (config as Record<string, unknown>)[key] as string | undefined;
  }

  getAll(): PlankaConfig {
    return this.load();
  }

  clear(): void {
    const dir = path.dirname(this.configPath);
    if (fs.existsSync(this.configPath)) {
      fs.unlinkSync(this.configPath);
    }
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
    }
  }
}
