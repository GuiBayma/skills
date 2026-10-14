#!/bin/sh
set -eu

repo=${1:-$(cd "$(dirname "$0")" && pwd)}
status=0

fail() {
  echo "FAIL $1" >&2
  status=1
}

# Collects a pipeline's messages here because its subshell cannot set status.
report() {
  msgs=$(cat)
  [ -z "$msgs" ] || fail "$msgs"
}

frontmatter() {
  awk 'NR==1 && $0!="---" {exit} NR>1 && $0=="---" {exit} NR>1 {print}' "$1"
}

field() {
  printf '%s\n' "$1" | sed -n "s/^$2:[[:space:]]*//p" | head -n 1
}

body_lines() {
  awk 'NR>1 && $0=="---" {found=1; next} found {n++} END {print n+0}' "$1"
}

check_links() {
  file=$1
  dir=$(dirname "$file")
  grep -o '](\([^)]*\))' "$file" | sed 's/^](//; s/)$//' | while IFS= read -r target; do
    case $target in
      '' | '#'* | *://* | mailto:*) continue ;;
    esac
    path=${target%%#*}
    [ -e "$dir/$path" ] || echo "$file: broken link $target"
  done
}

check_skill() {
  dir=${1%/}
  name=$(basename "$dir")
  skill="$dir/SKILL.md"

  [ -f "$skill" ] || { fail "$dir: missing SKILL.md"; return; }
  fm=$(frontmatter "$skill")
  [ -n "$fm" ] || { fail "$skill: missing frontmatter"; return; }

  fm_name=$(field "$fm" name)
  [ "$fm_name" = "$name" ] || fail "$skill: name '$fm_name' differs from directory '$name'"
  printf '%s' "$name" | grep -Eq '^[a-z0-9]+(-[a-z0-9]+)*$' \
    || fail "$dir: name must be lowercase letters, digits and single hyphens, not at the ends"
  [ ${#name} -le 64 ] || fail "$dir: name longer than 64 characters"

  desc=$(field "$fm" description)
  [ -n "$desc" ] || fail "$skill: missing description"
  [ ${#desc} -le 1024 ] || fail "$skill: description has ${#desc} characters, limit 1024"

  printf '%s\n' "$fm" | sed -n 's/^\([A-Za-z_-]*\):.*/\1/p' | while IFS= read -r key; do
    case $key in
      name | description | license | compatibility | metadata | allowed-tools | disable-model-invocation) ;;
      *) echo "$skill: field '$key' is not portable" ;;
    esac
  done | report

  lines=$(body_lines "$skill")
  [ "$lines" -lt 500 ] || fail "$skill: body has $lines lines, keep it under 500"

  find "$dir" -name '*.md' -print | while IFS= read -r md; do check_links "$md"; done | report

  yaml="$dir/agents/openai.yaml"
  if [ -f "$yaml" ] && [ "$(field "$fm" disable-model-invocation)" = "true" ]; then
    grep -Eq '^[[:space:]]*allow_implicit_invocation:[[:space:]]*false' "$yaml" \
      || fail "$yaml: pair disable-model-invocation with policy.allow_implicit_invocation: false"
  fi
}

for skill in "$repo"/skills/*/; do
  [ -d "$skill" ] && check_skill "$skill"
done

agents="$repo/AGENTS.md"
if [ -f "$agents" ]; then
  lines=$(wc -l <"$agents" | tr -d ' ')
  [ "$lines" -lt 200 ] || fail "$agents: $lines lines, keep it under 200"
  check_links "$agents" | report
fi

[ "$status" -eq 0 ] && echo "ok: $repo"
exit "$status"
