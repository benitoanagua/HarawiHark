---
title: 'What is HarawiHark?'
---

# HarawiHark – 3-Minute Quick-Start

HarawiHark is a **syllable pattern checker for poetry** that instantly validates if your poem follows traditional poetic forms. Simply paste your lines, pick a form, and get immediate feedback with precise syllable counts.

## ⚡ 1-Minute Demo

1. Open [harawi-hark.vercel.app](https://harawi-hark.vercel.app)
2. Select **Haiku** (5-7-5 pattern)
3. Type or paste:

```
An old silent pond
A frog jumps into the pond—
Splash! Silence again.
```

4. Click **🔍 Check Poem**
5. ✅ See instant results: all three lines match the 5-7-5 pattern perfectly!

## 🌍 Supported Languages

### English Syllable Counting

- **Advanced phonetics**: handles diphthongs, silent 'e', compound words
- **Suffix variations**: -ed, -es, -ing handled correctly
- **Context-aware**: "read" vs "red" counted appropriately

### Spanish Syllable Counting

- **Sinalefa**: automatic vowel merging between words
- **Hiatos**: stressed vowel separations (pa-ís → 2 syllables)
- **Diéresis**: forced syllable splits (pin-güi-no → 3 syllables)
- **Complete phonology**: all Spanish syllable rules implemented

## 📚 8 Essential Forms

| **Form**       | **Pattern**   | **Lines** | **Best For**        |
| -------------- | ------------- | --------- | ------------------- |
| **Haiku**      | 5-7-5         | 3         | Nature, moments     |
| **Tanka**      | 5-7-5-7-7     | 5         | Emotions, stories   |
| **Cinquain**   | 2-4-6-8-2     | 5         | Imagist poetry      |
| **Limerick**   | 8-8-5-5-8     | 5         | Humor, wordplay     |
| **Redondilla** | 8-8-8-8       | 4         | Spanish traditional |
| **Lanterne**   | 1-2-3-4-1     | 5         | Visual, centered    |
| **Diamante**   | 1-2-3-4-3-2-1 | 7         | Contrast, symmetry  |
| **Fibonacci**  | 1-1-2-3-5-8   | 6         | Mathematical beauty |

## 🎯 Key Features

- **Real-time preview**: See syllable counts as you type
- **Pattern visualization**: Visual indicators for expected vs actual counts
- **Example loader**: Click "📝 Example" to see perfect examples for any form
- **Bilingual interface**: Full Spanish and English support
- **Mobile optimized**: Works perfectly on phones and tablets
- **Offline ready**: Install as PWA for offline use

## 🚀 Advanced Usage

### API Integration

```javascript
const response = await fetch('/api/check', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		form: 'haiku',
		locale: 'en',
		lines: ['Your', 'poem', 'lines']
	})
});
const result = await response.json();
```

### Keyboard Shortcuts

- **Ctrl + Enter**: Quick check your current poem
- **Tab**: Navigate between form selector and text area

## 📖 Next Steps

### Learn the Forms

- Browse **[Poetry Forms](/docs/forms)** for detailed explanations and examples
- Try different forms to find your favorite style
- Read about **[syllable counting rules](/docs/guides/english-rules)** for English and **[Spanish](/docs/guides/spanish-rules)**

### Integrate HarawiHark

- Check the **[API documentation](/docs/api/check)** for developers
- Use the REST endpoint in your own poetry applications
- All responses include detailed syllable breakdowns

### Troubleshooting

- See **[troubleshooting guide](/docs/guides/troubleshooting)** for common issues
- Learn about edge cases with accented characters and compound words
- Check **[FAQ](/docs/faq)** for frequently asked questions

---

**Made for poets, by poets** 🌸  
Perfect your syllable patterns in English and Spanish with scientific precision.
