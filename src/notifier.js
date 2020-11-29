// Discord & Telegram Webhook Notifier
const axios = require('axios');

async function sendDiscordAlert(webhookUrl, product) {
  if (!webhookUrl) return;
  const embed = {
    title: `🚨 DROP LIVE: ${product.title}`,
    url: product.url,
    color: 0x00ff88,
    fields: [
      { name: "Price", value: product.price || "Check site", inline: true },
      { name: "Available Sizes", value: (product.sizes || []).join(', ') || "Multiple", inline: true },
      { name: "Direct Link", value: `[Click to Buy](${product.url})`, inline: false }
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "Sneaker Drop Bot by Dharmesh" }
  };

  try {
    await axios.post(webhookUrl, { embeds: [embed] });
    console.log('[NOTIFIER] Discord alert sent successfully.');
  } catch (err) {
    console.error('[NOTIFIER] Failed sending discord alert:', err.message);
  }
}

module.exports = { sendDiscordAlert };
