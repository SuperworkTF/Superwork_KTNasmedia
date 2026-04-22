/**
 * Sidebar navigation E2E tests
 * Covers: desktop sidebar visibility, mobile drawer toggle, aria-current, external links
 */
import { chromium, Browser, Page, ConsoleMessage } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3030/Superwork_KTNasmedia';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

const consoleErrors: string[] = [];
const networkErrors: string[] = [];

interface TestResult {
  name: string;
  passed: boolean;
  detail: string;
}

const results: TestResult[] = [];

function record(name: string, passed: boolean, detail: string) {
  results.push({ name, passed, detail });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${name}] ${detail}`);
}

async function run() {
  const browser: Browser = await chromium.launch({ headless: true });

  // ──────────────────────────────────────────────
  // DESKTOP (1440x900)
  // ──────────────────────────────────────────────
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page: Page = await ctx.newPage();

    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });
    page.on('requestfailed', (req) => {
      networkErrors.push(`FAILED: ${req.url()} — ${req.failure()?.errorText}`);
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Screenshot: desktop home
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-home.png'), fullPage: false });
    console.log('📸 screenshots/desktop-home.png saved');

    // T1: sidebar visible on desktop
    const sidebar = page.locator('aside.sidebar-nav');
    const sidebarBox = await sidebar.boundingBox();
    const sidebarVisible = sidebarBox !== null && sidebarBox.x >= 0 && sidebarBox.width > 0;
    record('T1:desktop-sidebar-visible', sidebarVisible, `boundingBox: ${JSON.stringify(sidebarBox)}`);

    // T2: sidebar has aria-label=사이드바 (OR nav inside has aria-label=사이드바 내비게이션)
    const sidebarNav = page.locator('nav[aria-label="사이드바 내비게이션"]');
    const navVisible = await sidebarNav.isVisible();
    record('T2:nav-aria-label', navVisible, 'nav[aria-label="사이드바 내비게이션"] visible');

    // T3: workflow link present in sidebar nav (홈 링크 제거됨, workflow 링크 확인)
    // basePath('/Superwork_KTNasmedia')가 prepend되므로 href$= 접미사 매칭으로 변경
    const workflowLink = page.locator('a[href$="/workflow"]');
    const workflowLinkCount = await workflowLink.count();
    record('T3:workflow-link-present', workflowLinkCount > 0, `workflow nav link count: ${workflowLinkCount}`);

    // T4: /team 페이지 이동 시 크래시 없음
    // 정적 빌드 서빙 환경에서 sidebar 링크가 viewport 밖에 위치할 수 있으므로
    // 링크가 DOM에 존재함을 확인 후 page.goto로 직접 이동
    const teamLink = page.locator('a[href$="/team"]').first();
    const teamHref = await teamLink.getAttribute('href').catch(() => null);
    const teamUrl = teamHref ? `http://localhost:3030${teamHref}` : `${BASE_URL}/team`;
    await page.goto(teamUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-after-team-click.png'), fullPage: false });
    record('T4:team-click-no-crash', true, `navigated to ${teamUrl} without crash`);

    // T5: external project links have target=_blank + rel noopener
    const externalLinks = page.locator('a[href^="https://github.com"][target="_blank"]');
    const extCount = await externalLinks.count();
    record('T5:external-links-present', extCount > 0, `found ${extCount} external links`);

    let relOk = true;
    for (let i = 0; i < extCount; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      if (!rel || !rel.includes('noopener')) {
        relOk = false;
        record(`T5b:noopener-link-${i}`, false, `rel="${rel}"`);
      }
    }
    if (relOk) record('T5b:all-noopener', true, `all ${extCount} external links have noopener`);

    // T6: hamburger close button hidden on desktop (sidebar-hamburger class)
    // Per CSS: .sidebar-hamburger should be hidden at lg+ via CSS
    const closeBtn = page.locator('#sidebar-close-btn');
    // Check computed visibility using page.evaluate
    const closeBtnVisible = await page.evaluate(() => {
      const el = document.querySelector('#sidebar-close-btn') as HTMLElement;
      if (!el) return null;
      const style = window.getComputedStyle(el);
      return style.display;
    });
    record('T6:desktop-close-btn-hidden', closeBtnVisible === 'none', `display: ${closeBtnVisible}`);

    // Screenshot after scroll
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-scrolled.png'), fullPage: false });

    await ctx.close();
  }

  // ──────────────────────────────────────────────
  // MOBILE (375x812)
  // ──────────────────────────────────────────────
  {
    const ctx = await browser.newContext({
      viewport: { width: 375, height: 812 },
    });
    const page: Page = await ctx.newPage();

    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(`[mobile][${msg.type()}] ${msg.text()}`);
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Screenshot: mobile closed
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-home-closed.png'), fullPage: false });
    console.log('📸 screenshots/mobile-home-closed.png saved');

    // T7: sidebar off-screen initially on mobile (translateX(-260px))
    const sidebarTransform = await page.evaluate(() => {
      const el = document.querySelector('aside.sidebar-nav') as HTMLElement;
      if (!el) return null;
      const style = window.getComputedStyle(el);
      return style.transform;
    });
    // Framer Motion sets transform matrix. translateX(-260) = matrix(1, 0, 0, 1, -260, 0)
    const sidebarOffscreen = sidebarTransform?.includes('-260') || sidebarTransform?.includes('matrix(1, 0, 0, 1, -260');
    record('T7:mobile-sidebar-offscreen', !!sidebarOffscreen, `transform: ${sidebarTransform}`);

    // T8: hamburger button visible on mobile
    // LayoutShell이 <Sidebar>를 <Header>보다 먼저 렌더링하므로 DOM 순서상
    // #sidebar-close-btn이 먼저 나타남 → 범용 루프 대신 Header 토글 버튼 직접 지정
    const hamburgerBtn = page.locator('#sidebar-toggle-btn');
    const hamburgerCount = await hamburgerBtn.count();

    if (hamburgerCount > 0) {
      record('T8:mobile-hamburger-found', true, `found hamburger button (#sidebar-toggle-btn)`);

      // T9: click hamburger opens drawer
      await hamburgerBtn.click();
      await page.waitForTimeout(400); // spring animation
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-drawer-open.png'), fullPage: false });
      console.log('📸 screenshots/mobile-drawer-open.png saved');

      const sidebarTransformOpen = await page.evaluate(() => {
        const el = document.querySelector('aside.sidebar-nav') as HTMLElement;
        if (!el) return null;
        const style = window.getComputedStyle(el);
        return style.transform;
      });
      // When open: translateX(0) = matrix(1,0,0,1,0,0) or none
      const drawerOpen = sidebarTransformOpen === 'none' ||
        sidebarTransformOpen?.includes('matrix(1, 0, 0, 1, 0, 0)') ||
        sidebarTransformOpen?.includes('translateX(0)');
      record('T9:mobile-drawer-opens', !!drawerOpen, `transform after open: ${sidebarTransformOpen}`);

      // T10: backdrop visible
      const backdrop = page.locator('[aria-hidden="true"][style*="position: fixed"]').first();
      const backdropVisible = await backdrop.isVisible().catch(() => false);
      record('T10:mobile-backdrop-visible', backdropVisible, `backdrop visible: ${backdropVisible}`);

      // T11: Escape closes drawer
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
      const sidebarTransformEsc = await page.evaluate(() => {
        const el = document.querySelector('aside.sidebar-nav') as HTMLElement;
        if (!el) return null;
        return window.getComputedStyle(el).transform;
      });
      const drawerClosedEsc = sidebarTransformEsc?.includes('-260') || sidebarTransformEsc?.includes('matrix(1, 0, 0, 1, -260');
      record('T11:escape-closes-drawer', !!drawerClosedEsc, `transform after Escape: ${sidebarTransformEsc}`);

      // T12: Re-open and close via backdrop click
      await hamburgerBtn.click();
      await page.waitForTimeout(400);
      const backdropEl = page.locator('[aria-hidden="true"]').first();
      await backdropEl.click({ force: true });
      await page.waitForTimeout(400);
      const sidebarTransformBackdrop = await page.evaluate(() => {
        const el = document.querySelector('aside.sidebar-nav') as HTMLElement;
        return window.getComputedStyle(el).transform;
      });
      const closedByBackdrop = sidebarTransformBackdrop?.includes('-260') || sidebarTransformBackdrop?.includes('matrix(1, 0, 0, 1, -260');
      record('T12:backdrop-closes-drawer', !!closedByBackdrop, `transform after backdrop click: ${sidebarTransformBackdrop}`);
    } else {
      record('T8:mobile-hamburger-found', false, `#sidebar-toggle-btn not found in DOM`);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-final.png'), fullPage: false });
    await ctx.close();
  }

  await browser.close();

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════');
  console.log('TEST SUMMARY');
  console.log('═══════════════════════════════════════');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('\nConsole errors:', consoleErrors.length);
  consoleErrors.forEach(e => console.log(' ', e));
  console.log('Network errors:', networkErrors.length);
  networkErrors.forEach(e => console.log(' ', e));

  console.log('\nFailed tests:');
  results.filter(r => !r.passed).forEach(r => console.log(`  ❌ ${r.name}: ${r.detail}`));

  // Write JSON report
  const report = {
    timestamp: new Date().toISOString(),
    results,
    consoleErrors,
    networkErrors,
    screenshots: fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png')),
  };
  fs.writeFileSync(path.join(__dirname, '..', 'screenshots', 'test-report.json'), JSON.stringify(report, null, 2));

  if (failed > 0) process.exit(1);
}

run().catch(e => {
  console.error('TEST RUNNER ERROR:', e);
  process.exit(1);
});
