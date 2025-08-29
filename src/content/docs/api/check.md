---
title: 'POST /api/check'
---

# REST Endpoint

`POST /api/check`

## Request Format

```json
{
	"form": "haiku",
	"locale": "en",
	"lines": ["An old silent pond", "A frog jumps into the pond—", "Splash! Silence again."]
}
```

### Parameters

| Field    | Type     | Required | Description                                   |
| -------- | -------- | -------- | --------------------------------------------- |
| `form`   | string   | Yes      | Poetry form name (see supported forms below)  |
| `locale` | string   | No       | Language for syllable counting (`en` or `es`) |
| `lines`  | string[] | Yes      | Array of poem lines                           |

### Supported Forms

| Form         | Pattern       | Lines |
| ------------ | ------------- | ----- |
| `haiku`      | 5-7-5         | 3     |
| `tanka`      | 5-7-5-7-7     | 5     |
| `cinquain`   | 2-4-6-8-2     | 5     |
| `limerick`   | 8-8-5-5-8     | 5     |
| `redondilla` | 8-8-8-8       | 4     |
| `lanterne`   | 1-2-3-4-1     | 5     |
| `diamante`   | 1-2-3-4-3-2-1 | 7     |
| `fib`        | 1-1-2-3-5-8   | 6     |

## Response Format

```json
{
	"ok": true,
	"form": "haiku",
	"totalLines": {
		"expected": 3,
		"actual": 3
	},
	"lines": [
		{ "text": "An old silent pond", "count": 5, "expected": 5, "match": true },
		{ "text": "A frog jumps into the pond—", "count": 7, "expected": 7, "match": true },
		{ "text": "Splash! Silence again.", "count": 5, "expected": 5, "match": true }
	],
	"summary": "✅ Perfect match: all 3 lines follow the pattern."
}
```

### Response Fields

| Field        | Type    | Description                            |
| ------------ | ------- | -------------------------------------- |
| `ok`         | boolean | `true` if poem matches pattern exactly |
| `form`       | string  | Poetry form that was checked           |
| `totalLines` | object  | Expected vs actual line count          |
| `lines`      | array   | Detailed analysis for each line        |
| `summary`    | string  | Human-readable result summary          |

### Line Object

| Field      | Type    | Description                           |
| ---------- | ------- | ------------------------------------- |
| `text`     | string  | Original line text                    |
| `count`    | number  | Actual syllable count                 |
| `expected` | number  | Expected syllable count for this line |
| `match`    | boolean | Whether line matches expected count   |

## Error Responses

### 400 Bad Request

```json
{
	"error": "Invalid or unsupported poetry form",
	"supportedForms": [
		"haiku",
		"tanka",
		"cinquain",
		"limerick",
		"redondilla",
		"lanterne",
		"diamante",
		"fib"
	]
}
```

### 500 Internal Server Error

```json
{
	"error": "Internal server error processing your poem",
	"details": "Error message details"
}
```

## Example Requests

### Basic Haiku Check

```bash
curl -X POST https://harawi-hark.vercel.app/api/check \
  -H "Content-Type: application/json" \
  -d '{
    "form": "haiku",
    "locale": "en",
    "lines": [
      "An old silent pond",
      "A frog jumps into the pond—",
      "Splash! Silence again."
    ]
  }'
```

### Spanish Redondilla Check

```bash
curl -X POST https://harawi-hark.vercel.app/api/check \
  -H "Content-Type: application/json" \
  -d '{
    "form": "redondilla",
    "locale": "es",
    "lines": [
      "En jardines de colores",
      "Danzan libres mariposas",
      "Entre pétalos y flores",
      "Perfuman las dulces cosas"
    ]
  }'
```

### Fibonacci Poem Check

```bash
curl -X POST https://harawi-hark.vercel.app/api/check \
  -H "Content-Type: application/json" \
  -d '{
    "form": "fib",
    "lines": [
      "I",
      "am",
      "watching",
      "raindrops race",
      "down the window slowly",
      "each one a tiny universe complete"
    ]
  }'
```

## GET /api/check

Returns information about available forms:

```json
{
	"availableForms": [
		{
			"name": "haiku",
			"pattern": [5, 7, 5],
			"lines": 3,
			"description": "5-7-5 syllables over 3 lines"
		}
	],
	"supportedLocales": ["en", "es"],
	"version": "1.0.0"
}
```
