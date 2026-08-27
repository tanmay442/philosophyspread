# Contributing to Philosophy Spread

Thanks for your interest in contributing to Philosophy Spread.

## How to contribute

You can contribute in three ways:

1. **Content contributions** (essays, idea-bits, feedback on logic modules)
   - See: https://philosophyspread.live/contribute

2. **Code contributions**
   - Fork/branch
   - Make focused commits
   - Open a PR to `master`

3. **Issue reports / improvements**
   - Open a clear issue with repro steps and expected behavior

## CI workflows (detailed)

This repository uses a single combined GitHub Actions workflow:

### Build + Fallow
File: `.github/workflows/build-fallow.yml`

**Runs on:**
- push to `master`
- PRs targeting `master`

**Execution optimization:**
- Uses workflow concurrency to cancel duplicate in-progress runs for the same branch/PR head.
- Uses pnpm dependency caching via `actions/setup-node` (requires pnpm setup before caching) to speed up installs.

**What it does (normal path):**
1. Installs dependencies
2. Runs TypeScript linting, Astro diagnostics, and utility unit tests
3. Runs `pnpm build`
4. Runs `pnpm fallow --no-cache` with `.github/fallow.ci.json`
5. Parses and classifies findings:
   - **blocking code findings** (blocking)
   - **duplicate clone findings** (warning only after known intentional fingerprints are filtered)
   - **maintainability findings** (warning only)

**Fail/block rules:**
- Build failure -> workflow fails
- Fallow report failure -> workflow fails (via a follow-up gate step)
- Blocking code findings > 0 -> workflow fails (blocks merge when required checks are enabled)
- Duplicate findings > 0 -> workflow does not fail; it warns and tags the actor

**PR to `master` extra behavior:**
- Posts/updates one PR comment containing a short summary (exit code, blocking code count, duplicate clone groups, and maintainability findings) plus the full Fallow JSON report in a collapsible section.
- The comment uses marker `<!-- fallow-full-report-pr -->` for stable discovery.

## Maintainer-only emergency bypass

For urgent production situations, there is a maintainer-only bypass flag.

- **Flag:** `[skip-tanmay-gates]`
- **Who can use it:** only GitHub user **`tanmay442`**
**Where it works:**
- direct `push` to `master` (skips Build + Fallow workflow)

If anyone else uses this flag, it has no effect.

## Branch protection recommendation

On `master`, require these checks:
- `Build + Fallow / build-fallow`

This ensures failing build/dead-code states block merge while CodeRabbit remains the automated review tool.

---

**Footer reminder:** maintainer emergency bypass flag is `[skip-tanmay-gates]` (only `tanmay442`).
