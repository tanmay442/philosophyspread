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

This repository uses a single combined GitHub Actions workflow:

### Build + Fallow + AI Review Guidance
File: `.github/workflows/build-fallow.yml`

**Runs on:**
- push to `main` or `master`
- PRs targeting `main` or `master`

**Execution optimization:**
- Uses workflow concurrency to cancel duplicate in-progress runs for the same branch/PR head.
- Uses pnpm dependency caching via `actions/setup-node` (requires pnpm setup before caching) to speed up installs.

**What it does (normal path):**
1. Installs dependencies
2. Runs `pnpm build`
3. Runs `pnpm fallow` with `.github/fallow.ci.json`
4. Prints full fallow JSON output in workflow logs (no artifact upload)
5. Parses and classifies findings:
   - **dead code related findings** (blocking)
   - **duplicate clone findings** (warning only)

**Fail/block rules:**
- Build failure -> workflow fails
- Fallow execution failure -> workflow fails (via a follow-up gate step)
- Dead code findings > 0 -> workflow fails (blocks merge when required checks are enabled)
- Duplicate findings > 0 -> workflow does not fail; it warns and tags the actor

**PR to `main` / `master` extra behavior:**
- Posts/updates a PR comment with a short summary (exit code, dead code count, duplicate clone groups) plus the full fallow JSON report so Copilot can use it as context.
- The comment uses marker `<!-- fallow-full-report-main-pr -->` for stable discovery.
- When issues are detected, the workflow updates a single summary comment (`<!-- fallow-summary -->`) instead of posting a new one each run.

**Embedded AI review job (`ai-review-gate`)**

**Runs only when:**
- Event is `pull_request`
- Target branch is `main` or `master`
- Maintainer bypass is not active
- It waits for `build-fallow` (`needs: build-fallow`) so the fallow report comment is available first.

**What it does (normal path):**
1. Posts/updates an `@copilot` guidance comment
2. Best-effort requests Copilot as reviewer
3. Relies on the fallow report PR comment as analysis context (`<!-- fallow-full-report-main-pr -->`)

**Fail/block rules:**
- This AI guidance job does not block merges; it posts guidance and requests Copilot as reviewer.

## Maintainer-only emergency bypass

For urgent production situations, there is a maintainer-only bypass flag.

- **Flag:** `[skip-tanmay-gates]`
- **Who can use it:** only GitHub user **`tanmay442`**
**Where it works:**
- direct `push` to `main` (skips Build + Fallow workflow)
- PRs to `main`/`master` (skips the AI guidance job entirely because `build-fallow` is bypassed)

If anyone else uses this flag, it has no effect.

## Branch protection recommendation

On `main`, require these checks:
- `Build + Fallow + AI Review Guidance / build-fallow`
- `Build + Fallow + AI Review Guidance / ai-review-gate`

This ensures failing build/dead-code states block merge, while Copilot guidance runs after fallow context is posted.

---

**Footer reminder:** maintainer emergency bypass flag is `[skip-tanmay-gates]` (only `tanmay442`).
