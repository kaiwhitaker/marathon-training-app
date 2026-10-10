<!-- software-factory:start -->
# Software factory

Every task, in every repo, with any agent (Claude Code, Codex, or anything
else that reads `AGENTS.md` and `SKILL.md`), goes through the same five
steps. Each step has a skill. If your agent doesn't load skills on its own,
open the skill's `SKILL.md` and follow it.

Skills live in `.agents/skills/` in the repo (vendored copy) or in
`~/.agents/skills/` and `~/.claude/skills/` (global install on Kai's Mac
mini). Repo-specific facts (commands, invariants, what runs where) are in the
repo's own `AGENTS.md`, after the factory block. Where they conflict with the
factory, the repo wins. A repo with no repo section hasn't adopted the factory
yet; offer to run `adopt-factory`.

## Know where you are

Check this first. Several skills behave differently depending on it.

- **Local**: Kai's Mac mini. A shared checkout that other agents may also be
  using, the real app can run, `gh` is installed and signed in.
- **Cloud**: a container from Claude Code on the web, Codex cloud, or
  similar. You have your own fresh clone and usually an assigned branch, no
  display, and possibly no `gh` (use the GitHub tools you were given).

If unsure: `uname -s` prints `Darwin` locally; a cloud container is Linux.

## Workflow

1. **Start: `start-task`.** Get onto a task branch from the latest
   `origin/main` (locally, in its own git worktree). Check open PRs for
   files you'd also touch. Install and run the checks once for a baseline.
2. **Build: `code-structure`.** Flows decide *why and when*; shared
   services do the *how*, take explicit inputs, and return results. Keep
   platform-specific calls in small functions so the logic around them can
   be tested anywhere.
3. **Prove: `prove-it`.** Capture the before while reproducing, add a test,
   capture the after. Use the strongest evidence your environment allows,
   and write a manual checklist for whatever you couldn't run.
4. **Review: `review-loop`.** Review your own diff with your agent's review
   command, fix, repeat until clean (max 3 rounds). Add a security review
   when the diff touches secrets, auth, shell commands, or elevated
   permissions.
5. **Ship.** Open the PR (see "Completing a task") and end by giving Kai
   its URL.

## Writing for humans

Apply `unslop` to anything Kai or anyone else will read before you commit or
post it: commit messages, PR title and body, docs, code comments, and your
closing reply. Only to text you wrote or changed.

## Rules

- Never commit to `main`. Never force-push except `--force-with-lease` on
  your own task branch.
- One task, one branch. Never touch another agent's branch, worktree, or
  uncommitted work.
- Resolve lockfile conflicts by regenerating, never by hand-merging.
- Worktrees don't isolate ports or databases. Confirm a dev server is
  *yours* before trusting it.
- If a conflict or a decision can't be resolved confidently, stop and ask.
- Don't merge a PR unless Kai asks.

## Completing a task

1. Keep changes to the assigned task.
2. Run the repo's checks (listed in the repo section below).
3. Commit with a clear message, bring in the latest `origin/main`, rerun
   the checks.
4. Push: `git push -u origin <branch>`.
5. Open the PR. The body covers: what changed; a **Testing** section with
   the evidence from `prove-it` (check results, before/after, manual
   checklist); review findings you chose not to fix, and why; risks and
   follow-ups.
6. Give Kai the PR URL.
<!-- software-factory:end -->

# This repo

## What it is

A sub-4:00 marathon training tracker: React 18 from a CDN, no build step,
served by GitHub Pages at kaiwhitaker.github.io/marathon-training-app.
Workout logs live in the browser's `localStorage`.

## Code layout

- `index.html`: the whole app.
- `marathon-training-plan.jsx`: the Claude-artifact version of the same app.
  When you change behavior in one, make the same change in the other, or
  say in the PR why not.
- Plan data (weeks, workouts, pacing, fueling) is the "service" layer;
  components decide what to show. Keep them apart.

## Commands

| What | Command |
|---|---|
| Install | None. No build step. |
| Checks | None automated. Open `index.html` in a browser and check the browser console for errors. |
| Run locally | `python3 -m http.server 8000`, then open http://localhost:8000 |

## What runs where

Everything runs anywhere with a browser. In a cloud container, use
Playwright (Chromium is preinstalled) to load the page and take before/after
screenshots for `prove-it`; check desktop and phone widths.

## Hard rules

- Merging to `main` deploys to GitHub Pages immediately. There is no staging.
- Keep it buildless: plain HTML/CSS/JS, libraries from a CDN with pinned versions.
- Repo files other than dot-folders (including `AGENTS.md`, `CLAUDE.md`,
  `README.md`) are publicly served by Pages. Never put secrets or private
  notes in them.

- Never change the `localStorage` key (`training-v2`) or the shape of saved logs without a
  migration. Losing someone's logged workouts is the worst bug this app can have.
