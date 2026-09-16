#!/usr/bin/env node

/**
 * Apply Moacir's canonical ECC hook execution profile.
 *
 * The local working installation intentionally runs nine lifecycle hooks
 * synchronously by omitting `async: true`. Keeping this transformation in the
 * fork makes the local delta reproducible instead of leaving it as an
 * unversioned edit inside ~/.agents/plugins/ecc.
 *
 * Usage:
 *   node scripts/apply-moacir-hook-profile.js [path/to/hooks.json]
 *
 * Defaults to hooks/hooks.json in this repository.
 */

const fs = require('fs');
const path = require('path');

const target = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, '..', 'hooks', 'hooks.json');

const synchronousHookIds = new Set([
  'pre:observe:continuous-learning',
  'post:bash:dispatcher',
  'post:quality-gate',
  'post:observe:continuous-learning',
  'stop:session-end',
  'stop:evaluate-session',
  'stop:cost-tracker',
  'stop:desktop-notify',
  'session:end:marker',
]);

const document = JSON.parse(fs.readFileSync(target, 'utf8'));
let changed = 0;

for (const lifecycle of Object.values(document.hooks || {})) {
  if (!Array.isArray(lifecycle)) continue;

  for (const registration of lifecycle) {
    if (!synchronousHookIds.has(registration.id)) continue;

    for (const hook of registration.hooks || []) {
      if (Object.prototype.hasOwnProperty.call(hook, 'async')) {
        delete hook.async;
        changed += 1;
      }
    }
  }
}

fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
console.log(`Applied Moacir hook profile: ${changed} async flag(s) removed from ${target}`);
