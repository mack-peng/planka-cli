import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { CustomFieldsAPI } from '../api/custom-fields';
import { formatOutput } from '../utils/output';

export function registerCustomFieldCommands(program: Command): void {
  const customFields = program.command('custom-fields').description('Manage custom fields').alias('cf');

  customFields
    .command('create <groupId>')
    .description('Create a custom field (use --base for base group)')
    .requiredOption('-n, --name <name>', 'Field name')
    .option('-p, --position <n>', 'Field position')
    .option('--show-on-front', 'Show on front of card')
    .option('--base', 'Create in base custom field group')
    .action(async (groupId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CustomFieldsAPI(client);
        const data = {
          name: options.name,
          position: options.position !== undefined ? Number(options.position) : undefined,
          showOnFrontOfCard: options.showOnFront,
        };
        const result = options.base
          ? await api.createInBaseGroup(groupId, data)
          : await api.createInGroup(groupId, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  customFields
    .command('update <id>')
    .description('Update a custom field')
    .option('-n, --name <name>', 'Field name')
    .option('-p, --position <n>', 'Field position')
    .option('--show-on-front', 'Show on front of card')
    .option('--no-show-on-front', 'Hide from front of card')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CustomFieldsAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.position !== undefined) data.position = Number(options.position);
        if (options.showOnFront !== undefined) data.showOnFrontOfCard = options.showOnFront;
        const result = await api.update(id, data as any);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  customFields
    .command('delete <id>')
    .description('Delete a custom field')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CustomFieldsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Custom field ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
