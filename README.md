# Sneaker Drop Scraper & Auto-Checkout Monitor

High-speed stock monitoring and automated headless checkout utility for limited-edition sneaker releases (Adidas Yeezy, Nike SNKRS, FootLocker).
Built for a client in 2020 to detect flash launches within seconds and initiate automated reservation.

## Features
- **Headless Browser Automation**: Puppeteer-drivenDOM inspection for dynamic countdowns and AJAX inventory updates.
- **Stealth Evasions**: Obfuscates headless browser signatures (removes `navigator.webdriver`, injects authentic plugins and WebGL fingerprint).
- **Proxy Rotation**: Automatic proxy rotation pool with cooldown upon HTTP 429 rate limits.
- **Multi-Channel Alerts**: Webhooks for Discord and Telegram with direct checkout links.

Author: Dharmesh Patel <dharmkp@gmail.com>
