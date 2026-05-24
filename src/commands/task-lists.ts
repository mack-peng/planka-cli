import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { TaskListsAPI } from '../api/task-lists';
import { formatOutput } from '../utils/output';

export function registerTaskListCommands(program: Command): void {
  const taskLists = program.command('task-lists').description('Manage task lists').alias('tl');

  taskLists
    .command('get <id>')
    .description('Get task list details')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new TaskListsAPI(client);
        const result = await api.get(id);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  taskLists
    .command('create <cardId>')
    .description('Create a task list on a card')
    .requiredOption('-n, --name <name>', 'Task list name')
    .option('-p, --position <n>', 'Task list position', '65535')
    .option('--hide-completed', 'Hide completed tasks')
    .option('--show-on-front', 'Show on front of card')
    .action(async (cardId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new TaskListsAPI(client);
        const result = await api.create(cardId, {
          name: options.name,
          position: Number(options.position),
          hideCompletedTasks: options.hideCompleted,
          showOnFrontOfCard: options.showOnFront,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  taskLists
    .command('update <id>')
    .description('Update a task list')
    .option('-n, --name <name>', 'Task list name')
    .option('-p, --position <n>', 'Task list position')
    .option('--hide-completed', 'Hide completed tasks')
    .option('--no-hide-completed', 'Show completed tasks')
    .option('--show-on-front', 'Show on front of card')
    .option('--no-show-on-front', 'Hide from front of card')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new TaskListsAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.position !== undefined) data.position = Number(options.position);
        if (options.hideCompleted !== undefined) data.hideCompletedTasks = options.hideCompleted;
        if (options.showOnFront !== undefined) data.showOnFrontOfCard = options.showOnFront;
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  taskLists
    .command('delete <id>')
    .description('Delete a task list')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new TaskListsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Task list ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
