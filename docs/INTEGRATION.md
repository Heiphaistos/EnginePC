# Câblage EnginePC ⇄ comparateur de prix

EnginePC (configurateur) et le comparateur de prix sont deux sites séparés. Ils communiquent par un
**contrat HTTP simple**, implémenté côté EnginePC dans `src/services/pricing.ts`. Il suffit que le
comparateur expose les points d'entrée ci-dessous.

```
EnginePC ──POST /api/v1/prices/lookup──▶ Comparateur   (prix live dans le configurateur)
EnginePC ──GET  /api/v1/catalog────────▶ Comparateur   (synchronisation du catalogue, optionnel)
EnginePC ──lien /recherche?q=…─────────▶ Comparateur   (« voir les prix » d'un produit)
EnginePC ──lien /configuration?data=…──▶ Comparateur   (envoi d'une config complète)
```

Configuration : variable `VITE_PRICE_API_URL` au build, ou page **Paramètres** (URL, clé d'API, pays, devise).

## 1. `POST /api/v1/prices/lookup`

Requête (envoyée avec `Authorization: Bearer <clé>` si une clé est configurée) :

```json
{
  "currency": "EUR",
  "country": "FR",
  "items": [
    { "id": "amd-ryzen-7-9800x3d", "name": "AMD Ryzen 7 9800X3D", "category": "cpu", "ean": "0730143316118", "mpn": "100-100001084WOF" }
  ]
}
```

- `id` : identifiant stable EnginePC (clé de correspondance recommandée).
- `ean` / `mpn` : présents quand connus, à utiliser pour le matching si l'`id` est inconnu.

Réponse :

```json
{
  "results": [
    {
      "id": "amd-ryzen-7-9800x3d",
      "best": { "merchant": "LDLC", "price": 469.95, "currency": "EUR", "url": "https://…", "inStock": true, "shipping": 0 },
      "offers": [
        { "merchant": "LDLC", "price": 469.95, "currency": "EUR", "url": "https://…", "inStock": true, "shipping": 0, "updatedAt": "2026-09-24T10:00:00Z" }
      ]
    }
  ]
}
```

`best` est optionnel : s'il est absent, EnginePC prend l'offre en stock la moins chère (prix + livraison).
Les produits non trouvés peuvent simplement être omis. EnginePC regroupe les produits d'une configuration
dans une seule requête et met les résultats en cache pendant la session.

## 2. `GET /api/v1/catalog` (optionnel)

Permet au comparateur d'ajouter ou de mettre à jour des produits dans EnginePC (bouton
« Synchroniser le catalogue » dans Paramètres). Format identique à l'export du catalogue :

```json
{ "components": [ /* PCComponent */ ], "devices": [ /* Device */ ] }
```

Les types sont définis dans `src/types/index.ts`. Un produit dont l'`id` existe déjà remplace l'original.

## 3. Liens profonds

| Lien | Usage |
|------|-------|
| `/recherche?q=<nom>&ref=<id>&category=<cat>&ean=<ean>&mpn=<mpn>` | fiche / recherche d'un produit |
| `/configuration?data=<code>&source=enginepc` | ouvrir une configuration complète |

`data` est la configuration encodée en **base64url(JSON)** :

```json
{ "name": "PC fixe Gaming", "deviceType": "desktop", "profile": "gaming",
  "slots": { "cpu": "amd-ryzen-7-9800x3d", "gpu": ["nvidia-rtx-5080-fe"], "motherboard": "…", "ram": "…", "ramKits": 1,
             "storage": ["…"], "psu": "…", "case": "…", "cooler": "…" },
  "deviceId": null }
```

Décodage côté comparateur (Node.js) :

```js
const build = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
```

Le même code ouvre la configuration dans EnginePC : `https://enginepc.heiphaistos.org/partage/<code>`.
Le comparateur peut donc renvoyer vers EnginePC avec un bouton « Modifier cette configuration ».

## 4. Export JSON complet

Le bouton « Exporter → JSON » produit un document `schema: "enginepc.build"` contenant la config, le
récapitulatif (prix total, score, consommation) et la liste des articles avec quantités, EAN et MPN :
le comparateur peut l'importer directement pour constituer un panier multi-marchands.

## 5. CORS

Si le comparateur est sur un autre domaine, il doit répondre à EnginePC avec :

```
Access-Control-Allow-Origin: https://enginepc.heiphaistos.org
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

Exemple nginx côté comparateur :

```nginx
location /api/ {
    add_header Access-Control-Allow-Origin "https://enginepc.heiphaistos.org" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    if ($request_method = OPTIONS) { return 204; }
    proxy_pass http://127.0.0.1:3000;
}
```
