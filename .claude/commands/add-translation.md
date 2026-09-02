# Add Translation Key

Add a new translation key to all locale files in `apps/web/messages/`.

Steps:
1. Ask for the key path (e.g. `home.hero.title`) and the English value
2. Add the key to `apps/web/messages/en.json` at the correct nested path
3. Add a placeholder (English value) to all other locale files: `fr.json`, `es.json`, `de.json`, `pt.json`, `zh.json`, `ar.json`
4. Show a diff summary of all files changed

Note: Always keep the JSON structure consistent across all locale files.
