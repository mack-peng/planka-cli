import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { NotificationServicesAPI } from '../api/notification-services';
import { formatOutput } from '../utils/output';

export function registerNotificationServiceCommands(program: Command): void {
  const ns = program.command('notification-services').description('Manage notification services').alias('ns');

  ns
    .command('create-for-board <boardId>')
    .description('Create a notification service for a board')
    .requiredOption('-u, --url <url>', 'Webhook URL')
    .requiredOption('-f, --format <format>', 'Message format (text|markdown|html)')
    .action(async (boardId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new NotificationServicesAPI(client);
        const result = await api.createForBoard(boardId, {
          url: options.url,
          format: options.format,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  ns
    .command('create-for-user <userId>')
    .description('Create a notification service for a user')
    .requiredOption('-u, --url <url>', 'Webhook URL')
    .requiredOption('-f, --format <format>', 'Message format (text|markdown|html)')
    .action(async (userId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new NotificationServicesAPI(client);
        const result = await api.createForUser(userId, {
          url: options.url,
          format: options.format,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  ns
    .command('update <id>')
    .description('Update a notification service')
    .option('-u, --url <url>', 'Webhook URL')
    .option('-f, --format <format>', 'Message format (text|markdown|html)')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new NotificationServicesAPI(client);
        const data: Record<string, unknown> = {};
        if (options.url !== undefined) data.url = options.url;
        if (options.format !== undefined) data.format = options.format;
        const result = await api.update(id, data as any);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  ns
    .command('delete <id>')
    .description('Delete a notification service')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new NotificationServicesAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Notification service ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  ns
    .command('test <id>')
    .description('Test a notification service')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new NotificationServicesAPI(client);
        await api.test(id);
        console.log(formatOutput({ status: 'ok', message: `Notification service ${id} test triggered` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
