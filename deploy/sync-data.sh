#!/usr/bin/env bash
# Rafraîchit les données ouvertes (base étendue + taux BCE) sans reconstruire le site.
# À lancer par cron sur le VPS, par exemple chaque nuit à 4 h :
#   0 4 * * * /home/<utilisateur>/EnginePC/deploy/sync-data.sh >> /var/log/enginepc-sync.log 2>&1
set -euo pipefail
TARGET=${TARGET:-/var/www/enginepc}
cd "$(dirname "$0")/.."
npm run sync
sudo mkdir -p "$TARGET/data"
sudo rsync -a public/data/ "$TARGET/data/"
echo "$(date -Is) données synchronisées dans $TARGET/data"
