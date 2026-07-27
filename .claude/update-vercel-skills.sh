#!/usr/bin/env bash
# Re-vendor the Vercel agent skills and rebuild the chat upload bundles.
# Usage: ./.claude/update-vercel-skills.sh
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

git clone --depth 1 https://github.com/vercel-labs/agent-skills.git "$tmp/agent-skills"
git clone --depth 1 https://github.com/vercel-labs/skills.git "$tmp/skills"

readme="$here/skills/README.md"
cp "$readme" "$tmp/README.md"
rm -rf "$here/skills"
mkdir -p "$here/skills"

cp -r "$tmp"/agent-skills/skills/*/ "$here/skills/"
cp -r "$tmp"/skills/skills/find-skills "$here/skills/find-skills"
# upstream ships a stray archive inside this skill; it is not part of the skill
rm -f "$here/skills/deploy-to-vercel/Archive.zip"
cp "$tmp/README.md" "$readme"

mkdir -p "$here/skill-bundles"
rm -f "$here"/skill-bundles/*.zip
cd "$here/skills"
for d in */; do
  n="${d%/}"
  zip -qr "$here/skill-bundles/$n.zip" "$n" -x '*.DS_Store'
done

echo "Updated $(find "$here/skills" -maxdepth 1 -mindepth 1 -type d | wc -l) skills."
