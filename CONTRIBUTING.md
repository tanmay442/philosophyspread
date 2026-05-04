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

## CI workflows (detailed)

This repository uses two GitHub Actions workflows:

### 1) Build + Fallow
File: `.github/workflows/build-fallow.yml`

**Runs on:**
- every push to any branch
- every PR to any branch

**What it does (normal path):**
1. Installs dependencies
2. Runs `pnpm build`
3. Runs `fallow` with `.github/fallow.ci.json`
4. Prints full fallow JSON output in workflow logs (no artifact upload)
5. Parses and classifies findings:
   - **dead code related findings** (blocking)
   - **duplicate clone findings** (warning only)

**Fail/block rules:**
- Build failure -> workflow fails
- Fallow execution failure -> workflow fails
- Dead code findings > 0 -> workflow fails (blocks merge when required checks are enabled)
- Duplicate findings > 0 -> workflow does not fail; it warns and tags the actor

**PR to `main` / `master` extra behavior:**
- Posts/updates a PR comment with the full fallow JSON report so Copilot can use it as context.
- The comment uses marker `<!-- fallow-full-report-main-pr -->` for stable discovery.

### 2) AI Review Guidance (Copilot)
File: `.github/workflows/quality-ai-review.yml`

**Runs on:**
- PRs to `main` and `master` (`opened`, `synchronize`, `reopened`, `ready_for_review`)

**What it does (normal path):**
1. Posts/updates an `@copilot` guidance comment
2. Best-effort requests Copilot as reviewer
3. Relies on the fallow report PR comment as analysis context (`<!-- fallow-full-report-main-pr -->`)

**Fail/block rules:**
- This workflow does not enforce CodeRabbit checks.

## Maintainer-only emergency bypass

For urgent production situations, there is a maintainer-only bypass flag.

- **Flag:** `[skip-tanmay-gates]`
- **Who can use it:** only GitHub user **`tanmay442`**
- **Where it works:**
  - direct `push` to `main` (skips Build + Fallow workflow)
  - PR review guidance workflow (skips Copilot guidance steps)

If anyone else uses this flag, it has no effect.

## Branch protection recommendation

On `main`, require these checks:
- `Build + Fallow / build-fallow`
- `AI Review Guidance (Copilot) / ai-review-gate`

This ensures failing build/dead-code states block merge, while Copilot guidance is always posted on PRs.

---

**Footer reminder:** maintainer emergency bypass flag is `[skip-tanmay-gates]` (only `tanmay442`).

