// Minimal .env loader that OVERRIDES anything already in process.env.
//
// Node's --env-file keeps existing variables, so an empty R2_ACCOUNT_ID that
// is already set in the shell shadows the real value in .env. This replaces
// those stale entries with whatever the file says.

import { readFileSync } from "node:fs";

export function loadEnvFile(path = ".env") {
  let contents;

  try {
    contents = readFileSync(path, "utf8");
  } catch {
    return;
  }

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) process.env[key] = value;
  }
}
