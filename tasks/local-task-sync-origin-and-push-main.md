# Local Task: Sync GitHub Remote and Push `main`

## Source
Mirrors the cloud task:
1. `git remote set-url origin git@github.com:lianshi1025/SeedPalette.git`
2. `ssh -T git@github.com`
3. `git push origin main`

## Goal
Point `origin` to `git@github.com:lianshi1025/SeedPalette.git` and push local `main`.

## Status
- `pending` (cloud run failed on SSH connectivity)

## Notes from Cloud Task
- Error seen: `ssh: connect to host github.com port 22: Network is unreachable`
- This indicates SSH over port 22 was blocked in that environment.
