import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { BoardMembershipsAPI } from '../api/board-memberships';
import { formatOutput } from '../utils/output';

export function registerBoardMembershipCommands(program: Command): void {
  const boardMemberships = program.command('board-memberships').description('Manage board members').alias('bm');

  boardMemberships
    .command('create <boardId> <userId>')
    .description('Add a user to a board')
    .requiredOption('-r, --role <role>', 'Member role (editor|viewer)')
    .option('--can-comment', 'User can comment (viewers only)')
    .option('--no-can-comment', 'User cannot comment')
    .action(async (boardId, userId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BoardMembershipsAPI(client);
        const result = await api.create(boardId, {
          userId,
          role: options.role,
          canComment: options.canComment !== undefined ? options.canComment : true,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  boardMemberships
    .command('update <id>')
    .description('Update a board membership')
    .option('-r, --role <role>', 'Member role (editor|viewer)')
    .option('--can-comment', 'User can comment')
    .option('--no-can-comment', 'User cannot comment')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BoardMembershipsAPI(client);
        const data: Record<string, unknown> = {};
        if (options.role !== undefined) data.role = options.role;
        if (options.canComment !== undefined) data.canComment = options.canComment;
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  boardMemberships
    .command('delete <id>')
    .description('Delete a board membership')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BoardMembershipsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Board membership ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
