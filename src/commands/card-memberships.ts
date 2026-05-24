import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { CardMembershipsAPI } from '../api/card-memberships';
import { formatOutput } from '../utils/output';

export function registerCardMembershipCommands(program: Command): void {
  const cardMemberships = program.command('card-memberships').description('Manage card members').alias('cmm');

  cardMemberships
    .command('add <cardId> <userId>')
    .description('Add a user to a card')
    .action(async (cardId, userId, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CardMembershipsAPI(client);
        const result = await api.add(cardId, userId);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  cardMemberships
    .command('remove <cardId> <userId>')
    .description('Remove a user from a card')
    .action(async (cardId, userId, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CardMembershipsAPI(client);
        await api.remove(cardId, userId);
        console.log(formatOutput({ status: 'ok', message: `User ${userId} removed from card ${cardId}` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
