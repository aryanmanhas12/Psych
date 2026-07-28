# Vercel Agent Skills

Skills vendored from the Vercel open agent-skills ecosystem.

| Skill | Source repo | What it does |
| --- | --- | --- |
| `find-skills` | [vercel-labs/skills](https://github.com/vercel-labs/skills) | Discover and install skills from the open ecosystem |
| `composition-patterns` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | React composition patterns — compound components, avoiding boolean-prop sprawl, React 19 API changes |
| `deploy-to-vercel` | vercel-labs/agent-skills | Deploy a project to Vercel (preview by default) |
| `react-best-practices` | vercel-labs/agent-skills | 70 React/Next.js performance rules from Vercel Engineering |
| `react-native-skills` | vercel-labs/agent-skills | React Native / Expo performance and UI practices |
| `react-view-transitions` | vercel-labs/agent-skills | React View Transition API — page, shared-element, and list animations |
| `vercel-cli-with-tokens` | vercel-labs/agent-skills | Vercel CLI with token auth instead of `vercel login` |
| `vercel-optimize` | vercel-labs/agent-skills | Observability-first Vercel cost/performance audit |
| `web-design-guidelines` | vercel-labs/agent-skills | Review UI code against the Web Interface Guidelines |
| `writing-guidelines` | vercel-labs/agent-skills | Review docs/prose against the Writing Guidelines |

All are MIT/Apache-licensed by Vercel; per-skill `license` and `metadata` are preserved in each `SKILL.md`.

## Claude Code

Nothing to do — anything under `.claude/skills/` in this repo is picked up
automatically when a Claude Code session starts here. Confirm with `/skills`,
or invoke one by name (e.g. `/web-design-guidelines`).

To install them globally instead (available in every project on your machine):

```bash
cp -r .claude/skills/* ~/.claude/skills/
```

Or let the upstream CLI do it:

```bash
npx skills add vercel-labs/agent-skills --skill '*' -g -a claude-code -y
npx skills add vercel-labs/skills --skill find-skills -g -a claude-code -y
```

## Claude chat (claude.ai)

Chat skills are uploaded, not read from a repo. One zip per skill is prebuilt in
[`../skill-bundles/`](../skill-bundles/):

1. Download the `.zip` files from `.claude/skill-bundles/`.
2. In claude.ai go to **Settings → Capabilities → Skills → Upload skill**.
3. Upload each zip and toggle it on.

Each zip contains a single top-level directory holding that skill's `SKILL.md`
and its supporting files, which is the layout the uploader expects.

Note that `deploy-to-vercel`, `vercel-cli-with-tokens`, and `vercel-optimize`
shell out to the Vercel CLI and Node scripts, so they only do real work in
Claude Code — in chat they act as reference material.

## Updating

```bash
./.claude/update-vercel-skills.sh
```
