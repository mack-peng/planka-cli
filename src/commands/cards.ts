import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { CardsAPI } from '../api/cards';
import { formatOutput } from '../utils/output';

export function registerCardCommands(program: Command): void {
  const cards = program.command('cards').description('Manage cards').alias('c');

  cards
    .command('list <listId>')
    .description('List cards in a list')
    .option('--search <q>', 'Search query')
    .option('--user-ids <ids>', 'Filter by user IDs (comma-separated)')
    .option('--label-ids <ids>', 'Filter by label IDs (comma-separated)')
    .option('--before-id <id>', 'Paginate before card ID')
    .option('--before-changed-at <date>', 'Paginate before listChangedAt')
    .action(async (listId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CardsAPI(client);
        const result = await api.list(listId, {
          search: options.search,
          userIds: options.userIds,
          labelIds: options.labelIds,
          beforeId: options.beforeId,
          beforeListChangedAt: options.beforeChangedAt,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  cards
    .command('get <id>')
    .description('Get card details')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CardsAPI(client);
        const result = await api.get(id);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  cards
    .command('create <listId>')
    .description('Create a card in a list')
    .requiredOption('-n, --name <name>', 'Card name')
    .option('-d, --description <desc>', 'Card description (Markdown)')
    .option('--due-date <date>', 'Due date')
    .option('-p, --position <n>', 'Card position', '65535')
    .option('-t, --type <type>', 'Card type')
    .action(async (listId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CardsAPI(client);
        const data: Record<string, unknown> = { name: options.name, type: options.type || 'project' };
        if (options.description) data.description = options.description;
        if (options.dueDate) data.dueDate = options.dueDate;
        if (options.position !== undefined) data.position = Number(options.position);
        const result = await api.create(listId, data as any);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  cards
    .command('update <id>')
    .description('Update a card')
    .option('-n, --name <name>', 'Card name')
    .option('-d, --description <desc>', 'Card description (Markdown)')
    .option('--due-date <date>', 'Due date')
    .option('--due-completed', 'Mark due as completed')
    .option('--no-due-completed', 'Unmark due as completed')
    .option('-p, --position <n>', 'Card position')
    .option('--list-id <id>', 'Move card to another list')
    .option('--board-id <id>', 'Move card to another board')
    .option('-t, --type <type>', 'Card type')
    .option('--subscribe', 'Subscribe to card')
    .option('--no-subscribe', 'Unsubscribe from card')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CardsAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.description !== undefined) data.description = options.description;
        if (options.dueDate !== undefined) data.dueDate = options.dueDate;
        if (options.dueCompleted !== undefined) data.isDueCompleted = options.dueCompleted;
        if (options.position !== undefined) data.position = Number(options.position);
        if (options.listId !== undefined) data.listId = options.listId;
        if (options.boardId !== undefined) data.boardId = options.boardId;
        if (options.type !== undefined) data.type = options.type;
        if (options.subscribe !== undefined) data.isSubscribed = options.subscribe;
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  cards
    .command('delete <id>')
    .description('Delete a card')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CardsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Card ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  cards
    .command('duplicate <id>')
    .description('Duplicate a card')
    .option('--list-id <id>', 'Target list ID')
    .option('--board-id <id>', 'Target board ID')
    .option('-n, --name <name>', 'New card name')
    .option('-p, --position <n>', 'New card position', '65535')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CardsAPI(client);
        const data: Record<string, unknown> = { position: Number(options.position) };
        if (options.listId) data.listId = options.listId;
        if (options.boardId) data.boardId = options.boardId;
        if (options.name) data.name = options.name;
        const result = await api.duplicate(id, data as any);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
