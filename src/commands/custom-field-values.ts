import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { CustomFieldValuesAPI } from '../api/custom-field-values';
import { formatOutput } from '../utils/output';

export function registerCustomFieldValueCommands(program: Command): void {
  const values = program.command('custom-field-values').description('Manage custom field values').alias('cfv');

  values
    .command('set <cardId> <customFieldGroupId> <customFieldId>')
    .description('Set a custom field value on a card')
    .requiredOption('-c, --content <content>', 'Field value content')
    .action(async (cardId, customFieldGroupId, customFieldId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CustomFieldValuesAPI(client);
        const result = await api.set(cardId, customFieldGroupId, customFieldId, options.content);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  values
    .command('delete <cardId> <customFieldGroupId> <customFieldId>')
    .description('Delete a custom field value from a card')
    .action(async (cardId, customFieldGroupId, customFieldId, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CustomFieldValuesAPI(client);
        await api.delete(cardId, customFieldGroupId, customFieldId);
        console.log(formatOutput({ status: 'ok', message: `Custom field value deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
