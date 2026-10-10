---
name: adopt-factory
description: Set up a repo to follow the software factory - copy the skills and workflow in, then write the repo-specific section of AGENTS.md (commands, what runs where, code layout, hard rules) from what's actually in the repo. Use when a repo has no factory block in AGENTS.md, or when Kai asks to adopt or refresh the factory in a repo.
---

# Adopt the factory

Follow `start-task` first: this change ships as a normal PR.

## 1. Get the factory

- Mac mini: the clone that `install.sh` ran from (it's where
  `~/.agents/skills/start-task` points: `readlink ~/.agents/skills/start-task`).
- Anywhere else: `git clone https://github.com/kaiwhitaker/software-factory`
  into a temp directory outside the repo.

## 2. Sync

```bash
<factory>/scripts/sync-repo.sh <repo>
```

This writes the factory block into `AGENTS.md`, copies the skills to
`.agents/skills/`, links `.claude/skills` to them, and creates a one-line
`CLAUDE.md` (`@AGENTS.md`) so Claude Code reads the same file.

If the repo already had a `CLAUDE.md` with real content, move that content
into the repo section of `AGENTS.md` and replace `CLAUDE.md` with
`@AGENTS.md`. Same for `.cursorrules` or similar files: one source of truth.

## 3. Write the repo section

Fill in the section after the factory block (the template has the
headings) from the repo itself, not from guesses:

- **Commands.** Read `package.json` scripts, `pyproject.toml`, `Makefile`,
  CI config, and the README. Run each command once to confirm it works,
  and say in the PR which you couldn't run here.
- **What runs where.** Try running the app and checks in the current
  environment. Anything that needs macOS, a device, secrets, or a GUI goes
  in the "Only on the Mac mini" column.
- **Code layout.** Map the repo's directories to flows and services.
- **Hard rules.** Pull from the README, contributing docs, and existing
  agent files: versioning, release steps, privacy and security invariants.

## 4. Checks

If the repo has no automated checks at all, propose the smallest useful
one (a smoke test that imports the app and runs one command) and ask Kai
before adding a test framework.

## 5. Ship

Open the PR. Skills under `.agents/skills/` are a copy; to update them later,
rerun `sync-repo.sh`, never edit them in place (edits get overwritten).
Repo-only skills can live alongside them under any other name.
