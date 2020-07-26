// Rotating Proxy Pool Manager
class ProxyPool {
  constructor(proxyList = []) {
    this.proxies = proxyList.map(p => ({ url: p, failCount: 0, cooldownUntil: 0 }));
    this.currentIndex = 0;
  }

  getNextProxy() {
    if (this.proxies.length === 0) return null;
    const now = Date.now();
    for (let i = 0; i < this.proxies.length; i++) {
      const idx = (this.currentIndex + i) % this.proxies.length;
      const candidate = this.proxies[idx];
      if (candidate.cooldownUntil <= now) {
        this.currentIndex = (idx + 1) % this.proxies.length;
        return candidate.url;
      }
    }
    // All proxies are cooling down, return first anyway
    return this.proxies[0].url;
  }

  reportFailure(proxyUrl, statusCode) {
    const item = this.proxies.find(p => p.url === proxyUrl);
    if (item) {
      item.failCount++;
      if (statusCode === 429 || item.failCount > 3) {
        // Cooldown for 5 minutes
        item.cooldownUntil = Date.now() + 5 * 60 * 1000;
        console.warn(`Proxy ${proxyUrl} flagged with ${statusCode}, placed on 5min cooldown.`);
      }
    }
  }

  reportSuccess(proxyUrl) {
    const item = this.proxies.find(p => p.url === proxyUrl);
    if (item) {
      item.failCount = 0;
    }
  }
}

module.exports = ProxyPool;
