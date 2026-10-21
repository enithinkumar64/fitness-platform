import { constants, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = process.cwd(), stage = resolve(root, '.cloudflare-build');
const mode = process.argv[2];
if (!['build', 'preview', 'check', 'deploy'].includes(mode)) throw Error('Use build, preview, check or deploy.');
const run = (command, args, env) => {
  const result = spawnSync(command, args, { cwd: stage, env, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
};
// OpenNext compiles ALL .env files, including development ones, into its worker.
// Build from an allowlisted copy instead of touching or bundling local secrets.
if (mode === 'build') {
  rmSync(stage, { recursive: true, force: true }); mkdirSync(stage);
  for (const file of ['src','public','package.json','package-lock.json','tsconfig.json','next.config.ts','open-next.config.ts']) {
    cpSync(resolve(root,file), resolve(stage,file), { recursive: true });
  }
  // Reuse installed tooling; never install packages or read local dotenv files here.
  // Turbopack requires dependencies inside its filesystem root. Use local
  // copy-on-write copies where supported; preserve relative package bin links.
  cpSync(resolve(root,'node_modules'), resolve(stage,'node_modules'), { recursive: true, verbatimSymlinks: true, mode: constants.COPYFILE_FICLONE });
  const config = JSON.parse(readFileSync(resolve(root,'wrangler.json'),'utf8'));
  config.main = '.open-next/worker.js'; config.assets.directory = '.open-next/assets';
  if (config.vars?.FDC_API_KEY !== undefined || config.secrets) throw Error('USDA secrets are not allowed in deployment configuration.');
  writeFileSync(resolve(stage,'wrangler.json'), JSON.stringify(config,null,2));
  writeFileSync(resolve(stage,'.dev.vars'), '# Intentionally empty: no USDA key in Workers preview.\n');
  const env = Object.fromEntries(['PATH','HOME','TMPDIR','TMP','TEMP','SystemRoot','NODE_EXTRA_CA_CERTS','SITE_URL','SITE_INDEXABLE'].flatMap(key => process.env[key] === undefined ? [] : [[key,process.env[key]]]));
  env.CI = 'true'; env.NODE_ENV = 'production'; env.NEXT_TELEMETRY_DISABLED = '1';
  env.CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV = 'false';
  run(process.execPath, [resolve(root,'node_modules/@opennextjs/cloudflare/dist/cli/index.js'),'build'], env);
  run(process.execPath, [resolve(root,'node_modules/@opennextjs/cloudflare/dist/cli/index.js'),'populateCache','local'], env);
}
if (!existsSync(resolve(stage,'.open-next/worker.js'))) throw Error('Run npm run build:cloudflare first.');
const compiledEnv = readFileSync(resolve(stage,'.open-next/cloudflare/next-env.mjs'),'utf8');
if (!['production','development','test'].every(name => compiledEnv.includes(`export const ${name} = {};`))) {
  throw Error('Refusing Worker output with bundled dotenv values. Rebuild from the isolated staging copy.');
}
if (mode !== 'build') {
  const env = { ...process.env, CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: 'false', WRANGLER_SEND_METRICS: 'false' };
  delete env.FDC_API_KEY; delete env.NEXT_PUBLIC_FDC_API_KEY;
  if (mode === 'check') {
    run(process.execPath, [resolve(root,'node_modules/wrangler/bin/wrangler.js'),'deploy','--dry-run','--outdir','.dry-run'], env);
  } else {
    const args = mode === 'preview' ? ['preview','--port','8787'] : ['deploy'];
    run(process.execPath, [resolve(root,'node_modules/@opennextjs/cloudflare/dist/cli/index.js'), ...args], env);
  }
}
