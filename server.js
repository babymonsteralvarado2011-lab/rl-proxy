const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== FETCH REAL SHOP =====
async function getShop() {
  const urls = [
    'https://rl.insider.gg/api/shop',
    'https://rlshop.gg/api/shop'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      if (!res.ok) continue;

      const json = await res.json();

      let items = [];

      if (json.data) {
        for (const section in json.data) {
          for (const item of json.data[section]) {
            items.push({
              name: item.name,
              price: item.price,
              rarity: item.rarity,
              section: section.toLowerCase()
            });
          }
        }
      } else {
        const raw = json.items || json;

        items = raw.map(i => ({
          name: i.name || "Unknown",
          price: i.price || "?",
          rarity: i.rarity || "Unknown",
          section: (i.section || "featured").toLowerCase()
        }));
      }

      if (items.length > 0) return items;

    } catch {}
  }

  return [];
}

// ===== ROUTES =====
app.get('/shop', async (req, res) => {
  try {
    const items = await getShop();

    if (!items.length) {
      return res.json({ error: "No shop data" });
    }

    res.json({ items });

  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
});
