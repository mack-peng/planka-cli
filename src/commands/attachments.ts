import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { AttachmentsAPI } from '../api/attachments';
import { formatOutput } from '../utils/output';

export function registerAttachmentCommands(program: Command): void {
  const attachments = program.command('attachments').description('Manage card attachments').alias('att');

  attachments
    .command('update <id>')
    .description('Update an attachment name')
    .option('-n, --name <name>', 'New attachment name')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new AttachmentsAPI(client);
        const result = await api.update(id, { name: options.name });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  attachments
    .command('delete <id>')
    .description('Delete an attachment')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new AttachmentsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Attachment ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
