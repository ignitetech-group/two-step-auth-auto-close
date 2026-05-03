# Contributing

Thanks for taking the time to contribute. This is a small Manifest V3 browser extension, so the workflow is intentionally lightweight.

## Reporting issues

Open a GitHub issue with:

- Browser and version (Chrome, Edge, etc.).
- Extension version (see `manifest.json`).
- The URL pattern you expected to be auto-closed.
- A short description of what happened vs. what you expected.

For auth pages that should be auto-closed but aren't, please include the visible page text (with anything sensitive redacted) so we can confirm whether the success markers in `content.js` need to be extended.

## Local development

1. Clone this repository.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select this repository's folder.
5. Make changes to `background.js`, `content.js`, or `manifest.json`.
6. Return to the extensions page and click the extension's **Reload** button to pick up changes.
7. Open the service worker DevTools from the extensions page to view background-worker logs.

There is no build step — files are loaded directly by the browser.

## Code style

- Manifest V3 only. Keep the background as a service worker.
- Plain JavaScript, no bundlers, no frameworks, no remote code.
- Tab indentation, single quotes, semicolons, trailing commas where valid (match the existing files).
- Keep `permissions` and `host_permissions` minimal. New permissions need a clear justification in the PR description.
- Do not introduce network calls, storage of user data, or telemetry.

## Pull requests

- Branch from `main`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and PR titles, e.g. `feat: add support for additional callback host` or `fix: avoid closing the last browser tab`.
- Keep PRs small and focused — one logical change per PR.
- Update `CHANGELOG.md` under a new version heading when behavior changes, and bump `version` in `manifest.json` accordingly.
- Update `README.md` if user-visible behavior or supported URL patterns change.
- Test the unpacked extension in Chrome before requesting review.

## Security

If you find a security issue, please do not open a public GitHub issue. Email the maintainers privately instead.

## License

By contributing you agree that your contributions will be licensed under the [MIT License](LICENSE).
