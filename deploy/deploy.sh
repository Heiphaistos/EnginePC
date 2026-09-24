#!/usr/bin/env bash
# Déploiement statique d'EnginePC sur le VPS (sans Docker).
# Usage (sur le VPS, dans le dépôt cloné) : ./deploy/deploy.sh
set -euo pipefail
TARGET=${TARGET:-/var/www/enginepc}
cd "$(dirname "$0")/.."
git pull --ff-only
npm ci
npm test
npm run build
sudo mkdir -p "$TARGET"
sudo rsync -a --delete dist/ "$TARGET/"
sudo nginx -t && sudo systemctl reload nginx
echo "EnginePC déployé dans $TARGET"
