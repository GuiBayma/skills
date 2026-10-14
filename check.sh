#!/bin/sh
set -eu

repo=${1:-$(cd "$(dirname "$0")" && pwd)}
status=0

fail() {
  echo "FAIL $1" >&2
  status=1
}

# Takes a pipeline's output as an argument because its subshell cannot set status.
report() {
  [ -z "$1" ] || fail "$1"
}

frontmatter() {
  awk 'NR==1 && $0!="---" {exit} NR>1 && $0=="---" {exit} NR>1 {print}' "$1"
}

field() {
  printf '%s\n' "$1" | awk -v key="$2" -v quote="[\"']" '
    block {
      if ($0 ~ /^[^ \t]/) exit
      sub(/^[ \t]+/, "")
      out = out (out == "" ? "" : sep) $0
      next
    }
    substr($0, 1, length(key) + 1) == key ":" {
      value = substr($0, length(key) + 2)
      gsub(/^[ \t]+|[ \t]+$/, "", value)
      if (value ~ /^[>|][+-]?$/) { block = 1; sep = (value ~ /^>/) ? " " : "\n"; next }
      sub("^" quote, "", value); sub(quote "$", "", value)
      print value
      exit
    }
    END { if (block) print out }'
}

body_lines() {
  awk 'NR>1 && $0=="---" {found=1; next} found {n++} END {print n+0}' "$1"
}

check_fields() {
  printf '%s\n' "$1" | sed -n 's/^\([A-Za-z_-]*\):.*/\1/p' | while IFS= read -r key; do
    case $key in
      name | description | license | compatibility | metadata | allowed-tools | disable-model-invocation) ;;
      *) echo "$2: field '$key' is not portable" ;;
    esac
  done
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

  report "$(check_fields "$fm" "$skill")"

  lines=$(body_lines "$skill")
  [ "$lines" -lt 500 ] || fail "$skill: body has $lines lines, keep it under 500"

  report "$(find "$dir" -name '*.md' -print | while IFS= read -r md; do check_links "$md"; done)"

  yaml="$dir/agents/openai.yaml"
  if [ "$(field "$fm" disable-model-invocation)" = "true" ]; then
    grep -Eqs '^[[:space:]]*allow_implicit_invocation:[[:space:]]*false' "$yaml" \
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
  report "$(check_links "$agents")"
fi

[ "$status" -eq 0 ] && echo "ok: $repo"
exit "$status"
