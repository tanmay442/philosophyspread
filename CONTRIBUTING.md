# Contributing to Philosophy Spread

Thanks for your interest in contributing to Philosophy Spread.

## How to contribute

You can contribute in three ways:

1. **Content contributions** (essays, idea-bits, feedback on logic modules)
   - See: https://philosophyspread.live/contribute

2. **Code contributions**
   - Fork/branch
   - Make focused commits
   - Open a PR to `main`

3. **Issue reports / improvements**
   - Open a clear issue with repro steps and expected behavior

## Development checks

CI currently runs:

- `pnpm build`
- `npx fallow --config .github/fallow.ci.json`
- CodeRabbit review gate on PRs to `main`

## Maintainer-only emergency bypass

For urgent production situations, there is a maintainer-only bypass flag.

- **Flag:** `[skip-tanmay-gates]`
- **Who can use it:** only GitHub user **`tanmay442`**
- **Where it works:**
  - direct `push` to `main` (skips Build + Fallow workflow)
  - PR review gate workflow (skips CodeRabbit/Copilot gate)

If anyone else uses this flag, it has no effect.

