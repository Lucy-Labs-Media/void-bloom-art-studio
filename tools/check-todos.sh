#!/usr/bin/env bash
# Run from the repo root in Git Bash:  bash tools/check-todos.sh
echo "Placeholders still on the site:"
grep -rn --include=*.html -e 'class="todo' -e 'class="[^"]* todo' -e 'content="TODO' -e '<title>TODO' . || echo "  none"
echo
echo "Draft wording Lindsey has not approved yet (remove the DRAFT WORDING comment once she has):"
grep -rn --include=*.html 'DRAFT WORDING' . | cut -d: -f1,2 | sed 's/^/  /' || true
echo
echo "Still to replace by hand:"
grep -rn --include=*.html 'value="YOUR_ACCESS_KEY_HERE"' . | cut -d: -f1,2 | sed 's/^/  /'
