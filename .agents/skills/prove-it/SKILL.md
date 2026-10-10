---
name: prove-it
description: Back every claim that a change works with evidence - failing-then-passing tests, before/after output, screenshots, or a screen recording - using the strongest kind your environment allows, plus a manual checklist for what you couldn't run. Use while fixing or building anything, and before opening a PR.
---

# Prove it

Combines `evidence-driven-testing` and `before-and-after` from
michaelshimeles/skills, with a path for environments that can't run a
browser or record the screen.

## Pick the evidence

Use the strongest row your environment and the change allow.

| Change | Local (Mac mini) | Cloud container |
|---|---|---|
| Logic, API, data | Failing-then-passing test, output pairs | Same |
| CLI | Command output before and after, as fenced text | Same, with `HOME` or config pointed at a temp dir |
| Web UI | `before-and-after` skill: screenshot pair as a PR table | Playwright screenshots if a browser is installed; otherwise a checklist |
| Desktop / native app | `evidence-driven-testing` skill: annotated screen recording | Render what you can headless (images, generated files); checklist for the rest |
| Can't be run here at all | Checklist | Checklist |

`before-and-after` and `evidence-driven-testing` are installed globally on
the Mac mini by the factory's `install.sh`. If one is missing, fall back to
the next weaker row and say so in the PR.

## Steps

1. **Before.** While reproducing a bug, before fixing it, capture the
   wrong behavior: a failing test, the bad output, a screenshot. This is
   the cheapest moment to get it, and the hardest to recreate later.
2. **Test.** Add or extend a test that fails before and passes after.
   Mock platform calls (OS commands, paid APIs, devices) and assert on what
   would have been sent.
3. **After.** Same command, page, or flow, now correct.
4. **Checklist.** For anything you couldn't run, write the exact steps for
   Kai to try, each with its expected result. Example: "Run
   `app block add example.com`, then `curl -sI https://example.com`. It
   should fail to connect."

Never touch real user data while proving. Point the app at a temp home,
a test database, or a fixture.

## Uploading images

Screenshot hosts are public. Before uploading a screenshot or recording,
make sure it shows nothing private (emails, tokens, account data). If
unsure, send the file to Kai directly instead of posting it to the PR.

## In the PR

A **Testing** section with:

- The check command and its result (`pytest -q`: 14 passed).
- Before/after: fenced output, a screenshot table, or a video link.
- The manual checklist, if any.

"Should work" is not evidence. Every claim in the PR needs one of the above.
