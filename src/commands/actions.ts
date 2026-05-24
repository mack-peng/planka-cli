import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { ActionsAPI } from '../api/actions';
import { formatOutput } from '../utils/output';

export function registerActionCommands(program: Command): void {
  const actions = program.command('actions').description('View board/card actions').alias('act');

  actions
    .command('board <boardId>')
    .description('Get board actions')
    .option('--before-id <id>', 'Paginate before action ID')
    .action(async (boardId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ActionsAPI(client);
        const result = await api.getBoardActions(boardId, options.beforeId);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  actions
    .command('card <cardId>')
    .description('Get card actions')
    .option('--before-id <id>', 'Paginate before action ID')
    .action(async (cardId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ActionsAPI(client);
        const result = await api.getCardActions(cardId, options.beforeId);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
