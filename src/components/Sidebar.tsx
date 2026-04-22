'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Layers, ChevronDown } from 'lucide-react';
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

  const chevronRef = useRef<HTMLButtonElement>(null);

  const isWorkflow = pathname.startsWith('/workflow');
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(() => pathname.startsWith('/workflow'));

  const closeWorkflow = () => {
    setIsWorkflowOpen(false);
    setTimeout(() => chevronRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (pathname.startsWith('/workflow')) {
      setIsWorkflowOpen(true);
    }
  }, [pathname]);

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
        {/* Superwork Workflow — 좌측 토글 chevron + Link */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            ref={chevronRef}
            onClick={() => setIsWorkflowOpen((prev) => !prev)}
            aria-expanded={isWorkflowOpen}
            aria-controls="workflow-nav-subtree"
            aria-label={isWorkflowOpen ? 'Superwork Workflow 메뉴 접기' : 'Superwork Workflow 메뉴 펼치기'}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeWorkflow();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: '24px',
              height: '32px',
              marginLeft: '2px',
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
            {/*
              좌측 배치 chevron — 접힘 ▶ / 펼침 ▼
              - isWorkflowOpen=false (접힘): rotate(-90deg)로 ChevronDown(▼)을 오른쪽(▶)으로 회전
              - isWorkflowOpen=true  (펼침): rotate(0deg) 유지 → ▼ (아래)
            */}
            <ChevronDown
              size={14}
              aria-hidden="true"
              style={{
                transform: isWorkflowOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.22s ease',
              }}
            />
          </button>

          <Link
            href="/workflow"
            className="sidebar-item"
            aria-current={isWorkflow ? 'page' : undefined}
            onClick={closeSidebar}
            style={{ flex: 1 }}
          >
            <Layers size={16} aria-hidden="true" />
            Superwork Workflow
          </Link>
        </div>

        {/* 워크플로우 서브트리 — isWorkflowOpen 상태 기반 토글 */}
        <AnimatePresence initial={false}>
          {isWorkflowOpen && (
            <motion.div
              id="workflow-nav-subtree"
              role="group"
              aria-label="Superwork Workflow 하위 메뉴"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') closeWorkflow();
              }}
            >
              <div className="sidebar-subtree">
                {workflowSections.map((section) => (
                  <div key={section.id}>
                    <Link
                      href={`/workflow#${section.id}`}
                      className="sidebar-subitem"
                      aria-current={activeId === section.id ? 'location' : undefined}
                      onClick={closeSidebar}
                    >
                      {section.navLabel ?? section.title}
                    </Link>
                    {section.children?.map((child) => (
                      <Link
                        key={child.id}
                        href={`/workflow#${child.id}`}
                        className="sidebar-subsubitem"
                        aria-current={activeId === child.id ? 'location' : undefined}
                        onClick={closeSidebar}
                      >
                        {child.navLabel ?? child.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
