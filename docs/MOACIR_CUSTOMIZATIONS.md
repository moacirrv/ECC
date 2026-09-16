# Moacir ECC customizations

This fork is the canonical source of truth for Moacir's ECC-specific runtime customizations.

## Upstream relationship

- Upstream: `affaan-m/ECC`
- Canonical fork: `moacirrv/ECC`
- Local plugin installations are derived runtime copies and must not become the only place where custom behavior exists.

## Codex native session-start hook

`hooks/codex-hooks.json` is kept in this fork so the Codex-native `SessionStart` bootstrap does not depend exclusively on the marketplace installation `ecc@ecc`.

This file currently mirrors the verified upstream Codex hook used by the marketplace distribution.

## Moacir synchronous hook profile

The local working installation at `~/.agents/plugins/ecc` differs from the fork by intentionally omitting `async: true` on these nine hook registrations:

1. `pre:observe:continuous-learning`
2. `post:bash:dispatcher`
3. `post:quality-gate`
4. `post:observe:continuous-learning`
5. `stop:session-end`
6. `stop:evaluate-session`
7. `stop:cost-tracker`
8. `stop:desktop-notify`
9. `session:end:marker`

The reproducible transformation is stored in:

`node scripts/apply-moacir-hook-profile.js`

It may also target an explicit derived installation:

`node scripts/apply-moacir-hook-profile.js <path-to-hooks.json>`

The script only removes the `async` property from the nine IDs above. It does not add, delete, reorder, enable, or disable any hook registration.

## Consolidation gate

Do not disable either active Codex ECC registration until all of the following are verified in the target installation:

1. the fork contains `hooks/codex-hooks.json`;
2. the Moacir synchronous hook profile is reproducible from the fork;
3. the selected canonical installation loads its expected hooks;
4. a new Codex session proves `SessionStart` works;
5. representative `PreToolUse`, `PostToolUse`, and `Stop` hooks run once, not twice;
6. the marketplace installation can then be disabled without losing unique functionality.

The current consolidation target is one active ECC installation derived from `moacirrv/ECC`, while `affaan-m/ECC` remains the upstream source for updates.
