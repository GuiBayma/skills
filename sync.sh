#!/bin/sh
# Links the agent config files in $HOME to the files in this repo.
# Idempotent: safe to run again after cloning, moving the repo, or adding a skill.
set -eu

repo=$(cd "$(dirname "$0")" && pwd)
status=0

# link SOURCE TARGET: points TARGET at SOURCE, refusing to replace anything but a symlink.
link() {
  mkdir -p "$(dirname "$2")"
  if [ -e "$2" ] && [ ! -L "$2" ]; then
    echo "skipped $2: not a symlink; move it into the repo or delete it, then rerun" >&2
    status=1
    return
  fi
  ln -sfn "$1" "$2"
  echo "$2 -> $1"
}

# Claude Code reads CLAUDE.md; Codex reads AGENTS.md.
link "$repo/AGENTS.md" "$HOME/.claude/CLAUDE.md"
link "$repo/AGENTS.md" "$HOME/.codex/AGENTS.md"

for skill in "$repo"/skills/*/; do
  name=$(basename "$skill")
  link "$repo/skills/$name" "$HOME/.claude/skills/$name"
  link "$repo/skills/$name" "$HOME/.codex/skills/$name"
done

exit "$status"
