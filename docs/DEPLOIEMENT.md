# Déploiement sur le VPS — enginepc.heiphaistos.org

EnginePC est une application **100 % statique** (Vite + React). Une fois compilée, c'est un dossier `dist/`
que n'importe quel serveur web peut servir. Il n'y a ni base de données ni back-end à faire tourner.

## Prérequis DNS

Créer un enregistrement chez le registrar de `heiphaistos.org` :

| Type | Nom        | Valeur            |
|------|------------|-------------------|
| A    | `enginepc` | IPv4 du VPS       |
| AAAA | `enginepc` | IPv6 du VPS (opt.)|

## Option A — nginx directement sur le VPS (recommandé)

```bash
# 1. Dépendances (Debian / Ubuntu)
sudo apt install -y nginx certbot python3-certbot-nginx rsync git
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs

# 2. Code
git clone https://github.com/Heiphaistos/EnginePC.git ~/EnginePC && cd ~/EnginePC

# 3. Site nginx
sudo cp deploy/nginx.conf /etc/nginx/sites-available/enginepc.heiphaistos.org
sudo ln -s /etc/nginx/sites-available/enginepc.heiphaistos.org /etc/nginx/sites-enabled/

# 4. Build + copie dans /var/www/enginepc + reload nginx
./deploy/deploy.sh

# 5. HTTPS (Let's Encrypt, renouvellement automatique)
sudo certbot --nginx -d enginepc.heiphaistos.org
```

Pour les mises à jour suivantes : `cd ~/EnginePC && ./deploy/deploy.sh`.

## Option B — Docker

```bash
cd ~/EnginePC
docker compose up -d --build        # écoute sur 127.0.0.1:8080
```

Puis un reverse proxy nginx sur l'hôte :

```nginx
server {
    server_name enginepc.heiphaistos.org;
    location / { proxy_pass http://127.0.0.1:8080; proxy_set_header Host $host; }
}
```

et `sudo certbot --nginx -d enginepc.heiphaistos.org`.

## Mise à jour automatique des données ouvertes

`deploy.sh` régénère déjà les données à chaque déploiement. Pour les rafraîchir chaque nuit sans redéployer :

```bash
crontab -e
# puis ajouter :
0 4 * * * $HOME/EnginePC/deploy/sync-data.sh >> $HOME/enginepc-sync.log 2>&1
```

Le script télécharge le dataset (GitHub) et les taux BCE, puis copie `public/data/` dans `/var/www/enginepc/data/`
(`sudo rsync` : l'utilisateur du cron doit pouvoir lancer `sudo` sans mot de passe pour cette commande, ou
utilisez `TARGET` vers un dossier dont il est propriétaire).

## Point important : les routes

L'application utilise des URL propres (`/generer`, `/configurer/desktop`, `/partage/…`). Le serveur doit
renvoyer `index.html` pour toute URL inconnue — c'est le rôle de `try_files $uri $uri/ /index.html;`
dans les deux configurations nginx fournies.

## Connexion au comparateur de prix

- Au build : `VITE_PRICE_API_URL=https://prix.heiphaistos.org npm run build`
  (ou `VITE_PRICE_API_URL=... docker compose up -d --build`).
- Ou à chaud, par chaque utilisateur, dans **Paramètres**.

Si le comparateur est sur un autre sous-domaine, il doit autoriser le CORS pour
`https://enginepc.heiphaistos.org` (voir [INTEGRATION.md](INTEGRATION.md)).
