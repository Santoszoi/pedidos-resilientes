# Validation record — 26 October 2026

Environment: Linux, Node.js 24.22.1, npm 11.9.0. Browser: Playwright 1.51.1 / Chromium 134.0.6998.35 (headless).

- TypeScript check and Vite production build: passed. See build.txt.
- Vitest: 13 passed. See unit-tests.txt.
- Playwright: 6 passed. See browser-tests.txt.

The browser tests exercise initial failure, preservation and manual recovery, timeout, cancellation followed by a new response, invalid payload, keyboard activation and a 390px viewport overflow check. Unit tests exercise parsing, invalid amounts, duplicate IDs, unsupported statuses, HTTP errors, malformed JSON, network rejection, timeout and cancellation.

Screenshots and MP4 are captured from the running local application, not generated mockups. The video has no narration and uses fictional orders.

Initial setup issues: listening on 0.0.0.0 failed in this environment; local scripts now bind to 127.0.0.1. The initially resolved Playwright browser download was unavailable; the reproducible browser tooling is pinned to 1.51.1. This is a development/test dependency, not a production browser recommendation. Upgrade and rerun the suite before adopting a newer test runner.

Pending: manual screen-reader checks; manual 200% zoom review; Firefox/Safari and physical mobile devices; real API integration; security/dependency audit; GitHub-hosted workflow execution. No WCAG certification, performance SLA, real customer deployment or quantified business improvement is claimed.
