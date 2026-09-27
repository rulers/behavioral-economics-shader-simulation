#!/bin/sh
set -eu

simulator_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
port=${PORT:-8000}

if ! command -v python3 >/dev/null 2>&1; then
  printf '%s\n' 'Python 3 is required to run the local web server.' >&2
  exit 1
fi

printf 'Serving simulations at http://127.0.0.1:%s/\n' "$port"
cd "$simulator_dir"
exec python3 -m http.server "$port" --bind 127.0.0.1