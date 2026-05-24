import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { BoardsAPI } from '../api/boards';
import { formatOutput } from '../utils/output';

export function registerBoardCommands(program: Command): void {
  const boards = program.command('boards').description('Manage boards').alias('b');

  boards
    .command('get <id>')
    .description('Get board details')
    .option('--subscribe', 'Subscribe to board changes')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BoardsAPI(client);
        const result = await api.get(id, options.subscribe);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  boards
    .command('create <projectId>')
    .description('Create a board in a project')
    .requiredOption('-n, --name <name>', 'Board name')
    .option('-p, --position <n>', 'Board position', '65535')
    .action(async (projectId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BoardsAPI(client);
        const data: Record<string, unknown> = { name: options.name, position: Number(options.position) };
        const result = await api.create(projectId, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  boards
    .command('update <id>')
    .description('Update a board')
    .option('-n, --name <name>', 'Board name')
    .option('-p, --position <n>', 'Board position')
    .option('--default-view <view>', 'Default view (kanban|grid|list)')
    .option('--default-card-type <type>', 'Default card type')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BoardsAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.position !== undefined) data.position = Number(options.position);
        if (options.defaultView !== undefined) data.defaultView = options.defaultView;
        if (options.defaultCardType !== undefined) data.defaultCardType = options.defaultCardType;
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  boards
    .command('delete <id>')
    .description('Delete a board')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BoardsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Board ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
