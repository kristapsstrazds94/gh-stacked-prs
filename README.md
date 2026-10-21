# Stacked PRs with `gh stack`

Interactive guide for splitting dependent work into smaller, reviewable pull requests.

## Live site

After GitHub Pages is enabled, the guide is published at:

**https://kristapsstrazds94.github.io/gh-stacked-prs/**

## Local preview

Open [`index.html`](index.html) in a browser, or serve the repo root:

```bash
npx --yes serve .
```

Then visit `http://localhost:3000`.

## GitHub Pages setup

1. Push this repository to GitHub on the `main` branch.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main` (or run the **Deploy GitHub Pages** workflow manually). The workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml) deploys the static site.

No build step is required - the site is plain HTML, CSS, and JavaScript.

## Project layout

| Path | Purpose |
|------|---------|
| `index.html` | Single-page guide |
| `css/guide.css` | GitHub Docs–inspired styling |
| `js/guide.js` | Table of contents highlighting and mobile menu |
| `images/` | Guide illustrations (stacked PR flowchart) |
