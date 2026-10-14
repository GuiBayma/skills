#!/bin/sh
# Links the agent config files in $HOME to the files in this repo.
# Idempotent: safe to run again after cloning or moving the repo.
set -eu

repo=$(cd "$(dirname "$0")" && pwd)

# link SOURCE TARGET: points TARGET at SOURCE, backing up any regular file in the way.
link() {
  mkdir -p "$(dirname "$2")"
  if [ -e "$2" ] && [ ! -L "$2" ]; then
    mv "$2" "$2.bak"
    echo "backed up $2 -> $2.bak"
  fi
  ln -sfn "$1" "$2"
  echo "$2 -> $1"
}

# Claude Code reads CLAUDE.md; Codex reads AGENTS.md.
link "$repo/AGENTS.md" "$HOME/.claude/CLAUDE.md"
link "$repo/AGENTS.md" "$HOME/.codex/AGENTS.md"
