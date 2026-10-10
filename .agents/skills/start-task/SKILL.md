---
name: start-task
description: Get onto a clean task branch from the latest origin/main before writing any code, using a git worktree on a shared local checkout, and check open PRs for overlap. Use at the start of every feature, fix, or task.
---

# Start task

Based on `new-feature` from michaelshimeles/skills, with a path for cloud
containers added.

## 1. Sync and scope-check (everywhere)

1. `git fetch origin`.
2. List open PRs and the files each one changes. Locally:
   `gh pr list` and `gh pr diff <n> --name-only`. In the cloud without
   `gh`, use your GitHub tools (list pull requests, get PR files).
3. If your task needs files an open PR is already changing, stop and ask
   Kai which goes first.
4. Check `git status` for uncommitted work. If it isn't yours, leave it
   alone and tell Kai.

## 2a. Local (Mac mini): make a worktree

Other agents may be working in the same checkout, so never work directly in
it.

- **If your harness already manages worktrees** (Claude Code puts them under
  `.claude/worktrees/`, Codex and Cursor have their own), keep the worktree
  and branch it gave you and skip to step 3.
- Otherwise, from the repo root:

  ```bash
  name=<short-task-name>-$(openssl rand -hex 2)   # e.g. user-auth-3f9a
  git worktree add .worktrees/$name -b agent/$name origin/main
  cd .worktrees/$name
  git branch --show-current                       # must print agent/$name
  ```

  `.worktrees/` must be in `.gitignore`. If the name exists, pick another;
  never reuse or force.

## 2b. Cloud container: use the assigned branch

You already have your own clone. Stay on the branch the session assigned.
`git branch --show-current` must not print `main`; if it does and nothing
was assigned, `git checkout -b agent/<short-task-name>`.

If the branch has no commits of its own, `git reset --hard origin/main` so
you start from current code. If its earlier PR already merged, restart it
from `origin/main` instead of stacking on merged history.

## 3. Install and baseline

Install dependencies fresh (worktrees don't share `node_modules` or
virtualenvs) using the commands in the repo's `AGENTS.md`. Then run the
repo's checks once and note anything already failing, so you don't chase
it later.

## Cleanup (local, after the PR merges or closes)

```bash
git worktree remove .worktrees/<name>
git branch -D agent/<name>      # -D because squash merges confuse -d
```
