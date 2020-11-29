// Sneaker Drop Monitor CLI Entrypoint
const config = require('./config/sites.json');
const StockMonitor = require('./src/monitor');
const { attemptAddToCart } = require('./src/checkout');
const { sendDiscordAlert } = require('./src/notifier');

async function run() {
  console.log('==================================================');
  console.log(' Sneaker Drop Watcher & Auto-Checkout Engine');
  console.log('==================================================');

  for (const target of config.targets) {
    console.log(`Starting watcher for: ${target.name} (${target.url})`);
    const monitor = new StockMonitor(target);
    await monitor.init();

    // Check stock status
    const inStock = await monitor.checkStock();
    if (inStock) {
      await sendDiscordAlert(process.env.DISCORD_WEBHOOK_URL, {
        title: target.name,
        url: target.url,
        price: '₹14,999',
        sizes: config.targetSizes
      });

      console.log('Initiating automated checkout simulation...');
      const checkoutRes = await attemptAddToCart(monitor.browser, target, config.targetSizes);
      console.log('Checkout result:', checkoutRes);
    } else {
      console.log(`${target.name}: Currently out of stock / drop pending.`);
    }

    await monitor.close();
  }
}

if (require.main === module) {
  run().catch(console.error);
}
