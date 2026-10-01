#!/usr/bin/env bash
# Lancé sur le VPS par /usr/local/sbin/deployer (minuteur deployer-auto) après alignement
# de /opt/enginepc sur la branche suivie. Le site est servi par le conteneur Docker
# (docker-compose.yml + docker-compose.override.yml du VPS, 127.0.0.1:3033 derrière nginx) :
# reconstruire le conteneur, pas un dossier statique que nginx ne sert pas.
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose up -d --build --remove-orphans
