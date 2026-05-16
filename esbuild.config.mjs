import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const outdir = 'dist';
const staticFiles = ['manifest.json', 'styles.css'];

async function prepareDist() {
  if (!watch) {
    await rm(outdir, { recursive: true, force: true });
  }

  await mkdir(outdir, { recursive: true });

  await Promise.all(
    staticFiles.map(async (file) => {
      const destination = join(outdir, file);
      await mkdir(dirname(destination), { recursive: true });
      await cp(file, destination);
    }),
  );
}

await prepareDist();

const ctx = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian', 'electron', '@codemirror/state', '@codemirror/view', '@codemirror/language'],
  format: 'cjs',
  target: 'es2020',
  platform: 'browser',
  sourcemap: watch ? 'inline' : false,
  logLevel: 'info',
  outfile: join(outdir, 'main.js'),
});

if (watch) {
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
