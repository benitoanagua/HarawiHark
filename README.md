# HarawiHark

A lightweight, bilingual syllable-meter checker for poetic forms, powered by SvelteKit and **simi-syllable**.

## Features

- **Advanced syllable counting** using the simi-syllable library
- **Dual language support** with specialized algorithms for English and Spanish
- **Phonetic accuracy** beyond simple vowel counting
- **11+ poetic forms** with precise pattern matching

## What it does

- **Pick a form** – choose from 11 fixed-syllable patterns (haiku, tanka, cinquain, nonet, fib, etc.).
- **Paste your poem** – line-by-line or free text.
- **Instant feedback** – exact syllable count per line plus ✅ / ❌ against the expected pattern.
- **Two languages** – Spanish (with sinalefa & dieresis handling) and English.
- **Zero install** – works as a static site on GitHub Pages or Cloudflare Pages; PWA-ready for offline use on phones.

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # static output in ./build
```

## Supported forms

| Name           | Syllable pattern | Lines |
| -------------- | ---------------- | ----- |
| Haiku / Senryū | 5-7-5            | 3     |
| Tanka          | 5-7-5-7-7        | 5     |
| Cinquain       | 2-4-6-8-2        | 5     |
| Nonet          | 9-8-7-…-1        | 9     |
| Etheree        | 1-2-3-…-10       | 10    |
| Fib            | 1-1-2-3-5-8      | 6     |
| Lanterne       | 1-2-3-4-1        | 5     |
| Gogyōka        | 5 short lines    | 5     |
| Rondel Supreme | 14×8             | 14    |
| Sapphic Stanza | 11-11-11-5       | 4     |

## API

`POST /api/check`  
Body:

```json
{
	"form": "haiku",
	"lines": ["An old silent pond", "A frog jumps into the pond—", "Splash! Silence again."]
}
```

Returns:

```json
{
	"ok": true,
	"lines": [
		{ "text": "An old silent pond", "count": 5, "expected": 5 },
		{ "text": "A frog jumps into the pond—", "count": 7, "expected": 7 },
		{ "text": "Splash! Silence again.", "count": 5, "expected": 5 }
	]
}
```

## Deploy

- GitHub Pages: push to `main` → `.github/workflows/deploy.yml` included.
- Cloudflare Pages: connect repo, build command `pnpm build`, output dir `build`.

## License

MIT © 2025 HarawiHark contributors
