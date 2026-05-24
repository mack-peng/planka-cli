import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { CardLabelsAPI } from '../api/card-labels';
import { formatOutput } from '../utils/output';

export function registerCardLabelCommands(program: Command): void {
  const cardLabels = program.command('card-labels').description('Manage card-label associations').alias('cl');

  cardLabels
    .command('add <cardId> <labelId>')
    .description('Add a label to a card')
    .action(async (cardId, labelId, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CardLabelsAPI(client);
        const result = await api.add(cardId, labelId);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  cardLabels
    .command('remove <cardId> <labelId>')
    .description('Remove a label from a card')
    .action(async (cardId, labelId, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new CardLabelsAPI(client);
        await api.remove(cardId, labelId);
        console.log(formatOutput({ status: 'ok', message: `Label ${labelId} removed from card ${cardId}` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
