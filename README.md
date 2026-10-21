# Tutorial: Getting Started with Stacked PRs using `gh stack`

Stacked pull requests let you split work that depends on earlier changes into smaller, reviewable PRs.

> **Important:** `gh stack` is not a built-in GitHub CLI command. The commands below assume your team has installed a compatible `gh stack` extension. Verify its actual command syntax with `gh stack --help` before using it. The extension-install command and subcommands can vary by implementation.

## 1. Install and verify the tooling

Make sure GitHub CLI (`gh`) is installed and authenticated:

```bash
gh --version
gh auth status
```

If your team uses an extension that provides `gh stack`, install it using that extension's documented installation instructions. Then verify:

```bash
gh stack --help
```

## 2. Initialize your first stack

Start from the trunk branch (usually `main`):

```bash
git switch main
git pull origin main
gh stack init feature/auth
```

This example assumes your installed stack extension supports `gh stack init <branch-name>`.

## 3. Work on the first layer

Implement the authentication logic, then commit your changes:

```bash
git add .
git commit -m "Add authentication logic"
```

## 4. Add another branch on top

Create the next layer in the stack:

```bash
gh stack add feature/auth-api
```

Implement the API changes and commit:

```bash
git add .
git commit -m "Add authentication API"
```

You can add another layer for the UI:

```bash
gh stack add feature/auth-ui
```

Implement the UI and commit those changes as well.

> Create each new layer from the top of the current stack so it depends on the previous layer.

## 5. Push the stack and create or update PRs

When your changes are ready, use the submit command supported by your extension. For extensions that support it, that may look like:

```bash
gh stack submit
```

Confirm the command's behavior with `gh stack submit --help` before running it, especially in repositories with existing PRs.

## 6. View and navigate the stack

Some stack extensions provide navigation commands such as:

```bash
gh stack view
gh stack bottom
gh stack top
gh stack up
gh stack down
```

Check `gh stack --help` for the exact commands supported by your installed extension.

## 7. Update an earlier layer

If you need to change an earlier PR, switch to that branch, make the change, and commit it:

```bash
# Example only: use the navigation command supported by your extension
gh stack bottom

# Make the required changes, then:
git add .
git commit -m "Fix authentication logic"
```

Then use your extension's documented rebase/push workflow to update dependent branches. Some extensions provide commands such as:

```bash
gh stack rebase
gh stack push
```

Check the extension's help first; do not assume these commands exist in every implementation.

## 8. Example branch flow

```text
main
└── feature/auth
    └── feature/auth-api
        └── feature/auth-ui
```

The PR targets typically look like this:

| PR | Head branch | Base branch |
|---|---|---|
| PR #1 | `feature/auth` | `main` |
| PR #2 | `feature/auth-api` | `feature/auth` |
| PR #3 | `feature/auth-ui` | `feature/auth-api` |

Each PR should focus on the changes introduced by its own layer. The lower PRs are dependencies for the layers above them.

## 9. Merge and sync

Review and merge from the bottom of the stack upward. After a lower PR is merged, use your extension's documented sync/rebase workflow to update the remaining branches. Some implementations provide a command such as:

```bash
gh stack sync
```

Verify its behavior with the extension's help before running it.

## Best practices

- Keep each PR focused on one logical change.
- Create new branches from the top of the current stack.
- Review and merge from the bottom upward.
- Rebase dependent branches when a lower layer changes.
- Use your stack extension's submit/sync workflow to keep PR base branches correct.
- Check `gh stack --help` because `gh stack` commands depend on the extension installed.

**Goal:** smaller PRs, faster reviews, less context switching, and easier collaboration.
