// Nippon Numbers — hand-in program (Node 22, standard library only).
//
// The site is the static files under app/ beside this file, plus the
// screenshots/ renders of it. This program copies both into the output
// directory and writes dossier.json there, using the kit's vendored
// buildDossier. It runs twice in grading and both runs must produce
// byte-identical output, so it writes nothing that depends on the clock,
// the environment, or file order: the copied trees are fixed inputs and
// buildDossier is deterministic over the same inputs.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
cpSync(join(here, "app"), join(outDir, "app"), { recursive: true });

const shotsDir = join(outDir, "screenshots");
mkdirSync(shotsDir, { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), shotsDir, { recursive: true });
}

// The scorer's caps for this bounty: at most 4 screenshots, each at most
// 256 KiB; app/ at most 993 files and directories and 16 MiB in all; the
// dossier text at most 160 KiB.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
