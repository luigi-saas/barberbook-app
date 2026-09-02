---
name: add-locale-key
description: Triggered when adding new UI text to apps/web — ensures the key is added to all 7 locale JSON files consistently
---

# Add Locale Key

## Step 1: Identify the key and value
- Determine the dot-notation key path (e.g. `pricing.hero.title`)
- Get the English value

## Step 2: Add to en.json
- Open `apps/web/messages/en.json`
- Insert the key at the correct nested path, preserving JSON structure

## Step 3: Sync all other locales
- Add the same key with the English value as placeholder to:
  `fr.json`, `es.json`, `de.json`, `pt.json`, `zh.json`, `ar.json`
- Keep JSON structure identical across all files

## Step 4: Use in the component
- Server Component: `const t = await getTranslations('namespace')`
- Client Component: `const t = useTranslations('namespace')`
- Reference: `t('key')`

## Output
Show a single diff summarizing all 7 files changed.
