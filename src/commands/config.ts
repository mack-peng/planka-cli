import { Command } from 'commander';
import { ConfigManager } from '../utils/config';
import { formatOutput } from '../utils/output';

export function registerConfigCommands(program: Command): void {
  const config = program.command('config').description('Manage CLI configuration').alias('cfg');

  config
    .command('init')
    .description('Initialize planka-cli with server URL and API key')
    .requiredOption('--url <url>', 'PLANKA server base URL (e.g. https://planka.example.com)')
    .requiredOption('-k, --api-key <key>', 'PLANKA API key')
    .action(async (options) => {
      try {
        const mgr = new ConfigManager();
        mgr.save({ baseUrl: options.url, apiKey: options.apiKey });
        console.log(formatOutput({ status: 'ok', message: 'Configuration saved' }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  config
    .command('set')
    .description('Set a configuration value')
    .requiredOption('-u, --url <url>', 'Set server base URL')
    .action(async (options) => {
      try {
        const mgr = new ConfigManager();
        mgr.save({ baseUrl: options.url });
        console.log(formatOutput({ status: 'ok', message: 'URL updated' }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  config
    .command('key')
    .description('Set the API key')
    .requiredOption('-k, --api-key <key>', 'PLANKA API key')
    .action(async (options) => {
      try {
        const mgr = new ConfigManager();
        mgr.save({ apiKey: options.apiKey });
        console.log(formatOutput({ status: 'ok', message: 'API key updated' }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  config
    .command('info')
    .description('Show current configuration')
    .action(() => {
      try {
        const mgr = new ConfigManager();
        const cfg = mgr.getAll();
        if (!cfg.baseUrl && !cfg.apiKey) {
          console.error('No configuration found. Run "planka config init" to get started.');
          process.exit(1);
        }
        console.log(formatOutput(cfg));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  config
    .command('clear')
    .description('Clear all configuration')
    .action(() => {
      try {
        const mgr = new ConfigManager();
        mgr.clear();
        console.log(formatOutput({ status: 'ok', message: 'Configuration cleared' }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
