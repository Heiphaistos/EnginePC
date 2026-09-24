// Serveur de démonstration du contrat comparateur (docs/INTEGRATION.md).
// Usage : node scripts/mock-price-api.mjs  puis, dans EnginePC > Paramètres : http://localhost:8787
import { createServer } from 'node:http'

const PORT = Number(process.env.PORT ?? 8787)
const MERCHANTS = ['LDLC', 'Materiel.net', 'Amazon', 'Top Achat', 'Cdiscount']

// Prix pseudo-aléatoires mais stables par produit.
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

function offersFor(item) {
  const base = 50 + (hash(item.id) % 900)
  return MERCHANTS.slice(0, 2 + (hash(item.id) % 3)).map((merchant, i) => ({
    merchant,
    price: Math.round((base * (0.92 + ((hash(item.id + merchant) % 20) / 100))) * 100) / 100,
    currency: 'EUR',
    url: `https://example.com/${encodeURIComponent(merchant)}/${item.id}`,
    inStock: (hash(merchant + item.id) + i) % 5 !== 0,
    shipping: i % 2 ? 4.99 : 0,
    updatedAt: new Date().toISOString(),
  }))
}

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.writeHead(204).end()
  if (req.method === 'POST' && req.url === '/api/v1/prices/lookup') {
    let body = ''
    for await (const chunk of req) body += chunk
    const { items = [] } = JSON.parse(body || '{}')
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ results: items.map((it) => ({ id: it.id, offers: offersFor(it) })) }))
  }
  if (req.method === 'GET' && req.url === '/api/v1/catalog') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ components: [], devices: [] }))
  }
  res.writeHead(404).end()
}).listen(PORT, () => console.log(`Mock comparateur sur http://localhost:${PORT}`))
