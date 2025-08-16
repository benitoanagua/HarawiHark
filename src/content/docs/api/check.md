---
title: 'POST /api/check'
---

# REST Endpoint

`POST /api/check`

## Request

```json
{
	"form": "haiku",
	"locale": "en",
	"lines": ["An old silent pond", "A frog jumps into the pond—", "Splash! Silence again."]
}
```

## Response

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

## cURL example

```bash
curl -X POST https://harawi-hark.vercel.app/api/check \
  -H "Content-Type: application/json" \
  -d '{"form":"haiku","locale":"en","lines":["An old silent pond","A frog jumps into the pond—","Splash! Silence again."]}'
```
