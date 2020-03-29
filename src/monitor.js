// Puppeteer Product Page Monitor
const puppeteer = require('puppeteer');

class StockMonitor {
  constructor(targetConfig) {
    this.target = targetConfig;
    this.browser = null;
    this.isAvailable = false;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
    });
  }

  async checkStock() {
    const page = await this.browser.newPage();
    try {
      await page.goto(this.target.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const buyBtn = await page.$(this.target.selectors.buyButton);
      if (buyBtn) {
        const text = await page.evaluate(el => el.textContent.trim(), buyBtn);
        if (/add to bag|buy now|purchase/i.test(text)) {
          console.log(`[STOCK ALERT] ${this.target.name} IS LIVE!`);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error(`Error checking ${this.target.name}:`, err.message);
      return false;
    } finally {
      await page.close();
    }
  }

  async close() {
    if (this.browser) await this.browser.close();
  }
}

module.exports = StockMonitor;
