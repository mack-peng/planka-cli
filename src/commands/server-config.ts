import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { ServerConfigAPI } from '../api/server-config';
import { formatOutput } from '../utils/output';

export function registerServerConfigCommands(program: Command): void {
  const serverConfig = program.command('server-config').description('Manage server configuration').alias('sc');

  serverConfig
    .command('get')
    .description('Get server configuration')
    .action(async (_options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ServerConfigAPI(client);
        const result = await api.get();
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  serverConfig
    .command('update')
    .description('Update server configuration')
    .option('--smtp-from <email>', 'SMTP from address')
    .option('--smtp-host <host>', 'SMTP host')
    .option('--smtp-name <name>', 'SMTP client hostname')
    .option('--smtp-password <password>', 'SMTP password')
    .option('--smtp-port <port>', 'SMTP port')
    .option('--smtp-user <user>', 'SMTP username')
    .option('--smtp-secure', 'Use secure SMTP')
    .option('--no-smtp-secure', 'Disable secure SMTP')
    .action(async (options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ServerConfigAPI(client);
        const data: Record<string, unknown> = {};
        if (options.smtpFrom !== undefined) data.smtpFrom = options.smtpFrom;
        if (options.smtpHost !== undefined) data.smtpHost = options.smtpHost;
        if (options.smtpName !== undefined) data.smtpName = options.smtpName;
        if (options.smtpPassword !== undefined) data.smtpPassword = options.smtpPassword;
        if (options.smtpPort !== undefined) data.smtpPort = Number(options.smtpPort);
        if (options.smtpUser !== undefined) data.smtpUser = options.smtpUser;
        if (options.smtpSecure !== undefined) data.smtpSecure = options.smtpSecure;
        const result = await api.update(data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  serverConfig
    .command('test-smtp')
    .description('Test SMTP configuration')
    .action(async (_options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ServerConfigAPI(client);
        await api.testSmtp();
        console.log(formatOutput({ status: 'ok', message: 'SMTP test triggered' }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
