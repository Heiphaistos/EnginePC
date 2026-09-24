#!/usr/bin/env bash
# Déploiement statique d'EnginePC sur le VPS (sans Docker).
# Usage (sur le VPS, dans le dépôt cloné) : ./deploy/deploy.sh
set -euo pipefail
TARGET=${TARGET:-/var/www/enginepc}
cd "$(dirname "$0")/.."
# Les données ouvertes sont régénérées à chaque déploiement : on écarte la version locale avant le pull
git checkout -- public/data 2>/dev/null || true
git pull --ff-only
npm ci
# Données ouvertes à jour (en cas d'échec réseau, l'instantané versionné est conservé)
npm run sync || echo "⚠ synchro des données ouvertes impossible, instantané existant utilisé"
npm test
VITE_PRICE_API_URL=${VITE_PRICE_API_URL:-https://searchit.heiphaistos.org} npm run build
sudo mkdir -p "$TARGET"
sudo rsync -a --delete dist/ "$TARGET/"
# En-têtes de sécurité (CSP : origine du comparateur de prix)
PRICE_ORIGIN=$(printf '%s' "${VITE_PRICE_API_URL:-https://searchit.heiphaistos.org}" | sed -nE 's#^(https?://[^/]+).*#\1#p')
sed "s#__PRICE_API_ORIGIN__#${PRICE_ORIGIN}#" deploy/security-headers.conf | sudo tee /etc/nginx/snippets/enginepc-security-headers.conf >/dev/null
sudo nginx -t && sudo systemctl reload nginx
echo "EnginePC déployé dans $TARGET"
