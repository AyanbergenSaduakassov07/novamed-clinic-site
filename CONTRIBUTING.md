# Contributing

Issues and pull requests are welcome for code, accessibility and translation fixes.

```bash
npm ci
npm run lint && npx tsc --noEmit && npm run test:contrast && npm run build
```

All four must pass. Copy lives in `messages/ru.json` and `messages/kk.json` and
the two files must keep identical keys. Read the contrast table at the top of
`src/app/globals.css` before changing any colour.

Clinic branding and content are not covered by the MIT licence; see the README.
