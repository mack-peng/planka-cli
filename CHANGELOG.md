# Changelog

## 0.1.0 (2026-05-24)

Initial release.

### Features

- Login with password → bearer token auto-stored to config
- Full CRUD: projects, boards, lists, cards
- Users, comments, labels, card-labels, card-memberships, board-memberships
- Tasks, task-lists, custom-fields, custom-field-values
- Webhooks, notifications, actions, server-config
- JSON output for all commands
- Config via CLI flags, env vars, or `~/.planka/config.json`
- http2 transport with User-Agent header
