import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { TasksAPI } from '../api/tasks';
import { formatOutput } from '../utils/output';

export function registerTaskCommands(program: Command): void {
  const tasks = program.command('tasks').description('Manage tasks').alias('t');

  tasks
    .command('create <taskListId>')
    .description('Create a task in a task list')
    .requiredOption('-n, --name <name>', 'Task name')
    .option('-p, --position <n>', 'Task position', '65535')
    .option('--completed', 'Mark task as completed')
    .option('--linked-card-id <id>', 'Linked card ID')
    .action(async (taskListId, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new TasksAPI(client);
        const result = await api.create(taskListId, {
          name: options.name,
          position: Number(options.position),
          isCompleted: options.completed,
          linkedCardId: options.linkedCardId,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  tasks
    .command('update <id>')
    .description('Update a task')
    .option('-n, --name <name>', 'Task name')
    .option('-p, --position <n>', 'Task position')
    .option('--completed', 'Mark task as completed')
    .option('--no-completed', 'Unmark task as completed')
    .option('--assignee-user-id <id>', 'Assignee user ID')
    .option('--task-list-id <id>', 'Move to task list')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new TasksAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.position !== undefined) data.position = Number(options.position);
        if (options.completed !== undefined) data.isCompleted = options.completed;
        if (options.assigneeUserId !== undefined) data.assigneeUserId = options.assigneeUserId;
        if (options.taskListId !== undefined) data.taskListId = options.taskListId;
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  tasks
    .command('delete <id>')
    .description('Delete a task')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new TasksAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Task ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
