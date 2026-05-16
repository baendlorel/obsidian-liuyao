# Obsidian Liuyao Plugin

This plugin renders six-line divination diagrams in Obsidian.

## Supported Syntax

Recommended syntax:

```text
```liuyao
012321
```
```

Inline syntax is also supported:

```text
\liuyao{012321}
```

The fenced `liuyao` code block is more reliable in Obsidian because it uses the native code block rendering pipeline.

## Rules

- The input must contain exactly 6 digits.
- Each digit must be one of `0`, `1`, `2`, or `3`.
- The first digit is the bottom line, and the sixth digit is the top line.
- Rendering is displayed from top to bottom.

Digit meanings:

- `0`: old yin, broken red line
- `1`: young yang, solid black line
- `2`: young yin, broken black line
- `3`: old yang, solid red line

Example: `012321` renders from top to bottom as `young yang, young yin, old yang, young yin, young yang, old yin`.

## Development

The source entry is `src/main.ts`, and build artifacts are written to `dist/`.

1. Install dependencies: `pnpm install`
2. Build the plugin: `pnpm build`

The build produces:

- `dist/main.js`
- `dist/manifest.json`
- `dist/styles.css`

Copy those three files into your vault at `.obsidian/plugins/liuyao-renderer/`.

## Testing

1. Run `pnpm build`.
2. Copy the files from `dist/` into `.obsidian/plugins/liuyao-renderer/` in your vault.
3. Enable the plugin in Obsidian community plugins.
4. Test with a fenced block:

```text
```liuyao
012321
```
```

5. Optionally test the inline form:

```text
\liuyao{012321}
```