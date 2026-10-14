#!/bin/sh
set -eu

check=$(cd "$(dirname "$0")" && pwd)/check.sh
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
status=0

skill() {
  mkdir -p "$1/skills/$2"
  printf -- '---\n%s\n---\n%s\n' "$3" "$4" >"$1/skills/$2/SKILL.md"
}

expect_fail() {
  repo="$tmp/$1"
  mkdir -p "$repo/skills"
  if out=$("$check" "$repo" 2>&1); then
    echo "FAIL $1: expected exit 1, got 0" >&2
    status=1
  elif ! printf '%s\n' "$out" | grep -q "$2"; then
    echo "FAIL $1: expected message '$2', got:" >&2
    printf '%s\n' "$out" >&2
    status=1
  fi
}

skill "$tmp/valid" valid "name: valid
description: x" "see [self](SKILL.md)"
printf 'rule\n' >"$tmp/valid/AGENTS.md"
"$check" "$tmp/valid" >/dev/null || { echo "FAIL valid: expected exit 0" >&2; status=1; }

skill "$tmp/wrong-name" wrong-name "name: other
description: x" "body"
expect_fail wrong-name "differs from directory"

skill "$tmp/bad-name" Bad_Name "name: Bad_Name
description: x" "body"
expect_fail bad-name "lowercase"

skill "$tmp/long-desc" long-desc "name: long-desc
description: $(head -c 1100 /dev/zero | tr '\0' a)" "body"
expect_fail long-desc "limit 1024"

skill "$tmp/long-folded-desc" long-folded-desc "name: long-folded-desc
description: >
  $(head -c 600 /dev/zero | tr '\0' a)
  $(head -c 600 /dev/zero | tr '\0' a)" "body"
expect_fail long-folded-desc "limit 1024"

skill "$tmp/no-desc" no-desc "name: no-desc" "body"
expect_fail no-desc "missing description"

skill "$tmp/empty-block-desc" empty-block-desc "name: empty-block-desc
description: |" "body"
expect_fail empty-block-desc "missing description"

skill "$tmp/extra-field" extra-field "name: extra-field
description: x
unsupported: true" "body"
expect_fail extra-field "not portable"

skill "$tmp/long-body" long-body "name: long-body
description: x" "$(yes line | head -n 600)"
expect_fail long-body "under 500"

skill "$tmp/bad-link" bad-link "name: bad-link
description: x" "see [ref](MISSING.md) and [ok](#anchor) and [url](https://example.com)"
expect_fail bad-link "broken link MISSING.md"

skill "$tmp/unpaired" unpaired "name: unpaired
description: x
disable-model-invocation: true" "body"
mkdir -p "$tmp/unpaired/skills/unpaired/agents"
printf 'interface:\n  display_name: X\n' >"$tmp/unpaired/skills/unpaired/agents/openai.yaml"
expect_fail unpaired "allow_implicit_invocation"

skill "$tmp/no-yaml" no-yaml "name: no-yaml
description: x
disable-model-invocation: true" "body"
expect_fail no-yaml "allow_implicit_invocation"

mkdir -p "$tmp/no-skill-md/skills/no-skill-md"
expect_fail no-skill-md "missing SKILL.md"

mkdir -p "$tmp/no-frontmatter/skills/nofm"
printf 'no frontmatter\n' >"$tmp/no-frontmatter/skills/nofm/SKILL.md"
expect_fail no-frontmatter "missing frontmatter"

mkdir -p "$tmp/long-agents"
yes line | head -n 250 >"$tmp/long-agents/AGENTS.md"
expect_fail long-agents "under 200"

mkdir -p "$tmp/agents-link"
printf 'see [doc](docs/MISSING.md)\n' >"$tmp/agents-link/AGENTS.md"
expect_fail agents-link "broken link docs/MISSING.md"

[ "$status" -eq 0 ] && echo "ok: check.sh"
exit "$status"
