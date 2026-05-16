# Obsidian Liuyao Plugin

This plugin renders six-line divination diagrams in Obsidian from a fenced `liuyao` code block.

## Supported Syntax

```text
```liuyao
012321
```
```

Only the fenced `liuyao` code block syntax is supported.

The plugin also supports a `solarlunar` fenced block for date information:

```text
```solarlunar 2026-05-16 09:30
```
```

or:

```text
```solarlunar
2026-05-16 09:30
```
```

## Rules

- The input must contain exactly 6 digits.
- Each digit must be one of `0`, `1`, `2`, or `3`.
- The first digit is the bottom line, and the sixth digit is the top line.
- The plugin looks up the matching hexagram metadata from `src/core/common.ts`.

Digit meanings:

- `0`: old yin, broken red line
- `1`: young yang, solid black line
- `2`: young yin, broken black line
- `3`: old yang, solid red line

The rendered card shows:

- The family and hexagram name at the top, such as `乾宫 乾为天`
- The line relation text on the left of each line
- The `世` or `应` marker on the right when present

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
3. Reload Obsidian or disable and re-enable the plugin.
4. Create a note with the following block:

```text
```liuyao
123123
```
```

5. Switch to Reading view and confirm the card shows the hexagram title, six annotated lines, and any `世` or `应` markers.

6. Test the solar-lunar block with a valid date:

```text
```solarlunar 2026-05-16 09:30
```
```

7. Test an invalid date and confirm a red error message is shown.