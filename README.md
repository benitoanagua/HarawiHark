# HarawiHark

A lightweight, bilingual syllable-meter checker for poetic forms, powered by SvelteKit and **simi-syllable**.

## Features

- **Advanced syllable counting** using the simi-syllable library
- **Dual language support** with specialized algorithms for English and Spanish
- **Phonetic accuracy** beyond simple vowel counting
- **8 essential poetic forms** with precise pattern matching
- **Real-time feedback** with visual indicators and examples
- **PWA ready** for offline use

## What it does

- **Pick a form** – choose from 8 carefully selected syllable patterns
- **Paste your poem** – line-by-line with live preview
- **Instant feedback** – exact syllable count per line plus ✅ / ❌ against the expected pattern
- **Two languages** – Spanish (with sinalefa & dieresis handling) and English
- **Zero install** – works as a static site; PWA-ready for offline use on phones

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # static output in ./build
```

## Supported forms

| Name           | Syllable pattern | Lines | Origin            |
| -------------- | ---------------- | ----- | ----------------- |
| **Haiku**      | 5-7-5            | 3     | Japanese          |
| **Tanka**      | 5-7-5-7-7        | 5     | Japanese          |
| **Cinquain**   | 2-4-6-8-2        | 5     | American          |
| **Limerick**   | 8-8-5-5-8        | 5     | English           |
| **Redondilla** | 8-8-8-8          | 4     | Spanish           |
| **Lanterne**   | 1-2-3-4-1        | 5     | Japanese-inspired |
| **Diamante**   | 1-2-3-4-3-2-1    | 7     | Modern            |
| **Fibonacci**  | 1-1-2-3-5-8      | 6     | Mathematical      |

## API

`POST /api/check`  
Body:

```json
{
	"form": "haiku",
	"locale": "en",
	"lines": ["An old silent pond", "A frog jumps into the pond—", "Splash! Silence again."]
}
```

Returns:

```json
{
	"ok": true,
	"form": "haiku",
	"totalLines": { "expected": 3, "actual": 3 },
	"lines": [
		{ "text": "An old silent pond", "count": 5, "expected": 5, "match": true },
		{ "text": "A frog jumps into the pond—", "count": 7, "expected": 7, "match": true },
		{ "text": "Splash! Silence again.", "count": 5, "expected": 5, "match": true }
	],
	"summary": "✅ Perfect match: all 3 lines follow the pattern."
}
```

## Features

### Advanced Syllable Counting

- **English**: Handles diphthongs, silent 'e', suffix variations, compound words
- **Spanish**: Manages diptongos, hiatos, diéresis, grupos consonánticos

### User Experience

- **Live preview** of syllable patterns while typing
- **Example loader** for each poetic form
- **Real-time line counter** and pattern matching
- **Bilingual interface** with Paraglide i18n
- **Responsive design** optimized for mobile and desktop

### Developer Friendly

- **REST API** with comprehensive error handling
- **TypeScript** throughout for type safety
- **Static generation** for fast loading and SEO
- **PWA capabilities** for offline functionality

## Deploy

- **GitHub Pages**: push to `main` → automated deployment via GitHub Actions
- **Vercel**: connect repo → automatic builds on push
- **Cloudflare Pages**: connect repo, build command `pnpm build`, output dir `build`

## Tech Stack

- **Frontend**: SvelteKit 2 + TypeScript
- **Styling**: UnoCSS with Tailwind-compatible utilities
- **i18n**: Paraglide for bilingual support
- **Syllable counting**: simi-syllable library
- **Build**: Vite with static adapter
- **Testing**: Playwright for E2E tests

## Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   ├── patterns.ts          # Poetry form definitions
│   └── paraglide/          # i18n configuration
├── routes/
│   ├── api/check/          # REST endpoint
│   ├── docs/               # Documentation pages
│   └── +page.svelte        # Main application
└── content/docs/           # Markdown documentation
```

## Contributing

1. **Add new forms**: Update `src/lib/patterns.ts` with pattern and examples
2. **Improve syllable counting**: Enhance error handling in `/api/check`
3. **Documentation**: Add guides in `src/content/docs/`
4. **Translations**: Update Paraglide messages for new languages

## License

MIT © 2025 HarawiHark contributors

---

**Made for poets, by poets** 🌸 Perfect your syllable patterns in English and Spanish.
