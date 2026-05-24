import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { NotificationsAPI } from '../api/notifications';
import { formatOutput } from '../utils/output';

export function registerNotificationCommands(program: Command): void {
  const notifications = program.command('notifications').description('Manage notifications').alias('notif');

  notifications
    .command('list')
    .description('List user notifications')
    .action(async (_options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new NotificationsAPI(client);
        const result = await api.list();
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  notifications
    .command('get <id>')
    .description('Get notification details')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new NotificationsAPI(client);
        const result = await api.get(id);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  notifications
    .command('read <id>')
    .description('Mark a notification as read')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new NotificationsAPI(client);
        const result = await api.update(id, true);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  notifications
    .command('unread <id>')
    .description('Mark a notification as unread')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new NotificationsAPI(client);
        const result = await api.update(id, false);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  notifications
    .command('read-all')
    .description('Mark all notifications as read')
    .action(async (_options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new NotificationsAPI(client);
        await api.readAll();
        console.log(formatOutput({ status: 'ok', message: 'All notifications marked as read' }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
