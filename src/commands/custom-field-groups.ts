import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { CustomFieldGroupsAPI } from '../api/custom-field-groups';
import { formatOutput } from '../utils/output';

export function registerCustomFieldGroupCommands(program: Command): void {
  const customFieldGroups = program.command('custom-field-groups').description('Manage custom field groups').alias('cfgr');

  customFieldGroups
    .command('get <id>')
    .description('Get custom field group details')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CustomFieldGroupsAPI(client);
        const result = await api.get(id);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  customFieldGroups
    .command('create-board <boardId>')
    .description('Create a custom field group on a board')
    .requiredOption('-n, --name <name>', 'Group name')
    .option('-p, --position <n>', 'Group position')
    .option('--base-id <id>', 'Base custom field group ID')
    .action(async (boardId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CustomFieldGroupsAPI(client);
        const result = await api.createForBoard(boardId, {
          name: options.name,
          position: options.position !== undefined ? Number(options.position) : undefined,
          baseCustomFieldGroupId: options.baseId,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  customFieldGroups
    .command('create-card <cardId>')
    .description('Create a custom field group on a card')
    .requiredOption('-n, --name <name>', 'Group name')
    .option('-p, --position <n>', 'Group position')
    .option('--base-id <id>', 'Base custom field group ID')
    .action(async (cardId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CustomFieldGroupsAPI(client);
        const result = await api.createForCard(cardId, {
          name: options.name,
          position: options.position !== undefined ? Number(options.position) : undefined,
          baseCustomFieldGroupId: options.baseId,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  customFieldGroups
    .command('update <id>')
    .description('Update a custom field group')
    .option('-n, --name <name>', 'Group name')
    .option('-p, --position <n>', 'Group position')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CustomFieldGroupsAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.position !== undefined) data.position = Number(options.position);
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  customFieldGroups
    .command('delete <id>')
    .description('Delete a custom field group')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CustomFieldGroupsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Custom field group ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
