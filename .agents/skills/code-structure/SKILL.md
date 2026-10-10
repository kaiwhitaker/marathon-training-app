---
name: code-structure
description: Decide where code belongs - flows that decide why and when (routes, CLI commands, jobs, UI handlers) versus shared services that do the how (DB, APIs, filesystem, OS calls). Use when adding a feature, when two code paths repeat the same operation, or when unsure where new code goes.
---

# Code structure

Based on `code-structure` from michaelshimeles/skills, made
language-neutral. The repo's `AGENTS.md` may map these layers to its own
modules; follow that mapping when present.

## Two layers

| Layer | Examples | Owns |
|---|---|---|
| Flows | HTTP routes, server actions, CLI commands, background jobs, UI event handlers | Business rules, when to act, permission checks, state changes, retries, what the user sees |
| Services | DB access, API/SDK clients, email, payments, filesystem, shell/OS calls | One reusable operation each, done reliably, returning a structured result |

Rule of thumb: "what this product flow means" stays in the flow. "How to do
this operation reliably" goes in a service.

## Rules

- **Explicit inputs.** Pass connections, config, IDs, and timestamps in as
  arguments. A service shouldn't load global config or open its own DB
  connection deep inside. This is also what makes it testable.
- **Structured returns.** Return a value or a small result object
  (`{ok: false, reason: "..."}`) instead of printing, swallowing errors, or
  throwing for expected failures. The flow decides what to tell the user.
- **Isolate the platform.** Calls to the OS, a browser, a device, or a paid
  API go in small wrappers. Keep the parsing and decisions around them in
  plain functions that tests can run anywhere.
- **Extract on the second copy.** Code with one caller stays in that
  caller. When a second flow needs it, move it to a service, switch one
  caller, run the checks, then switch the rest.
- **Services don't own policy.** Auth, status transitions, and error
  classification stay in flows.

## Anti-patterns

| Pattern | Problem |
|---|---|
| God service | One function that does everything hides the control flow |
| Leaky service | Writes to the DB or reads config on its own, so callers can't predict it |
| Inconsistent API | Each helper takes arguments and reports errors differently |
| Early abstraction | A wrapper around a single call site |

## Example

```python
# service: how to send
def send_welcome_email(to, name, client):
    return client.send(to=to, subject="Welcome", html=f"<h1>Hi {name}</h1>")

# flow: when to send
if user.marketing_opt_in:
    result = send_welcome_email(user.email, user.name, email_client)
    if not result.ok:
        log.warning("welcome email failed: %s", result.reason)
```

```ts
// service
export async function sendWelcomeEmail(p: { to: string; name: string }) { ... }

// flow: admin invites always send, sign-ups only with opt-in
await sendWelcomeEmail({ to: invitee.email, name: invitee.name });
```
