import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { CommentsAPI } from '../api/comments';
import { formatOutput } from '../utils/output';

export function registerCommentCommands(program: Command): void {
  const comments = program.command('comments').description('Manage card comments').alias('cm');

  comments
    .command('list <cardId>')
    .description('List comments on a card')
    .option('--before-id <id>', 'Paginate before comment ID')
    .action(async (cardId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CommentsAPI(client);
        const result = await api.list(cardId, options.beforeId);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  comments
    .command('create <cardId>')
    .description('Create a comment on a card')
    .requiredOption('-t, --text <text>', 'Comment text')
    .action(async (cardId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CommentsAPI(client);
        const result = await api.create(cardId, options.text);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  comments
    .command('update <id>')
    .description('Update a comment')
    .requiredOption('-t, --text <text>', 'New comment text')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CommentsAPI(client);
        const result = await api.update(id, options.text);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  comments
    .command('delete <id>')
    .description('Delete a comment')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CommentsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Comment ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
