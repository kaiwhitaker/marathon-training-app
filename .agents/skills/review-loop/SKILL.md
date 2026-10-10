---
name: review-loop
description: Review your own diff before the PR goes up - run your agent's review (Claude Code /code-review, Codex /review or `codex review`), fix real findings, and repeat until clean, max 3 rounds. Add a security review for risky diffs. Use after the change works and before opening or updating a PR.
---

# Review loop

Replaces `greploop` from michaelshimeles/skills, which needs Greptile. This
uses whatever reviewer your agent has, and on the Mac mini, the other agent
as a second opinion.

## Pick a reviewer

| You are | Review | Security review |
|---|---|---|
| Claude Code | `/code-review high` | `/security-review` |
| Codex | `/review` (interactive) or `codex review --base origin/main` from a shell | Run the review with the security prompt below |
| Anything else | The checklist at the bottom, done by a fresh subagent if you can start one | Same, with the security prompt |

**Second opinion (local only).** Both CLIs are installed on the Mac mini,
so the other agent can review your branch:

- From Claude Code: `codex review --base origin/main`
- From Codex: `claude -p "/code-review high"`

Use it on round 1 for anything non-trivial. Two different models catch
different things.

## Loop

1. Commit, then run the review against `origin/main`.
2. For each finding, trace a concrete input or state that causes the wrong
   result. Fix real ones. For ones you reject, write one line on why; they
   go in the PR body.
3. Rerun the repo's checks, commit, review again.
4. Stop when a round has nothing you'd act on, or after **3 rounds**. If
   round 3 still turns up new problems, stop and tell Kai what's left.

## Security review: when and how

Run one when the diff touches secrets or API keys, auth or sessions, shell
or subprocess calls built from outside input, file paths from users,
elevated permissions (`sudo`, `/etc`), payments, or what data leaves the
machine. Without a built-in command, review with this prompt:

> Review this diff only for security problems: injection (shell, SQL, path),
> secrets in code or logs, auth or permission bypasses, unsafe
> deserialization, and data sent somewhere it shouldn't go. For each, give
> the input that triggers it.

## Fallback checklist

- Does every new branch of logic have a test or a recorded check?
- What happens with empty input, missing config, a network failure, or a
  second run (idempotency)?
- Any copy-pasted logic that should be one service function?
- Any error caught and ignored?
- Anything left over: debug prints, commented-out code, TODOs without an
  owner?

## After the PR is up

If your environment watches PRs (Claude Code on the web does), it will wake
on comments. Otherwise check back for Kai's comments when asked. Fix them,
push, and reply on each thread.
