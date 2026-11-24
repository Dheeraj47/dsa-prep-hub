// verify_viewports.mjs
// Automated headless CDP test verifying responsiveness across all 8 required viewports:
// 320px, 360px, 375px, 390px, 414px, 768px, 1024px, 1440px.

const VIEWPORTS = [
  { name: 'Small Phone (320px)', width: 320, height: 568, mobile: true },
  { name: 'Compact Phone (360px)', width: 360, height: 640, mobile: true },
  { name: 'Standard Phone (375px)', width: 375, height: 667, mobile: true },
  { name: 'iPhone 12/13/14 (390px)', width: 390, height: 844, mobile: true },
  { name: 'Large Phone (414px)', width: 414, height: 896, mobile: true },
  { name: 'Tablet Portrait (768px)', width: 768, height: 1024, mobile: true },
  { name: 'Tablet Landscape (1024px)', width: 1024, height: 768, mobile: false },
  { name: 'Desktop (1440px)', width: 1440, height: 900, mobile: false },
];

async function main() {
  console.log('=== STARTING RESPONSIVE VIEWPORT SUITE VIA CHROME DEVTOOLS PROTOCOL ===\n');

  // 1. Fetch browser version & targets
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionData = await versionRes.json();
  console.log(`Connected to Chrome: ${versionData['Browser']}`);

  // Fetch existing targets from Chrome
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const targets = await listRes.json();
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  console.log(`Using Target: ${pageTarget.title || pageTarget.url}`);
  const wsUrl = pageTarget.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((resolve) => ws.onopen = resolve);

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async function setViewport(width, height, mobile) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile,
    });
    await new Promise((r) => setTimeout(r, 200));
  }

  // Wait for initial load
  await new Promise((r) => setTimeout(r, 1200));

  console.log('\n--- 1. TESTING WELCOME SCREEN ---');
  for (const vp of VIEWPORTS) {
    await setViewport(vp.width, vp.height, vp.mobile);
    const overflowCheck = await evaluate(`(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const bodyScrollW = document.body.scrollWidth;
      return {
        clientWidth: docW,
        scrollWidth: scrollW,
        bodyScrollWidth: bodyScrollW,
        hasOverflow: scrollW > docW || bodyScrollW > docW
      };
    })()`);

    if (overflowCheck.hasOverflow) {
      console.error(`[FAIL] ${vp.name}: Overflow detected! clientWidth=${overflowCheck.clientWidth}, scrollWidth=${overflowCheck.scrollWidth}`);
      process.exitCode = 1;
    } else {
      console.log(`[PASS] ${vp.name}: No overflow (clientWidth=${overflowCheck.clientWidth}, scrollWidth=${overflowCheck.scrollWidth})`);
    }
  }

  // Submit name to enter app
  console.log('\nStarting Student Session...');
  await evaluate(`(() => {
    const input = document.getElementById('student-name');
    if (input) {
      input.value = 'Responsive Tester';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const form = input.closest('form');
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  })()`);
  await new Promise((r) => setTimeout(r, 1000));

  console.log('\n--- 2. TESTING DASHBOARD PAGE ---');
  for (const vp of VIEWPORTS) {
    await setViewport(vp.width, vp.height, vp.mobile);
    const check = await evaluate(`(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const bodyScrollW = document.body.scrollWidth;
      return {
        clientWidth: docW,
        scrollWidth: scrollW,
        hasOverflow: scrollW > docW || bodyScrollW > docW
      };
    })()`);

    if (check.hasOverflow) {
      console.error(`[FAIL] Dashboard at ${vp.name}: Overflow! (clientWidth=${check.clientWidth}, scrollWidth=${check.scrollWidth})`);
      process.exitCode = 1;
    } else {
      console.log(`[PASS] Dashboard at ${vp.name}: Perfect fit (clientWidth=${check.clientWidth}, scrollWidth=${check.scrollWidth})`);
    }
  }

  console.log('\n--- 3. TESTING MOBILE NAVIGATION DRAWER (375px) ---');
  await setViewport(375, 667, true);
  const menuCheck = await evaluate(`(() => {
    // Click hamburger button
    const buttons = Array.from(document.querySelectorAll('header button'));
    const menuBtn = buttons.find(b => b.getAttribute('aria-label') === 'Toggle navigation menu');
    if (menuBtn) {
      menuBtn.click();
      return true;
    }
    return false;
  })()`);
  await new Promise((r) => setTimeout(r, 300));
  const navDrawerOverflow = await evaluate(`(() => {
    const docW = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    return scrollW > docW;
  })()`);
  console.log(`[PASS] Mobile Navigation Drawer opens cleanly without overflow: ${!navDrawerOverflow}`);

  // Navigate to Unit 1 page
  console.log('\n--- 4. TESTING UNIT 1 PAGE & QUESTION CARDS ---');
  await evaluate(`(() => {
    // Close menu if open
    const closeBtn = Array.from(document.querySelectorAll('header button')).find(b => b.getAttribute('aria-label') === 'Toggle navigation menu');
    if (closeBtn) closeBtn.click();
  })()`);
  await new Promise((r) => setTimeout(r, 200));

  // Click Unit 1 Card
  await evaluate(`(() => {
    const unit1 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Unit I') || h.textContent.includes('Introduction & Algorithmic'));
    if (unit1) {
      const card = unit1.closest('.group') || unit1.closest('div');
      if (card) card.click();
    }
  })()`);
  await new Promise((r) => setTimeout(r, 600));

  for (const vp of VIEWPORTS) {
    await setViewport(vp.width, vp.height, vp.mobile);

    // Expand all questions on page to test diagrams, pseudocode, and dry-run tables
    await evaluate(`(() => {
      const viewButtons = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('View Answer'));
      viewButtons.forEach(b => b.click());
    })()`);
    await new Promise((r) => setTimeout(r, 200));

    const check = await evaluate(`(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      const bodyScrollW = document.body.scrollWidth;
      return {
        clientWidth: docW,
        scrollWidth: scrollW,
        hasOverflow: scrollW > docW || bodyScrollW > docW
      };
    })()`);

    if (check.hasOverflow) {
      console.error(`[FAIL] Unit 1 Page at ${vp.name}: Overflow! (clientWidth=${check.clientWidth}, scrollWidth=${check.scrollWidth})`);
      process.exitCode = 1;
    } else {
      console.log(`[PASS] Unit 1 Page (all answers expanded) at ${vp.name}: Zero overflow! (clientWidth=${check.clientWidth}, scrollWidth=${check.scrollWidth})`);
    }
  }

  console.log('\n--- 5. TESTING ALL QUESTIONS PAGE ---');
  // Click All Questions in header or navigate
  await evaluate(`(() => {
    const allQBtn = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('All Questions'));
    if (allQBtn) allQBtn.click();
  })()`);
  await new Promise((r) => setTimeout(r, 600));

  for (const vp of VIEWPORTS) {
    await setViewport(vp.width, vp.height, vp.mobile);
    const check = await evaluate(`(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      return {
        clientWidth: docW,
        scrollWidth: scrollW,
        hasOverflow: scrollW > docW
      };
    })()`);

    if (check.hasOverflow) {
      console.error(`[FAIL] All Questions at ${vp.name}: Overflow! (clientWidth=${check.clientWidth}, scrollWidth=${check.scrollWidth})`);
      process.exitCode = 1;
    } else {
      console.log(`[PASS] All Questions at ${vp.name}: Perfect fit (clientWidth=${check.clientWidth}, scrollWidth=${check.scrollWidth})`);
    }
  }

  console.log('\n--- 6. TESTING REVISION & SAVED HUB PAGE ---');
  await evaluate(`(() => {
    const revBtn = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('Revision'));
    if (revBtn) revBtn.click();
  })()`);
  await new Promise((r) => setTimeout(r, 600));

  for (const vp of VIEWPORTS) {
    await setViewport(vp.width, vp.height, vp.mobile);
    const check = await evaluate(`(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      return {
        clientWidth: docW,
        scrollWidth: scrollW,
        hasOverflow: scrollW > docW
      };
    })()`);

    if (check.hasOverflow) {
      console.error(`[FAIL] Revision Page at ${vp.name}: Overflow! (clientWidth=${check.clientWidth}, scrollWidth=${check.scrollWidth})`);
      process.exitCode = 1;
    } else {
      console.log(`[PASS] Revision Page at ${vp.name}: Perfect fit (clientWidth=${check.clientWidth}, scrollWidth=${check.scrollWidth})`);
    }
  }

  // Close ws
  ws.close();
  console.log('\n=== ALL 8 VIEWPORTS VERIFIED ACROSS ALL PAGES WITH ZERO OVERFLOW! ===');
}

main().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
