import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { BaseCustomFieldGroupsAPI } from '../api/base-custom-field-groups';
import { formatOutput } from '../utils/output';

export function registerBaseCustomFieldGroupCommands(program: Command): void {
  const baseGroups = program.command('base-custom-field-groups').description('Manage base custom field groups').alias('bcfg');

  baseGroups
    .command('create <projectId>')
    .description('Create a base custom field group')
    .requiredOption('-n, --name <name>', 'Group name')
    .action(async (projectId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BaseCustomFieldGroupsAPI(client);
        const result = await api.create(projectId, options.name);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  baseGroups
    .command('update <id>')
    .description('Update a base custom field group')
    .requiredOption('-n, --name <name>', 'New group name')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BaseCustomFieldGroupsAPI(client);
        const result = await api.update(id, options.name);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  baseGroups
    .command('delete <id>')
    .description('Delete a base custom field group')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BaseCustomFieldGroupsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Base custom field group ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
