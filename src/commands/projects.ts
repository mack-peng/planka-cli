import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { ProjectsAPI } from '../api/projects';
import { formatOutput } from '../utils/output';

export function registerProjectCommands(program: Command): void {
  const projects = program.command('projects').description('Manage projects').alias('p');

  projects
    .command('list')
    .description('List all accessible projects')
    .action(async (_options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ProjectsAPI(client);
        const result = await api.list();
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  projects
    .command('get <id>')
    .description('Get project details')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ProjectsAPI(client);
        const result = await api.get(id);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  projects
    .command('create')
    .description('Create a new project')
    .requiredOption('-n, --name <name>', 'Project name')
    .option('-d, --description <desc>', 'Project description')
    .option('-t, --type <type>', 'Project type (private|shared)', 'private')
    .action(async (options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ProjectsAPI(client);
        const result = await api.create({
          name: options.name,
          description: options.description,
          type: options.type,
        });
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  projects
    .command('update <id>')
    .description('Update a project')
    .option('-n, --name <name>', 'Project name')
    .option('-d, --description <desc>', 'Project description')
    .option('--background-gradient <gradient>', 'Background gradient')
    .option('--background-image-id <id>', 'Background image ID')
    .option('--background-type <type>', 'Background type (gradient|image)')
    .option('--favorite', 'Mark as favorite')
    .option('--no-favorite', 'Unmark as favorite')
    .option('--hidden', 'Hide project')
    .option('--no-hidden', 'Unhide project')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ProjectsAPI(client);
        const data: Record<string, unknown> = {};
        if (options.name !== undefined) data.name = options.name;
        if (options.description !== undefined) data.description = options.description;
        if (options.backgroundGradient !== undefined) data.backgroundGradient = options.backgroundGradient;
        if (options.backgroundImageId !== undefined) data.backgroundImageId = options.backgroundImageId;
        if (options.backgroundType !== undefined) data.backgroundType = options.backgroundType;
        if (options.favorite !== undefined) data.isFavorite = options.favorite;
        if (options.hidden !== undefined) data.isHidden = options.hidden;
        const result = await api.update(id, data);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  projects
    .command('delete <id>')
    .description('Delete a project')
    .option('--force', 'Skip confirmation')
    .action(async (id, options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new ProjectsAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Project ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
