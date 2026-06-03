// Dev orchestrator for multi-repo local development.
//
// Sandbox-friendly alternative to a workspace/symlink (neither is creatable in
// the Builder cloud env). For each local library it:
//   1. copies the sibling repo's built dist/ into node_modules so the app
//      resolves it (a copy lands INSIDE this project, so Turbopack resolves it
//      natively — a symlink to the sibling would be outside the root and fail)
//   2. runs the library's watch build so dist/ regenerates on source changes
//   3. re-copies dist/ into node_modules whenever it changes
// then runs `next dev`.
//
// Add a library: append one entry to LIBS. Each library is best-effort — its
// failure never takes down next dev.
//
// Coexists with a real workspace: if node_modules/<pkg> is already a symlink
// (local pnpm/npm workspace), that library's copy step is skipped.
import { spawn } from "node:child_process";
import { cpSync, existsSync, lstatSync, mkdirSync, watch } from "node:fs";
import { resolve } from "node:path";

const cwd = process.cwd(); // .../code

/** @type {{ pkg: string; dir: string }[]} */
const LIBS = [
  { pkg: "@jasonyangcis/core-ui", dir: resolve(cwd, "..", "core-ui") },
  // { pkg: "@jasonyangcis/core-ui-2", dir: resolve(cwd, "..", "core-ui-2") },
];

const children = [];
let shuttingDown = false;
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    try {
      child.kill();
    } catch {}
  }
  process.exit(code ?? 0);
}
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

function isSymlink(p) {
  try {
    return lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

function startLib({ pkg, dir }) {
  const srcDist = resolve(dir, "dist");
  const srcPkgJson = resolve(dir, "package.json");
  const destPkg = resolve(cwd, "node_modules", pkg);
  const destDist = resolve(destPkg, "dist");

  if (!existsSync(dir)) {
    console.warn(`[dev] ${pkg}: ${dir} not found; skipping (app falls back to the installed registry version).`);
    return;
  }
  if (isSymlink(destPkg)) {
    console.log(`[dev] ${pkg} is symlinked (workspace); skipping copy-sync.`);
    return;
  }

  const sync = (reason) => {
    if (!existsSync(srcDist)) return;
    try {
      mkdirSync(destPkg, { recursive: true });
      cpSync(srcDist, destDist, { recursive: true });
      if (existsSync(srcPkgJson)) cpSync(srcPkgJson, resolve(destPkg, "package.json"));
      console.log(`[dev] synced ${pkg} dist${reason ? ` (${reason})` : ""}`);
    } catch (err) {
      console.warn(`[dev] ${pkg} dist sync failed: ${err.message}`);
    }
  };

  // Initial sync so the app resolves something on the first compile.
  sync("startup");

  // Watch build (regenerates the library's dist/ on source changes).
  if (existsSync(resolve(dir, "node_modules"))) {
    const lib = spawn("npm", ["run", "dev"], { cwd: dir, stdio: "inherit", env: process.env });
    lib.on("error", (err) => console.warn(`[dev] ${pkg} watch build did not start: ${err.message}`));
    children.push(lib);
  } else {
    console.warn(`[dev] ${pkg}: node_modules missing; run \`npm install\` in ${dir} for live rebuilds.`);
  }

  // Re-sync whenever the library's dist/ changes (debounced).
  if (existsSync(srcDist)) {
    let timer;
    watch(srcDist, { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => sync("rebuild"), 150);
    });
  }
}

for (const lib of LIBS) startLib(lib);

// The app. Its exit ends the whole dev session.
const nextBin = resolve(cwd, "node_modules", ".bin", "next");
const next = spawn(nextBin, ["dev"], { cwd, stdio: "inherit", env: process.env });
next.on("error", (err) => {
  console.error(`[dev] failed to start next dev: ${err.message}`);
  shutdown(1);
});
next.on("exit", (code) => shutdown(code ?? 0));
children.push(next);
