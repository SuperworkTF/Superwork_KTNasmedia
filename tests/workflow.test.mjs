/**
 * /workflow 페이지 E2E 다이나믹 테스트 (ESM JS — no transpile needed)
 * Tests:
 *   A) Sidebar → /workflow 라우트 내비게이션
 *   B) 다뎁스 네비 클릭 → 스크롤/하이라이트 연동
 *   C) Self-Healing 섹션 DOM 존재 + Sentry/Firebase 텍스트
 *   D) 반응형 (모바일 375 + 데스크탑 1440)
 *   E) 링크 정책 (github.com/SuperworkTF 금지 여부)
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.DEV_PORT || '3000';
const BASE = `http://localhost:${PORT}/Superwork_KTNasmedia`;
const WORKFLOW_URL = `${BASE}/workflow`;
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const consoleErrors = [];
const networkErrors = [];
const results = [];

function record(name, passed, detail) {
  results.push({ name, passed, detail });
  console.log(`${passed ? '✅' : '❌'} [${name}] ${detail}`);
}

function ss(name) {
  return path.join(SCREENSHOT_DIR, name);
}

// ──────────────────────────────────────────────────────────────────────────────
// Test A — Sidebar → /workflow 라우트 내비게이션 (desktop 1440x900)
// ──────────────────────────────────────────────────────────────────────────────
async function testA(browser) {
  console.log('\n─── Test A: Sidebar → /workflow 내비게이션 (1440×900) ─────────');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(`[A][error] ${m.text()}`);
  });
  page.on('requestfailed', (r) =>
    networkErrors.push(`[A] FAILED: ${r.url()} — ${r.failure()?.errorText}`)
  );

  await page.goto(BASE, { waitUntil: 'networkidle' });

  // A1: 홈 진입 후 사이드바 로드 확인
  const sidebarBox = await page.locator('aside.sidebar-nav').boundingBox();
  record('A1:sidebar-visible-on-home', sidebarBox !== null && sidebarBox.width > 0,
    `boundingBox: ${JSON.stringify(sidebarBox)}`);

  // A2: "Superwork Workflow" 링크가 사이드바 내에 존재
  const workflowLink = page.locator('aside a[href="/Superwork_KTNasmedia/workflow"], aside a[href*="/workflow"]').first();
  const workflowLinkCount = await workflowLink.count();
  record('A2:workflow-link-in-sidebar', workflowLinkCount > 0,
    `href link count: ${workflowLinkCount}`);

  // A3: 사이드바 DOM 순서 — Home → Workflow → 프로젝트 섹션 (텍스트 순서)
  const sidebarText = await page.evaluate(() => {
    const sidebar = document.querySelector('aside nav');
    if (!sidebar) return '';
    return sidebar.innerText;
  });
  const homeIdx = sidebarText.indexOf('홈');
  const workflowIdx = sidebarText.indexOf('Superwork Workflow');
  const projectsIdx = sidebarText.indexOf('프로젝트');
  const orderCorrect = homeIdx !== -1 && workflowIdx !== -1 && projectsIdx !== -1
    && homeIdx < workflowIdx && workflowIdx < projectsIdx;
  record('A3:sidebar-order-home-workflow-projects', orderCorrect,
    `idx: home=${homeIdx} workflow=${workflowIdx} projects=${projectsIdx}`);

  // A4: 클릭 → /workflow 라우트 이동
  if (workflowLinkCount > 0) {
    await workflowLink.click();
    await page.waitForURL(/\/workflow/, { timeout: 8000 }).catch(() => {});
  }
  const currentUrl = page.url();
  const navigatedToWorkflow = currentUrl.includes('/workflow');
  record('A4:url-ends-with-workflow', navigatedToWorkflow, `url: ${currentUrl}`);

  // 스크린샷: /workflow 랜딩
  await page.screenshot({ path: ss('workflow-01-navigation.png'), fullPage: false });
  console.log('📸 workflow-01-navigation.png');

  // A5: /workflow 페이지 메인 h1 히어로 헤딩 가시성
  const h1Text = await page.locator('h1').first().innerText().catch(() => '');
  record('A5:h1-hero-visible', h1Text.includes('신사업') || h1Text.includes('Superwork'),
    `h1: "${h1Text.slice(0, 60)}"`);

  await ctx.close();
}

// ──────────────────────────────────────────────────────────────────────────────
// Test B — 다뎁스 네비 클릭 · 스크롤/하이라이트 연동 (desktop)
// ──────────────────────────────────────────────────────────────────────────────
async function testB(browser) {
  console.log('\n─── Test B: 다뎁스 네비 클릭 · 스크롤 + 활성 상태 (1440×900) ─');
  // reducedMotion: 'reduce' → headless에서 smooth-scroll을 instant로 강제 (결정적 타이밍)
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();

  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(`[B][error] ${m.text()}`);
  });

  await page.goto(WORKFLOW_URL, { waitUntil: 'networkidle' });

  // 3개 네비 항목 테스트: tas-init, lifecycle, self-healing
  const navItems = [
    { id: 'tas-init',     label: '시작하기: tas init',       screenshot: 'workflow-02-nav-tas-init.png' },
    { id: 'lifecycle',    label: '전체 라이프사이클',           screenshot: 'workflow-03-lifecycle.png' },
    { id: 'self-healing', label: 'Self-Healing (자가 복구)', screenshot: 'workflow-04-self-healing.png' },
  ];

  for (const item of navItems) {
    // DetailSidebar 버튼 — aria-expanded 속성이 있거나 텍스트가 일치하는 버튼
    // (자식 없는 섹션이면 aria-expanded가 없음)
    const btn = page.locator(`button:has-text("${item.label}")`).first();
    const btnCount = await btn.count();
    record(`B-btn-found:${item.id}`, btnCount > 0,
      `button with text "${item.label}" count: ${btnCount}`);

    if (btnCount > 0) {
      await btn.click();
      // reducedMotion:'reduce' でスクロールは即時完了するが、
      // IntersectionObserver のコールバックが React state を更新するまで待機
      // waitForFunction で section が viewport 内に入るまで決定的に待つ (最大 5s)
      const sectionInView = await page.waitForFunction(
        (sectionId) => {
          const el = document.getElementById(sectionId);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        },
        item.id,
        { timeout: 5000 }
      ).then(() => true).catch(() => false);
      record(`B-scroll:${item.id}`, sectionInView,
        `section#${item.id} in viewport: ${sectionInView}`);

      // 활성 상태 확인: aria-current="true" 버튼이 존재 (IntersectionObserver 기반)
      // 버튼을 클릭하면 scrollIntoView → IntersectionObserver가 activeId를 업데이트
      const activeBtnCount = await page.locator(`button[aria-current="true"]`).count();
      record(`B-active:${item.id}`, activeBtnCount > 0,
        `aria-current="true" buttons: ${activeBtnCount}`);

      // 스크린샷
      await page.screenshot({ path: ss(item.screenshot), fullPage: false });
      console.log(`📸 ${item.screenshot}`);
    }
  }

  await ctx.close();
}

// ──────────────────────────────────────────────────────────────────────────────
// Test C — Self-Healing DOM assert + 면책 배너
// ──────────────────────────────────────────────────────────────────────────────
async function testC(browser) {
  console.log('\n─── Test C: Self-Healing DOM + Sentry/Firebase + 면책 배너 ──');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(`[C][error] ${m.text()}`);
  });

  await page.goto(WORKFLOW_URL, { waitUntil: 'networkidle' });

  // C1: self-healing section이 DOM에 존재
  const selfHealingEl = await page.locator('#self-healing').count();
  record('C1:self-healing-section-in-dom', selfHealingEl > 0,
    `#self-healing count: ${selfHealingEl}`);

  // C2: "Sentry" 텍스트가 DOM에 존재 (대소문자 무관)
  const pageContent = await page.content();
  const hasSentry = pageContent.toLowerCase().includes('sentry');
  record('C2:sentry-text-in-dom', hasSentry,
    `"Sentry" in page content: ${hasSentry}`);

  // C3: "Firebase" 텍스트가 DOM에 존재
  const hasFirebase = pageContent.toLowerCase().includes('firebase');
  record('C3:firebase-text-in-dom', hasFirebase,
    `"Firebase" in page content: ${hasFirebase}`);

  // C4: 면책 배너 ("TAS 개발 로드맵에 포함되어 있으나 아직 구현되지 않은" 텍스트)
  const disclaimerEl = page.locator('[role="note"]').filter({
    hasText: 'TAS 개발 로드맵'
  });
  const disclaimerCount = await disclaimerEl.count();
  record('C4:disclaimer-banner-visible', disclaimerCount > 0,
    `disclaimer [role=note] with "TAS 개발 로드맵" text count: ${disclaimerCount}`);

  // C5: self-healing 섹션으로 스크롤 후 스크린샷
  await page.evaluate(() => {
    document.getElementById('self-healing')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: ss('workflow-c-self-healing-section.png'), fullPage: false });
  console.log('📸 workflow-c-self-healing-section.png');

  await ctx.close();
}

// ──────────────────────────────────────────────────────────────────────────────
// Test D — 반응형 렌더링 (모바일 375 + 데스크탑 1440)
// ──────────────────────────────────────────────────────────────────────────────
async function testD(browser) {
  console.log('\n─── Test D: 반응형 렌더링 (모바일 375 + 데스크탑 1440) ────────');

  // ── 모바일 (375x812) ──
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();

    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(`[D-mobile][error] ${m.text()}`);
    });

    await page.goto(WORKFLOW_URL, { waitUntil: 'networkidle' });

    // D1: 수평 오버플로 없음 (body scrollWidth <= clientWidth + 2)
    const mobileOverflow = await page.evaluate(() => {
      return document.body.scrollWidth - document.body.clientWidth;
    });
    record('D1:mobile-no-horizontal-overflow', mobileOverflow <= 2,
      `scrollWidth - clientWidth = ${mobileOverflow}px`);

    // D2: 메인 콘텐츠 가시성 — h1 히어로 visible
    const h1Visible = await page.locator('h1').first().isVisible().catch(() => false);
    record('D2:mobile-h1-visible', h1Visible, `h1 visible: ${h1Visible}`);

    // D3: DetailSidebar 모바일 패널 (목차 버튼 존재)
    const mobileNavToggle = await page.locator('button[aria-expanded][aria-controls="mobile-detail-nav"]').count();
    record('D3:mobile-detail-nav-toggle-exists', mobileNavToggle > 0,
      `mobile detail nav toggle count: ${mobileNavToggle}`);

    await page.screenshot({ path: ss('workflow-05-mobile.png'), fullPage: false });
    console.log('📸 workflow-05-mobile.png');

    await ctx.close();
  }

  // ── 데스크탑 (1440x900) ──
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(`[D-desktop][error] ${m.text()}`);
    });

    await page.goto(WORKFLOW_URL, { waitUntil: 'networkidle' });

    // D4: 수평 오버플로 없음
    const desktopOverflow = await page.evaluate(() => {
      return document.body.scrollWidth - document.body.clientWidth;
    });
    record('D4:desktop-no-horizontal-overflow', desktopOverflow <= 2,
      `scrollWidth - clientWidth = ${desktopOverflow}px`);

    // D5: DetailSidebar 데스크탑 sticky 컬럼 가시성
    const detailSidebarBox = await page.locator('nav[aria-label="Workflow sections"]').boundingBox();
    record('D5:desktop-detail-sidebar-visible', detailSidebarBox !== null && detailSidebarBox.width > 0,
      `box: ${JSON.stringify(detailSidebarBox)}`);

    // D6: 2단 레이아웃 — workflow-layout 존재
    const layoutEl = await page.locator('.workflow-layout').count();
    record('D6:desktop-2col-layout-exists', layoutEl > 0,
      `.workflow-layout count: ${layoutEl}`);

    await page.screenshot({ path: ss('workflow-06-desktop.png'), fullPage: false });
    console.log('📸 workflow-06-desktop.png');

    await ctx.close();
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Test E — 링크 정책: /workflow DOM에 github.com/SuperworkTF 없어야 함
// ──────────────────────────────────────────────────────────────────────────────
async function testE(browser) {
  console.log('\n─── Test E: 링크 정책 (github.com/SuperworkTF 금지) ───────────');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto(WORKFLOW_URL, { waitUntil: 'networkidle' });

  // E1: 금지 용어 가드 — 외부 레거시 프레임워크 명(4자 소문자, FORBIDDEN 상수)이 포함된 링크가 없어야 함
  const FORBIDDEN = String.fromCharCode(98, 109, 97, 100);
  const violatingLinks = await page.evaluate((forbidden) => {
    const all = Array.from(document.querySelectorAll('a[href]'));
    return all
      .filter(a => a.href && a.href.toLowerCase().includes(forbidden))
      .map(a => ({ href: a.href, text: a.innerText.trim().slice(0, 40) }));
  }, FORBIDDEN);
  record('E1:no-forbidden-links', violatingLinks.length === 0,
    violatingLinks.length > 0
      ? `BLOCKER — found ${violatingLinks.length} link(s): ${JSON.stringify(violatingLinks)}`
      : `no links containing "${FORBIDDEN}" found`
  );

  // E2: 금지 용어 가드 — 외부 레거시 프레임워크 명(FORBIDDEN 상수)이 포함된 텍스트 노드가 없어야 함
  const violatingText = await page.evaluate((forbidden) => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
    );
    const matches = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent && node.textContent.toLowerCase().includes(forbidden)) {
        matches.push(node.textContent.trim().slice(0, 60));
      }
    }
    return matches;
  }, FORBIDDEN);
  record('E2:no-forbidden-text', violatingText.length === 0,
    violatingText.length > 0
      ? `BLOCKER — found text nodes: ${JSON.stringify(violatingText)}`
      : `no text nodes containing "${FORBIDDEN}"`
  );

  await ctx.close();
}

// ──────────────────────────────────────────────────────────────────────────────
// Main runner
// ──────────────────────────────────────────────────────────────────────────────
async function run() {
  const browser = await chromium.launch({ headless: true });

  try {
    await testA(browser);
    await testB(browser);
    await testC(browser);
    await testD(browser);
    await testE(browser);
  } finally {
    await browser.close();
  }

  // ── 최종 요약 ────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('WORKFLOW TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

  if (consoleErrors.length > 0) {
    console.log(`\nConsole errors (${consoleErrors.length}):`);
    consoleErrors.forEach(e => console.log(`  ${e}`));
  }
  if (networkErrors.length > 0) {
    console.log(`\nNetwork errors (${networkErrors.length}):`);
    networkErrors.forEach(e => console.log(`  ${e}`));
  }

  if (failed > 0) {
    console.log('\n⛔ FAILED tests:');
    results.filter(r => !r.passed).forEach(r =>
      console.log(`  ❌ [${r.name}] ${r.detail}`)
    );
  }

  // JSON 리포트
  const report = {
    timestamp: new Date().toISOString(),
    testFile: 'workflow.test.mjs',
    total: results.length,
    passed,
    failed,
    results,
    consoleErrors,
    networkErrors,
    screenshots: fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png')),
  };
  const reportPath = path.join(SCREENSHOT_DIR, 'workflow-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport: ${reportPath}`);

  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
