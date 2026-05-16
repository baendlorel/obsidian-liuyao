import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const ctx = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian', 'electron', '@codemirror/state', '@codemirror/view', '@codemirror/language'],
  format: 'cjs',
  target: 'es2020',
  platform: 'browser',
  sourcemap: watch ? 'inline' : false,
  logLevel: 'info',
  outfile: 'main.js',
});

if (watch) {
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
