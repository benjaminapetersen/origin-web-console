#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

echo "[INFO] Starting virtual framebuffer for headless tests..."
export DISPLAY=':10'
export SCREEN='0'
Xvfb "${DISPLAY}" -screen "${SCREEN}" 1024x768x24 -ac &

while ! xrandr --display "${DISPLAY}" --screen "${SCREEN}"; do
	sleep 0.2
done

grunt "$@"
