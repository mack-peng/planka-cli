import { Command } from 'commander';
import { ApiClient } from '../api/client';
import { MiscAPI } from '../api/misc';
import { formatOutput } from '../utils/output';
import { promptText, promptHidden } from '../utils/prompt';
import { BackgroundImagesAPI } from '../api/background-images';
import { AccessTokensAPI } from '../api/access-tokens';

export function registerMiscCommands(program: Command): void {
  const misc = program.command('misc').description('Miscellaneous API endpoints').alias('m');

  misc
    .command('bootstrap')
    .description('Get application bootstrap data')
    .action(async (_options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new MiscAPI(client);
        const result = await api.bootstrap();
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  misc
    .command('terms')
    .description('Get terms and conditions')
    .option('-l, --language <lang>', 'Language code')
    .action(async (options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new MiscAPI(client);
        const result = await api.terms(options.language);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  const login = program.command('login')
    .description('Login with email/username and password (saves auth token). Run without options for interactive mode.')
    .option('-u, --url <url>', 'PLANKA server base URL')
    .option('--email <emailOrUsername>', 'Email or username')
    .option('--password <password>', 'Password')
    .action(async (options, command) => {
      try {
        const opts = command.optsWithGlobals();

        let baseUrl = options.url || opts.baseUrl;
        if (!baseUrl) {
          baseUrl = await promptText('Server URL: ');
        }

        let email = options.email;
        if (!email) {
          email = await promptText('Email/Username: ');
        }

        let password = options.password;
        if (!password) {
          password = await promptHidden('Password: ');
        }

        const loginClient = new ApiClient({ baseUrl });
        const tokenApi = new AccessTokensAPI(loginClient);
        const loginResult = await tokenApi.login(email, password);
        const token = loginResult.item;

        const authClient = new ApiClient({ baseUrl, bearerToken: token });
        const userRes = await authClient.request<{ item: { id: string; email: string; name: string; username: string } }>('/users/me');

        const { ConfigManager } = await import('../utils/config');
        const mgr = new ConfigManager();
        mgr.save({ baseUrl, bearerToken: token });

        console.log(formatOutput({
          status: 'ok',
          message: 'Login successful, auth token saved to config',
          user: {
            id: userRes.item.id,
            email: userRes.item.email,
            name: userRes.item.name,
            username: userRes.item.username,
          },
        }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  const bgImages = program.command('background-images').description('Manage background images').alias('bg');

  bgImages
    .command('upload <projectId> <filepath>')
    .description('Upload a background image to a project')
    .action(async (projectId, filepath, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BackgroundImagesAPI(client);
        const fs = await import('fs');
        const fileData = fs.readFileSync(filepath);
        const formData = new FormData();
        formData.append('file', new Blob([fileData]));
        const result = await api.upload(projectId, formData);
        console.log(formatOutput(result));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });

  bgImages
    .command('delete <id>')
    .description('Delete a background image')
    .action(async (id, _options, command) => {
      try {
        const opts = command.optsWithGlobals();
        const client = new ApiClient({ baseUrl: opts.baseUrl, apiKey: opts.apiKey });
        const api = new BackgroundImagesAPI(client);
        await api.delete(id);
        console.log(formatOutput({ status: 'ok', message: `Background image ${id} deleted` }));
      } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        process.exit(1);
      }
    });
}
