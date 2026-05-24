import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { LabelsAPI } from '../api/labels';
import { formatOutput } from '../utils/output';

export function registerLabelCommands(program: Command): void {
  const labels = program.command('labels').description('Manage board labels').alias('lb');

  labels
    .command('create <boardId>')
    .description('Create a label on a board')
    .requiredOption('-c, --color <color>', 'Label color')
    .option('-n, --name <name>', 'Label name')
    .option('-p, --position <n>', 'Label position', '65535')
    .action(async (boardId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new LabelsAPI(client);
        const data: Record<string, unknown> = {
          color: options.color,
          position: Number(options.position),
        };
        if (options.name) data.name = options.name;
        const result = await api.create(boardId, data as any);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  labels
    .command('update <id>')
    .description('Update a label')
    .option('-n, --name <name>', 'Label name')
    .option('-c, --color <color>', 'Label color')
    .option('-p, --position <n>', 'Label position')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new LabelsAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.color !== undefined) data.color = options.color;
        if (options.position !== undefined) data.position = Number(options.position);
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  labels
    .command('delete <id>')
    .description('Delete a label')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new LabelsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Label ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
