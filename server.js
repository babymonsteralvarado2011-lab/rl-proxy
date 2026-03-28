const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== SAFE FETCH =====
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
              name: item.name || "Unknown",
              price: item.price || "?",
              rarity: item.rarity || "Unknown",
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

    } catch (err) {
      console.log("❌ Fetch failed:", err.message);
    }
  }

  // 🔥 GUARANTEED FALLBACK
  return [
    { name: "Fennec", price: 500, rarity: "Import", section: "featured" },
    { name: "Octane ZSR", price: 700, rarity: "Import", section: "featured" },
    { name: "Interstellar", price: 2000, rarity: "Black Market", section: "featured" },
    { name: "Zomba", price: 1400, rarity: "Exotic", section: "daily" }
  ];
}

// ===== ROUTES =====
app.get('/', (req, res) => {
  res.send('🚀 RL Proxy is running. Use /shop');
});

app.get('/shop', async (req, res) => {
  try {
    const items = await getShop();

    res.json({
      success: true,
      count: items.length,
      items
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server crashed"
    });
  }
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
});
