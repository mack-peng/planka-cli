import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { ProjectManagersAPI } from '../api/project-managers';
import { formatOutput } from '../utils/output';

export function registerProjectManagerCommands(program: Command): void {
  const projectManagers = program.command('project-managers').description('Manage project managers').alias('pm');

  projectManagers
    .command('create <projectId> <userId>')
    .description('Add a user as project manager')
    .action(async (projectId, userId, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ProjectManagersAPI(client);
        const result = await api.create(projectId, userId);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  projectManagers
    .command('delete <id>')
    .description('Delete a project manager')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ProjectManagersAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Project manager ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
