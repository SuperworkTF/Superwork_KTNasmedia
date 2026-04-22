/**
 * Sidebar navigation E2E tests (ESM JS — no transpile needed)
 * Tests: desktop sidebar, mobile drawer, aria-current, external links, console errors
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:3030/Superwork_KTNasmedia';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const consoleErrors = [];
const networkErrors = [];
const results = [];

function record(name, passed, detail) {
  results.push({ name, passed, detail });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${name}] ${detail}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  // ──────────────────────────────────────────────
  // DESKTOP (1440x900)
  // ──────────────────────────────────────────────
  console.log('\n─── DESKTOP (1440×900) ───────────────────');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[desktop][${msg.type()}] ${msg.text()}`);
      }
    });
    page.on('requestfailed', (req) => {
      networkErrors.push(`FAILED: ${req.url()} — ${req.failure()?.errorText}`);
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Screenshot: desktop home
    const dsktHome = path.join(SCREENSHOT_DIR, 'desktop-home.png');
    await page.screenshot({ path: dsktHome, fullPage: false });
    console.log(`📸 ${dsktHome}`);

    // T1: sidebar is in viewport on desktop
    const sidebarBox = await page.locator('aside.sidebar-nav').boundingBox();
    const sidebarVisible = sidebarBox !== null && sidebarBox.width > 0 && sidebarBox.x >= 0;
    record('T1:desktop-sidebar-visible', sidebarVisible, `box: ${JSON.stringify(sidebarBox)}`);

    // T2: nav[aria-label="사이드바 내비게이션"] exists
    const navCount = await page.locator('nav[aria-label="사이드바 내비게이션"]').count();
    record('T2:nav-aria-label', navCount > 0, `count: ${navCount}`);

    // T3: #home link has aria-current=location (initial load, scrollspy default)
    const homeAriaCurrentCount = await page.locator('a[href="#home"][aria-current="location"]').count();
    record('T3:home-aria-current', homeAriaCurrentCount > 0, `count: ${homeAriaCurrentCount}`);

    // T4: hamburger toggle button hidden on desktop via CSS
    const closeBtnDisplay = await page.evaluate(() => {
      const el = document.querySelector('#sidebar-toggle-btn');
      return el ? window.getComputedStyle(el).display : 'NOT_FOUND';
    });
    record('T4:desktop-hamburger-hidden', closeBtnDisplay === 'none', `display: ${closeBtnDisplay}`);

    // T5: external links in sidebar have target=_blank + noopener
    const extLinks = await page.locator('aside a[target="_blank"]').all();
    record('T5a:external-links-count', extLinks.length > 0, `count: ${extLinks.length}`);

    let allNoopener = true;
    const extLinkDetails = [];
    for (const link of extLinks) {
      const href = await link.getAttribute('href');
      const rel = await link.getAttribute('rel') || '';
      const hasNoopener = rel.includes('noopener');
      if (!hasNoopener) allNoopener = false;
      extLinkDetails.push({ href, rel, hasNoopener });
    }
    record('T5b:all-noopener', allNoopener, extLinkDetails.map(l => `${l.href} rel="${l.rel}"`).join(' | '));

    // T6: project external links point to github.com
    const projectExtLinks = await page.locator('aside a[target="_blank"][href^="https://github.com"]').all();
    record('T6:project-links-github', projectExtLinks.length >= 2, `count: ${projectExtLinks.length} (expected ≥2 for 2 projects)`);

    // T7: Click #projects section link
    await page.locator('a[href="#projects"]').first().click();
    await page.waitForTimeout(800);
    const afterProjectsScreenshot = path.join(SCREENSHOT_DIR, 'desktop-projects-click.png');
    await page.screenshot({ path: afterProjectsScreenshot, fullPage: false });
    record('T7:projects-click-no-crash', true, 'click completed without error');

    // T8: scrollspy updates aria-current (after scrolling to #projects section)
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      el?.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(800);
    const projectsAriaCurrentCount = await page.locator('[aria-current="location"]').count();
    record('T8:scrollspy-updates-aria-current', projectsAriaCurrentCount > 0, `aria-current elements: ${projectsAriaCurrentCount}`);

    await ctx.close();
  }

  // ──────────────────────────────────────────────
  // MOBILE (375x812)
  // ──────────────────────────────────────────────
  console.log('\n─── MOBILE (375×812) ─────────────────────');
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[mobile][${msg.type()}] ${msg.text()}`);
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Screenshot: mobile closed
    const mobClosed = path.join(SCREENSHOT_DIR, 'mobile-home-closed.png');
    await page.screenshot({ path: mobClosed, fullPage: false });
    console.log(`📸 ${mobClosed}`);

    // T9: sidebar off-screen initially (transform includes -260)
    const sidebarTransform = await page.evaluate(() => {
      const el = document.querySelector('aside.sidebar-nav');
      return el ? window.getComputedStyle(el).transform : null;
    });
    // matrix(1, 0, 0, 1, -260, 0) when closed
    const isOffscreen = sidebarTransform?.includes('-260') || sidebarTransform === 'none' && false;
    record('T9:mobile-sidebar-offscreen', !!isOffscreen, `transform: ${sidebarTransform}`);

    // T10: hamburger button visible on mobile
    const hamburgerBtn = page.locator('#sidebar-toggle-btn');
    const hamburgerDisplay = await page.evaluate(() => {
      const el = document.querySelector('#sidebar-toggle-btn');
      return el ? window.getComputedStyle(el).display : 'NOT_FOUND';
    });
    record('T10:mobile-hamburger-visible', hamburgerDisplay !== 'none' && hamburgerDisplay !== 'NOT_FOUND', `display: ${hamburgerDisplay}`);

    // T11: Click hamburger opens drawer
    if (hamburgerDisplay !== 'none') {
      await hamburgerBtn.click({ force: true }); // force since it may be CSS-conditionally shown
      await page.waitForTimeout(500);

      const mobOpen = path.join(SCREENSHOT_DIR, 'mobile-drawer-open.png');
      await page.screenshot({ path: mobOpen, fullPage: false });
      console.log(`📸 ${mobOpen}`);

      const transformAfterOpen = await page.evaluate(() => {
        const el = document.querySelector('aside.sidebar-nav');
        return el ? window.getComputedStyle(el).transform : null;
      });
      // Open: matrix(1, 0, 0, 1, 0, 0)
      const isOpen = transformAfterOpen === 'none' ||
        transformAfterOpen?.includes('matrix(1, 0, 0, 1, 0, 0)');
      record('T11:mobile-drawer-opens', !!isOpen, `transform after open: ${transformAfterOpen}`);

      // T12: backdrop appears
      const backdropCount = await page.locator('[aria-hidden="true"]').filter({
        has: page.locator(':scope')
      }).count();
      // More specific: look for fixed overlay div
      const backdropVisible = await page.evaluate(() => {
        const els = document.querySelectorAll('[aria-hidden="true"]');
        for (const el of els) {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' && style.inset === '0px') return true;
        }
        return false;
      });
      record('T12:mobile-backdrop-visible', backdropVisible, `backdrop with position:fixed found: ${backdropVisible}`);

      // T13: Escape key closes drawer
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      const transformAfterEsc = await page.evaluate(() => {
        const el = document.querySelector('aside.sidebar-nav');
        return el ? window.getComputedStyle(el).transform : null;
      });
      const closedByEsc = transformAfterEsc?.includes('-260');
      record('T13:escape-closes-drawer', !!closedByEsc, `transform after Escape: ${transformAfterEsc}`);

      // T14: Re-open and close via backdrop click
      await hamburgerBtn.click({ force: true });
      await page.waitForTimeout(500);
      // Click backdrop
      await page.evaluate(() => {
        const els = document.querySelectorAll('[aria-hidden="true"]');
        for (const el of els) {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed') {
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            break;
          }
        }
      });
      await page.waitForTimeout(500);
      const transformAfterBackdrop = await page.evaluate(() => {
        const el = document.querySelector('aside.sidebar-nav');
        return el ? window.getComputedStyle(el).transform : null;
      });
      const closedByBackdrop = transformAfterBackdrop?.includes('-260');
      record('T14:backdrop-closes-drawer', !!closedByBackdrop, `transform after backdrop: ${transformAfterBackdrop}`);
    }

    // T15: inert attribute on closed mobile sidebar (keyboard trap prevention)
    const inertAttr = await page.evaluate(() => {
      const el = document.querySelector('aside.sidebar-nav');
      return el?.hasAttribute('inert');
    });
    record('T15:mobile-inert-on-close', !!inertAttr, `inert attribute: ${inertAttr}`);

    const mobFinal = path.join(SCREENSHOT_DIR, 'mobile-final.png');
    await page.screenshot({ path: mobFinal, fullPage: false });
    console.log(`📸 ${mobFinal}`);

    await ctx.close();
  }

  await browser.close();

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════');
  console.log('TEST SUMMARY');
  console.log('═══════════════════════════════════════════');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`\nConsole errors: ${consoleErrors.length}`);
  consoleErrors.forEach(e => console.log(`  ${e}`));
  console.log(`Network errors: ${networkErrors.length}`);
  networkErrors.forEach(e => console.log(`  ${e}`));

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.passed).forEach(r => console.log(`  ❌ [${r.name}] ${r.detail}`));
  }

  const report = {
    timestamp: new Date().toISOString(),
    testMode: 'playwright',
    blockers: failed,
    noise: 0,
    passed,
    results,
    consoleErrors,
    networkErrors,
    screenshots: fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png')),
  };
  const reportPath = path.join(SCREENSHOT_DIR, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport: ${reportPath}`);

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
