# planka-cli

CLI tool for [PLANKA](https://github.com/plankanban/planka) — Real-Time Collaborative Kanban Boards. Manage projects, boards, lists, cards, users, labels, comments, and more from the command line.

## Installation

### For Humans

Paste this into your LLM agent session:

```
Install and configure planka-cli by following the README here:
https://raw.githubusercontent.com/mack-peng/planka-cli/main/README.md
```

**Alternative — do it yourself:**

```bash
git clone git@github.com:mack-peng/planka-cli.git
cd planka-cli
npm install && npm run build && npm link
```

Then log in to your PLANKA server:

```bash
planka-cli login --url https://your-planka.example.com --email you@example.com --password yourpassword
```

> **Note**: PLANKA is self-hosted. You must specify your server URL during login. The auth token is saved to `~/.planka/config.json`.

### For LLM Agents

If you're an LLM Agent helping set up planka-cli, follow these steps:

#### Step 1: Install

```bash
git clone git@github.com:mack-peng/planka-cli.git /tmp/planka-cli
cd /tmp/planka-cli
npm install && npm run build && npm link
```

#### Step 2: Ask for PLANKA server info

Ask the user for their PLANKA server URL, email, and password.

#### Step 3: Login and verify

```bash
planka-cli login --url <SERVER_URL> --email <EMAIL> --password <PASSWORD>
planka-cli projects list
```

#### Step 4: Confirm

Tell the user:

> You're logged in. Try `planka-cli --help` to see all available commands. Common ones: `planka-cli projects list`, `planka-cli boards get <id>`, `planka-cli cards list <listId>`.

---

## Usage

```bash
# Global options (override saved config)
planka-cli --base-url https://planka.example.com --api-key YOUR_KEY <command>

# First-time setup
planka-cli login --url https://planka.example.com --email you@example.com --password pass
planka-cli config info

# Projects
planka-cli projects list
planka-cli projects get <id>
planka-cli projects create -n "My Project"
planka-cli projects update <id> -n "New Name"
planka-cli projects delete <id>

# Boards
planka-cli boards create <projectId> -n "My Board"
planka-cli boards get <id>
planka-cli boards update <id> -n "New Name"
planka-cli boards delete <id>

# Lists
planka-cli lists create <boardId> -n "To Do" -t active
planka-cli lists get <id>
planka-cli lists update <id> -n "New Name"
planka-cli lists delete <id>

# Cards
planka-cli cards list <listId>
planka-cli cards create <listId> -n "My Card" -d "Description"
planka-cli cards get <id>
planka-cli cards update <id> -n "New Name"
planka-cli cards delete <id>
planka-cli cards duplicate <id> -n "Copy"

# Users & Members
planka-cli users list
planka-cli users get <id>
planka-cli card-memberships add <cardId> <userId>
planka-cli card-memberships remove <cardId> <userId>
planka-cli board-memberships create <boardId> <userId> -r editor
planka-cli board-memberships update <id> -r viewer

# Comments
planka-cli comments list <cardId>
planka-cli comments create <cardId> -t "Looks good!"
planka-cli comments update <id> -t "Updated"
planka-cli comments delete <id>

# Labels
planka-cli labels create <boardId> -c berry-red -n "Bug"
planka-cli labels update <id> -c pumpkin-orange
planka-cli labels delete <id>
planka-cli card-labels add <cardId> <labelId>
planka-cli card-labels remove <cardId> <labelId>

# Tasks & Task Lists
planka-cli task-lists create <cardId> -n "Checklist"
planka-cli task-lists get <id>
planka-cli task-lists update <id> -n "Updated"
planka-cli task-lists delete <id>
planka-cli tasks create <taskListId> -n "Do this"
planka-cli tasks update <id> --completed
planka-cli tasks delete <id>

# Activity & Notifications
planka-cli actions board <boardId>
planka-cli actions card <cardId>
planka-cli notifications list
planka-cli notifications read <id>
planka-cli notifications read-all

# Custom Fields
planka-cli base-custom-field-groups create <projectId> -n "Group"
planka-cli custom-field-groups create-board <boardId> -n "Fields"
planka-cli custom-fields create <groupId> -n "Priority"
planka-cli custom-field-values set <cardId> <groupId> <fieldId> -c "High"

# Webhooks & Services
planka-cli webhooks list
planka-cli webhooks create -n "Hook" -u https://hook.example.com -e "moveCard"
planka-cli notification-services create-for-board <boardId> -u https://ns.example.com -f text

# Server Config (admin)
planka-cli server-config get
planka-cli server-config update --smtp-host smtp.example.com --smtp-port 587
```

## Auth & Config

Three ways to configure, highest priority first:

| Priority | Method | Example |
|---|---|---|
| 1 | CLI flags | `planka-cli --base-url https://x.com --api-key abc projects list` |
| 2 | Environment | `PLANKA_BASE_URL`, `PLANKA_API_KEY`, `PLANKA_BEARER_TOKEN` |
| 3 | Config file | `~/.planka/config.json` |

```bash
planka-cli config init --url https://x.com --api-key YOUR_KEY
planka-cli config info
planka-cli config clear
```

## Tech Stack

TypeScript 5.x + Commander 12 + Node.js http2. No runtime dependencies beyond Commander. Output is always JSON.

## License

MIT
