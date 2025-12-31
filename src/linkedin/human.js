// src/linkedin/human.js

export async function humanDelay(min = 500, max = 1200) {
  const delay = Math.random() * (max - min) + min;
  return new Promise((res) => setTimeout(res, delay));
}

export async function humanScroll(page) {
  const steps = Math.floor(Math.random() * 4) + 2;

  for (let i = 0; i < steps; i++) {
    const deltaY = Math.random() * 400 + 200;

    // ✅ Playwright API (deltaX, deltaY)
    await page.mouse.wheel(0, deltaY);

    await humanDelay(400, 900);
  }
}

/**
 * Human-like mouse hover:
 * - slight overshoot
 * - micro-corrections
 * - variable speed curve
 *
 * Conceptually similar to Bézier-based movement,
 * implemented with lightweight randomness.
 */
export async function humanHover(page, selector) {
  const el = await page.$(selector);
  if (!el) return;

  const box = await el.boundingBox();
  if (!box) return;

  const targetX = box.x + box.width / 2;
  const targetY = box.y + box.height / 2;

  // Overshoot (humans rarely land perfectly)
  const overshootX = targetX + (Math.random() * 20 - 10);
  const overshootY = targetY + (Math.random() * 20 - 10);

  // Fast approach
  await page.mouse.move(overshootX, overshootY, {
    steps: Math.floor(Math.random() * 12) + 8,
  });

  // Micro correction (slow)
  await page.mouse.move(targetX, targetY, {
    steps: Math.floor(Math.random() * 8) + 6,
  });

  await humanDelay(300, 700);
}
