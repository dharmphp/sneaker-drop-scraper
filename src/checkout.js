// Headless Auto-Cart and Checkout Simulator
const { applyStealth } = require('./stealth');

async function attemptAddToCart(browser, target, desiredSizes) {
  const page = await browser.newPage();
  await applyStealth(page);

  try {
    console.log(`[CHECKOUT] Navigating to target: ${target.url}`);
    await page.goto(target.url, { waitUntil: 'networkidle2' });

    // Look for size selection buttons
    const sizeButtons = await page.$$('.size-selector button, .gl-label');
    let sizeSelected = false;

    for (const btn of sizeButtons) {
      const sizeText = await page.evaluate(el => el.textContent.trim(), btn);
      if (desiredSizes.includes(sizeText)) {
        console.log(`[CHECKOUT] Found desired size: ${sizeText}, clicking...`);
        await btn.click();
        sizeSelected = true;
        break;
      }
    }

    if (!sizeSelected && sizeButtons.length > 0) {
      // Pick first available size as fallback
      console.log('[CHECKOUT] Desired size unavailable, picking first active size');
      await sizeButtons[0].click();
    }

    // Small delay to simulate human click (150-300ms)
    await page.waitForTimeout(200);

    // Click Add to Bag / Buy Now
    const buyButton = await page.$(target.selectors.buyButton);
    if (buyButton) {
      await buyButton.click();
      console.log('[CHECKOUT] Clicked Buy Button! Waiting for cart modal...');
      await page.waitForTimeout(1000);
      return { success: true, timestamp: new Date().toISOString() };
    }

    return { success: false, reason: 'Buy button missing' };
  } catch (err) {
    console.error('[CHECKOUT ERROR]', err.message);
    return { success: false, error: err.message };
  } finally {
    // Keep page open for manual OTP verification if needed
  }
}

module.exports = { attemptAddToCart };
