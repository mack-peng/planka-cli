import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import {
  registerConfigCommands,
  registerProjectCommands,
  registerBoardCommands,
  registerListCommands,
  registerCardCommands,
  registerUserCommands,
  registerCommentCommands,
  registerLabelCommands,
  registerCardLabelCommands,
  registerCardMembershipCommands,
  registerBoardMembershipCommands,
  registerAttachmentCommands,
  registerTaskCommands,
  registerTaskListCommands,
  registerCustomFieldCommands,
  registerCustomFieldGroupCommands,
  registerBaseCustomFieldGroupCommands,
  registerCustomFieldValueCommands,
  registerWebhookCommands,
  registerNotificationCommands,
  registerProjectManagerCommands,
  registerNotificationServiceCommands,
  registerActionCommands,
  registerServerConfigCommands,
  registerMiscCommands,
} from './commands';

function getVersion(): string {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
    );
    return pkg.version;
  } catch {
    return '0.1.0';
  }
}

export function decorateProgram(program: Command): void {
  program
    .name('planka-cli')
    .description('CLI tool for PLANKA - Real-Time Collaborative Kanban Board')
    .version(getVersion())
    .option('-u, --base-url <url>', 'PLANKA server base URL')
    .option('-k, --api-key <key>', 'PLANKA API key');

  registerConfigCommands(program);
  registerProjectCommands(program);
  registerBoardCommands(program);
  registerListCommands(program);
  registerCardCommands(program);
  registerUserCommands(program);
  registerCommentCommands(program);
  registerLabelCommands(program);
  registerCardLabelCommands(program);
  registerCardMembershipCommands(program);
  registerBoardMembershipCommands(program);
  registerAttachmentCommands(program);
  registerTaskCommands(program);
  registerTaskListCommands(program);
  registerCustomFieldCommands(program);
  registerCustomFieldGroupCommands(program);
  registerBaseCustomFieldGroupCommands(program);
  registerCustomFieldValueCommands(program);
  registerWebhookCommands(program);
  registerNotificationCommands(program);
  registerProjectManagerCommands(program);
  registerNotificationServiceCommands(program);
  registerActionCommands(program);
  registerServerConfigCommands(program);
  registerMiscCommands(program);
}
