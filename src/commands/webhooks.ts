import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { WebhooksAPI } from '../api/webhooks';
import { formatOutput } from '../utils/output';

export function registerWebhookCommands(program: Command): void {
  const webhooks = program.command('webhooks').description('Manage webhooks').alias('wh');

  webhooks
    .command('list')
    .description('List all webhooks')
    .action(async (_options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new WebhooksAPI(client);
        const result = await api.list();
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  webhooks
    .command('create')
    .description('Create a webhook')
    .requiredOption('-n, --name <name>', 'Webhook name')
    .requiredOption('-u, --url <url>', 'Webhook URL')
    .requiredOption('-e, --events <events>', 'Comma-separated event list')
    .option('--excluded-events <events>', 'Comma-separated excluded events')
    .option('--access-token <token>', 'Webhook access token')
    .action(async (options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new WebhooksAPI(client);
        const result = await api.create({
          name: options.name,
          url: options.url,
          events: options.events,
          excludedEvents: options.excludedEvents,
          accessToken: options.accessToken,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  webhooks
    .command('update <id>')
    .description('Update a webhook')
    .option('-n, --name <name>', 'Webhook name')
    .option('-u, --url <url>', 'Webhook URL')
    .option('-e, --events <events>', 'Comma-separated event list')
    .option('--excluded-events <events>', 'Comma-separated excluded events')
    .option('--access-token <token>', 'Webhook access token')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new WebhooksAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.url !== undefined) data.url = options.url;
        if (options.events !== undefined) data.events = options.events;
        if (options.excludedEvents !== undefined) data.excludedEvents = options.excludedEvents;
        if (options.accessToken !== undefined) data.accessToken = options.accessToken;
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  webhooks
    .command('delete <id>')
    .description('Delete a webhook')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new WebhooksAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Webhook ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
