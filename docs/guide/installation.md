# Installation Guide for LLM Agents

You are an AI agent (Claude Code, Codex, Cursor, etc.). This guide is written for you. Do not make the human read it.

## Quick Prompt (for humans to copy-paste)

If a human pasted this to you, follow the instructions below:

> Install and configure `@orangemust/planka-cli` by following the guide at `docs/guide/installation.md`. First check `~/.planka/config.json` if it exists. If not, ask me for my PLANKA server URL, email, and password. Login, then verify with `planka-cli projects list`.

---

## What You're Installing

`@orangemust/planka-cli` is a CLI tool for [PLANKA](https://github.com/plankanban/planka) — a self-hosted kanban project management application. It lets you (the agent) manage projects, boards, lists, cards, users, labels, comments, tasks, custom fields, webhooks, and more — all from the command line.

Humans should not type these commands. You should.

---

## Step 1: Install the Package

```bash
npm install -g @orangemust/planka-cli
```

Or run without installing via npx:

```bash
npx @orangemust/planka-cli --help
```

Verify:

```bash
which planka-cli && planka-cli --version
```

If `command not found`:

```bash
export PATH="$(npm root -g)/../bin:$PATH"
```

If you get a permission error on macOS/Linux:

```bash
sudo npm install -g @orangemust/planka-cli
```

---

## Step 2: Check Existing Config

```bash
planka-cli config info
```

If a `baseUrl` and `bearerToken` (or `apiKey`) already exist, you can skip login and go straight to verification. If not, continue to Step 3.

---

## Step 3: Authenticate

PLANKA is self-hosted. You must know the server URL. The CLI has two ways to log in:

**Interactive mode (let the user type credentials themself):**
```bash
planka-cli login
```
This prompts for URL, email, and password (password input is hidden). Best choice when the user is at a terminal.

**Non-interactive mode (you supply the values):**
```bash
planka-cli login --url https://planka.example.com --email you@example.com --password yourpassword
```

This will:
1. Call `POST /api/access-tokens` to get a JWT
2. Call `GET /api/users/me` to confirm identity
3. Save the config to `~/.planka/config.json`

**Ask the human for these three values:**
- PLANKA server URL (e.g. `https://planka.example.com`)
- Email or username
- Password

Do NOT hardcode credentials. Ask every time.

After login, config looks like:
```json
{
  "baseUrl": "https://planka.example.com",
  "bearerToken": "eyJhbGciOiJI..."
}
```

> **Note**: Bearer tokens expire. If commands start failing with 401, re-run `login`.

---

## Step 4: Verify

```bash
planka-cli projects list
```

JSON output = it works. `401` = bad credentials or expired token. `502` = server is down or URL is wrong.

---

## All Commands

Every command prints JSON to stdout. Errors print to stderr and exit with code 1.

### Global Options

| Flag | Description |
|---|---|
| `--base-url <url>` | Override PLANKA server URL |
| `--api-key <key>` | Override API key |

These override the saved config. Bearer token from login takes priority over API key.

### Config

```bash
planka-cli config init --url <url> --api-key <key>
planka-cli config set --url <url>
planka-cli config key --api-key <key>
planka-cli config info
planka-cli config clear
```

### Projects

```bash
planka-cli projects list
planka-cli projects get <id>
planka-cli projects create -n "Name" [-t private|shared] [-d "Description"]
planka-cli projects update <id> [-n "New Name"] [-d "New Desc"] [--favorite|--no-favorite] [--hidden|--no-hidden]
planka-cli projects delete <id>
```

### Boards

```bash
planka-cli boards create <projectId> -n "Name" [-p <position>]
planka-cli boards get <id> [--subscribe]
planka-cli boards update <id> [-n "Name"] [-p <position>] [--default-view kanban|grid|list]
planka-cli boards delete <id>
```

### Lists

```bash
planka-cli lists create <boardId> -n "Name" [-t active|closed] [-p <position>]
planka-cli lists get <id>
planka-cli lists update <id> [-n "Name"] [-p <position>] [-c <color>] [-t active|closed|archive|trash]
planka-cli lists delete <id>
planka-cli lists clear <id>
planka-cli lists move-cards <id> <toListId>
planka-cli lists sort <id> -f <fieldName> -o asc|desc
```

### Cards

```bash
planka-cli cards list <listId> [--search <q>] [--user-ids <ids>] [--label-ids <ids>] [--before-id <id>]
planka-cli cards get <id>
planka-cli cards create <listId> -n "Name" [-d "Description"] [--due-date <date>] [-p <position>] [-t project|story]
planka-cli cards update <id> [-n "Name"] [-d "Desc"] [--due-date <date>] [--due-completed|--no-due-completed] [--list-id <id>] [--board-id <id>]
planka-cli cards delete <id>
planka-cli cards duplicate <id> [-n "Name"] [--list-id <id>] [--board-id <id>] [-p <position>]
```

### Users

```bash
planka-cli users list
planka-cli users get <id> [--subscribe]
planka-cli users create --email <email> --name "Name" --username <username> --password <pass> [--role admin|projectOwner|boardUser]
planka-cli users update <id> [--name "Name"] [--role <role>] [--language <lang>] [--deactivate|--no-deactivate]
planka-cli users delete <id>
planka-cli users api-key <id>
planka-cli users update-email <id> --email <email> --current-password <pass>
planka-cli users update-password <id> --password <new> --current-password <pass>
planka-cli users update-username <id> --username <name> --current-password <pass>
```

### Comments

```bash
planka-cli comments list <cardId> [--before-id <id>]
planka-cli comments create <cardId> -t "Comment text"
planka-cli comments update <id> -t "Updated text"
planka-cli comments delete <id>
```

### Labels

```bash
planka-cli labels create <boardId> -c <color> [-n "Name"] [-p <position>]
planka-cli labels update <id> [-n "Name"] [-c <color>] [-p <position>]
planka-cli labels delete <id>
planka-cli card-labels add <cardId> <labelId>
planka-cli card-labels remove <cardId> <labelId>
```

Label colors: `berry-red`, `pumpkin-orange`, `lagoon-blue`, `pink-tulip`, `light-mud`, `antique-blue`, `dark-granite`, `bright-moss`, `turquoise-sea`, `orange-peel`, and [more swagger-defined variants](https://raw.githubusercontent.com/mack-peng/planka-cli/main/docs/guide/installation.md).

### Tasks & Task Lists

```bash
planka-cli task-lists create <cardId> -n "Name" [-p <position>] [--hide-completed] [--show-on-front]
planka-cli task-lists get <id>
planka-cli task-lists update <id> [-n "Name"] [-p <position>] [--hide-completed|--no-hide-completed]
planka-cli task-lists delete <id>
planka-cli tasks create <taskListId> -n "Name" [-p <position>] [--completed] [--linked-card-id <id>]
planka-cli tasks update <id> [-n "Name"] [-p <position>] [--completed|--no-completed] [--assignee-user-id <id>]
planka-cli tasks delete <id>
```

### Memberships

```bash
planka-cli board-memberships create <boardId> <userId> -r editor|viewer [--can-comment|--no-can-comment]
planka-cli board-memberships update <id> [-r editor|viewer] [--can-comment|--no-can-comment]
planka-cli board-memberships delete <id>
planka-cli card-memberships add <cardId> <userId>
planka-cli card-memberships remove <cardId> <userId>
```

### Activity & Notifications

```bash
planka-cli actions board <boardId> [--before-id <id>]
planka-cli actions card <cardId> [--before-id <id>]
planka-cli notifications list
planka-cli notifications get <id>
planka-cli notifications read <id>
planka-cli notifications unread <id>
planka-cli notifications read-all
```

### Custom Fields

```bash
planka-cli base-custom-field-groups create <projectId> -n "Group Name"
planka-cli base-custom-field-groups update <id> -n "New Name"
planka-cli base-custom-field-groups delete <id>
planka-cli custom-field-groups get <id>
planka-cli custom-field-groups create-board <boardId> -n "Name" [-p <position>] [--base-id <id>]
planka-cli custom-field-groups create-card <cardId> -n "Name" [-p <position>] [--base-id <id>]
planka-cli custom-field-groups update <id> [-n "Name"] [-p <position>]
planka-cli custom-field-groups delete <id>
planka-cli custom-fields create <groupId> -n "Name" [-p <position>] [--show-on-front] [--base]
planka-cli custom-fields update <id> [-n "Name"] [-p <position>] [--show-on-front|--no-show-on-front]
planka-cli custom-fields delete <id>
planka-cli custom-field-values set <cardId> <customFieldGroupId> <customFieldId> -c "Value"
planka-cli custom-field-values delete <cardId> <customFieldGroupId> <customFieldId>
```

### Webhooks

```bash
planka-cli webhooks list
planka-cli webhooks create -n "Name" -u <url> -e "event1,event2" [--excluded-events "evt3"] [--access-token <token>]
planka-cli webhooks update <id> [-n "Name"] [-u <url>] [-e "events"] [--excluded-events "evt"]
planka-cli webhooks delete <id>
```

### Notification Services

```bash
planka-cli notification-services create-for-board <boardId> -u <url> -f text|markdown|html
planka-cli notification-services create-for-user <userId> -u <url> -f text|markdown|html
planka-cli notification-services update <id> [-u <url>] [-f text|markdown|html]
planka-cli notification-services delete <id>
planka-cli notification-services test <id>
```

### Project Managers

```bash
planka-cli project-managers create <projectId> <userId>
planka-cli project-managers delete <id>
```

### Attachments & Background Images

```bash
planka-cli attachments update <id> [-n "New Name"]
planka-cli attachments delete <id>
planka-cli background-images upload <projectId> <filepath>
planka-cli background-images delete <id>
```

### Server Config (admin only)

```bash
planka-cli server-config get
planka-cli server-config update [--smtp-from <email>] [--smtp-host <host>] [--smtp-port <port>] [--smtp-user <user>] [--smtp-password <password>]
planka-cli server-config test-smtp
```

### Bootstrap & Terms

```bash
planka-cli misc bootstrap
planka-cli misc terms [-l <language>]
```

---

## Auth & Config Priority

| Priority | Method | Example |
|---|---|---|
| 1 | CLI flag | `planka-cli --base-url https://x.com --api-key abc projects list` |
| 2 | Environment | `PLANKA_BASE_URL`, `PLANKA_API_KEY`, `PLANKA_BEARER_TOKEN` |
| 3 | Config file | `~/.planka/config.json` |

```bash
export PLANKA_BASE_URL=https://planka.example.com
export PLANKA_API_KEY=your-api-key
```

---

## Common Failures Agents Face

**"API 401: Unauthorized"**
→ Bearer token expired. Re-run `planka-cli login`.

**"API 502: Bad Gateway"**
→ PLANKA server is down, restarting, or the base URL is wrong. Try `curl <baseUrl>/api/projects` to debug.

**"API 400: ... 'position' is required ..."**
→ Most create commands require `position`. Defaults are built in (65535), but if you're using the `--position` flag, make sure it's a number.

**"API 400: ... 'type' is required ..."**
→ Some create commands require `type` (projects need `private|shared`, lists need `active|closed`, cards need `project|story`). Defaults are set.

**"command not found: planka-cli"**
→ Global install didn't register. Run `export PATH="$(npm root -g)/../bin:$PATH"` or reinstall.

**JSON output looks messy**
→ That's intentional. Parse with `jq`:
```bash
planka-cli projects list | jq '.items[] | {id, name}'
```

---

## The One-Liner

For agents that trust copy-paste:

```bash
npm install -g @orangemust/planka-cli && planka-cli login --url https://planka.example.com --email you@example.com --password yourpass && planka-cli projects list
```

Replace the URL, email, and password. Humans can paste this and you handle the rest. Or just run `planka-cli login` to enter credentials interactively.

---

## Typical Agent Workflow

As an agent, a common request is to create a board with lists and cards. Here's the pattern:

```bash
# 1. Find or create a project
PID=$(planka-cli projects list | jq -r '.items[0].id')

# 2. Create a board
BID=$(planka-cli boards create $PID -n "Sprint Board" | jq -r '.item.id')

# 3. Create lists
L1=$(planka-cli lists create $BID -n "To Do" | jq -r '.item.id')
L2=$(planka-cli lists create $BID -n "In Progress" | jq -r '.item.id')
L3=$(planka-cli lists create $BID -n "Done" | jq -r '.item.id')

# 4. Create cards
planka-cli cards create $L1 -n "Task 1" -d "Description here"
planka-cli cards create $L1 -n "Task 2" -d "Another task"

# 5. Verify
planka-cli cards list $L1 | jq '.items[].name'
```

---

## Done

You now have programmatic control over PLANKA. Manage kanban boards, cards, users, labels, and more — all from a terminal an agent can automate.

If something breaks: check auth first (`planka-cli config info`). 90% of issues are expired tokens or wrong URLs. Re-login fixes most auth problems.
