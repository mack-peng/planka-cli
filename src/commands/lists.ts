import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { ListsAPI } from '../api/lists';
import { formatOutput } from '../utils/output';

export function registerListCommands(program: Command): void {
  const lists = program.command('lists').description('Manage lists').alias('l');

  lists
    .command('get <id>')
    .description('Get list details')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ListsAPI(client);
        const result = await api.get(id);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  lists
    .command('create <boardId>')
    .description('Create a list in a board')
    .requiredOption('-n, --name <name>', 'List name')
    .option('-p, --position <n>', 'List position', '65535')
    .option('-t, --type <type>', 'List type', 'active')
    .action(async (boardId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ListsAPI(client);
        const result = await api.create(boardId, {
          name: options.name,
          position: Number(options.position),
          type: options.type,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  lists
    .command('update <id>')
    .description('Update a list')
    .option('-n, --name <name>', 'List name')
    .option('-p, --position <n>', 'List position')
    .option('-c, --color <color>', 'List color')
    .option('-t, --type <type>', 'List type')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ListsAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.position !== undefined) data.position = Number(options.position);
        if (options.color !== undefined) data.color = options.color;
        if (options.type !== undefined) data.type = options.type;
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  lists
    .command('delete <id>')
    .description('Delete a list')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ListsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `List ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  lists
    .command('clear <id>')
    .description('Clear all cards from a list')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ListsAPI(client);
        await api.clear(id);
        console.log(formatOutput({ status: 'ok', message: `List ${id} cleared` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  lists
    .command('move-cards <id> <toListId>')
    .description('Move all cards from one list to another')
    .action(async (id, toListId, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ListsAPI(client);
        await api.moveCards(id, toListId);
        console.log(formatOutput({ status: 'ok', message: `Cards moved from ${id} to ${toListId}` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  lists
    .command('sort <id>')
    .description('Sort cards in a list')
    .requiredOption('-f, --field <name>', 'Field name to sort by')
    .requiredOption('-o, --order <order>', 'Sort order (asc|desc)')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ListsAPI(client);
        await api.sort(id, options.field, options.order);
        console.log(formatOutput({ status: 'ok', message: `List ${id} sorted by ${options.field} ${options.order}` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
