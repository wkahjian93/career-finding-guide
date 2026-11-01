# Career Finding Guide

REDEFINE's career interest form and leader results view.

- `docs/` is the published site. `index.html` is the candidate form, `leader.html` is the leader view.
- `docs/scoring.js` holds the scoring, fit rules and comments. Thresholds are in `CFG_RULES`.
- `server/Code.gs` is the Google Apps Script server. See `SETUP SERVER.md`.
- `tools/serve.js` runs the site locally with a stand-in server.

Candidate data is stored only in a private Google Sheet, never in this repo.
