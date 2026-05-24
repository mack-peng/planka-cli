import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { UsersAPI } from '../api/users';
import { formatOutput } from '../utils/output';

export function registerUserCommands(program: Command): void {
  const users = program.command('users').description('Manage users').alias('u');

  users
    .command('list')
    .description('List all users')
    .action(async (_options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new UsersAPI(client);
        const result = await api.list();
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  users
    .command('get <id>')
    .description('Get user details')
    .option('--subscribe', 'Subscribe to user changes')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new UsersAPI(client);
        const result = await api.get(id, options.subscribe);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  users
    .command('create')
    .description('Create a new user')
    .requiredOption('--email <email>', 'User email')
    .requiredOption('--name <name>', 'User display name')
    .requiredOption('--username <username>', 'User username')
    .requiredOption('--password <password>', 'User password')
    .option('--language <lang>', 'Preferred language')
    .option('--organization <org>', 'Organization name')
    .option('--phone <phone>', 'Phone number')
    .option('--role <role>', 'User role')
    .action(async (options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new UsersAPI(client);
        const result = await api.create({
          email: options.email,
          name: options.name,
          username: options.username,
          password: options.password,
          language: options.language,
          organization: options.organization,
          phone: options.phone,
          role: options.role,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  users
    .command('update <id>')
    .description('Update a user')
    .option('--name <name>', 'Display name')
    .option('--organization <org>', 'Organization name')
    .option('--phone <phone>', 'Phone number')
    .option('--role <role>', 'User role')
    .option('--language <lang>', 'Preferred language')
    .option('--default-editor-mode <mode>', 'Default editor mode')
    .option('--default-home-view <view>', 'Default home view')
    .option('--default-projects-order <order>', 'Default projects order')
    .option('--deactivate', 'Deactivate user')
    .option('--no-deactivate', 'Activate user')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new UsersAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.organization !== undefined) data.organization = options.organization;
        if (options.phone !== undefined) data.phone = options.phone;
        if (options.role !== undefined) data.role = options.role;
        if (options.language !== undefined) data.language = options.language;
        if (options.defaultEditorMode !== undefined) data.defaultEditorMode = options.defaultEditorMode;
        if (options.defaultHomeView !== undefined) data.defaultHomeView = options.defaultHomeView;
        if (options.defaultProjectsOrder !== undefined) data.defaultProjectsOrder = options.defaultProjectsOrder;
        if (options.deactivate !== undefined) data.isDeactivated = options.deactivate;
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  users
    .command('delete <id>')
    .description('Delete a user')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new UsersAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `User ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  users
    .command('api-key <id>')
    .description('Create API key for a user')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new UsersAPI(client);
        const result = await api.createApiKey(id);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  users
    .command('update-email <id>')
    .description('Update a user email')
    .requiredOption('--email <email>', 'New email')
    .requiredOption('--current-password <password>', 'Current password')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new UsersAPI(client);
        await api.updateEmail(id, options.email, options.currentPassword);
        console.log(formatOutput({ status: 'ok', message: 'Email updated' }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  users
    .command('update-password <id>')
    .description('Update a user password')
    .requiredOption('--password <password>', 'New password')
    .requiredOption('--current-password <current>', 'Current password')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new UsersAPI(client);
        await api.updatePassword(id, options.password, options.currentPassword);
        console.log(formatOutput({ status: 'ok', message: 'Password updated' }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  users
    .command('update-username <id>')
    .description('Update a user username')
    .requiredOption('--username <username>', 'New username')
    .requiredOption('--current-password <password>', 'Current password')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new UsersAPI(client);
        await api.updateUsername(id, options.username, options.currentPassword);
        console.log(formatOutput({ status: 'ok', message: 'Username updated' }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
