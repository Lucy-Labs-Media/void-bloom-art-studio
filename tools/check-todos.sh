#!/usr/bin/env bash
# Lists every placeholder still on the site. The site is ready to share when this prints nothing.
# Run from the repo root in Git Bash:  bash tools/check-todos.sh
grep -rn --include=*.html -e 'class="todo' -e 'class="[^"]* todo' -e 'content="TODO' -e '<title>TODO' . || echo "No placeholders left."
echo
echo "Still to replace by hand:"
grep -rn --include=*.html 'YOUR_ACCESS_KEY_HERE' . | sed 's/^/  /'
