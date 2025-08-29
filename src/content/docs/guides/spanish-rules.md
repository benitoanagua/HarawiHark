---
title: 'Spanish Syllable Counting Rules'
---

# Spanish Syllable Counting Rules

HarawiHark utiliza la librería **simi-syllable** para conteo preciso de sílabas en español. El algoritmo maneja:

- **Diptongos y triptongos** (e.g., "tierra" → 2 sílabas)
- **Hiatos** con vocales acentuadas (e.g., "país" → pa-ís → 2 sílabas)
- **Diéresis** (e.g., "pingüino" → pin-güi-no → 3 sílabas)
- **Grupos consonánticos** inseparables (bl, br, cl, cr, etc.)
- **Reglas fonológicas completas** del español

### Ejemplo de precisión

```
"casa" → ca-sa → 2 sílabas ✓
"pingüino" → pin-güi-no → 3 sílabas ✓
"construí" → cons-tru-í → 3 sílabas ✓
```
