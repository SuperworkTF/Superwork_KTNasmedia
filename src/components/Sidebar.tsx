'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, X, Layers } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useWorkflowScrollspy } from '@/hooks/useWorkflowScrollspy';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { workflowSections } from '@/data/workflow';

// ── 메인 Sidebar 컴포넌트 ───────────────────────────────────────────
export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeId = useWorkflowScrollspy();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const pathname = usePathname();

  // 모바일 드로어 오픈 시 X 버튼으로 포커스 이동
  useEffect(() => {
    if (isSidebarOpen && !isDesktop) {
      closeButtonRef.current?.focus();
    }
  }, [isSidebarOpen, isDesktop]);

  const isWorkflow = pathname.startsWith('/workflow');

  const sidebarContent = (
    <motion.aside
      className="sidebar-nav"
      id="sidebar-drawer"
      aria-label="사이드바"
      animate={
        isDesktop
          ? { x: 0, opacity: 1, visibility: 'visible' as const }
          : isSidebarOpen
          ? { x: 0, visibility: 'visible' as const }
          : { x: -260, transitionEnd: { visibility: 'hidden' as const } }
      }
      initial={
        isDesktop
          ? { x: 0, opacity: 0, visibility: 'visible' as const }
          : { x: -260, visibility: 'hidden' as const }
      }
      transition={
        isDesktop
          ? { duration: 0.4, ease: 'easeOut' }
          : isSidebarOpen
          ? { type: 'spring', stiffness: 380, damping: 35 }
          : { duration: 0.22, ease: [0.4, 0, 0.6, 1] }
      }
    >
      {/* ── 1. 브랜드 헤더 ─────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 12px',
          borderBottom: '1px solid var(--sidebar-border)',
          flexShrink: 0,
        }}
      >
        <Link
          href="/#home"
          onClick={closeSidebar}
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-snow)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          SUPERWORK
        </Link>

        {/* 모바일 전용 닫기 버튼 (lg+: CSS로 숨김) */}
        <button
          ref={closeButtonRef}
          id="sidebar-close-btn"
          onClick={closeSidebar}
          aria-label="메뉴 닫기"
          className="sidebar-hamburger"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            transition: 'color 0.1s, background-color 0.1s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = 'var(--color-snow)';
            el.style.backgroundColor = 'var(--sidebar-item-hover-bg)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = 'var(--color-muted)';
            el.style.backgroundColor = 'transparent';
          }}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {/* ── 2. 내비게이션 ─────────────────────────────── */}
      <nav
        aria-label="사이드바 내비게이션"
        style={{ flex: 1, padding: '8px', overflowY: 'auto' }}
      >
        {/* Superwork Workflow */}
        <Link
          href="/workflow"
          className="sidebar-item"
          aria-current={isWorkflow ? 'page' : undefined}
          onClick={closeSidebar}
        >
          <Layers size={16} aria-hidden="true" />
          Superwork Workflow
        </Link>

        {/* /workflow 경로에서만 3-depth 서브트리 노출 */}
        {isWorkflow && (
          <div className="sidebar-subtree">
            {workflowSections.map((section) => (
              <div key={section.id}>
                <Link
                  href={`/workflow#${section.id}`}
                  className="sidebar-subitem"
                  aria-current={activeId === section.id ? 'location' : undefined}
                  onClick={closeSidebar}
                >
                  {section.title}
                </Link>
                {section.children?.map((child) => (
                  <Link
                    key={child.id}
                    href={`/workflow#${child.id}`}
                    className="sidebar-subsubitem"
                    aria-current={activeId === child.id ? 'location' : undefined}
                    onClick={closeSidebar}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Superwork Team */}
        <Link
          href="/team"
          className="sidebar-item"
          aria-current={pathname.startsWith('/team') ? 'page' : undefined}
          onClick={closeSidebar}
        >
          <Users size={16} aria-hidden="true" />
          Superwork Team
        </Link>
      </nav>
    </motion.aside>
  );

  return (
    <FocusTrap
      active={isSidebarOpen && !isDesktop}
      focusTrapOptions={{
        initialFocus: '#sidebar-close-btn',
        returnFocusOnDeactivate: true,
        escapeDeactivates: false,
        allowOutsideClick: true,
        checkCanFocusTrap: (containers: Array<HTMLElement | SVGElement>) =>
          new Promise<void>((resolve) => {
            const id = setInterval(() => {
              const ready = containers.every((el: HTMLElement | SVGElement) => {
                const s = window.getComputedStyle(el);
                return s.visibility !== 'hidden' && s.display !== 'none';
              });
              if (ready) { clearInterval(id); resolve(); }
            }, 10);
          }),
      }}
    >
      {sidebarContent}
    </FocusTrap>
  );
}
