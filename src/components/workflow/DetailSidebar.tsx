'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, List } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { WorkflowSection, WorkflowSubsection } from '@/lib/workflow';

interface Props {
  sections: WorkflowSection[];
}

/** 모든 섹션/하위섹션/리프의 id를 평탄화 */
function flattenIds(sections: WorkflowSection[]): string[] {
  return sections.flatMap((s) => [
    s.id,
    ...(s.children?.flatMap((c) => [
      c.id,
      ...(c.children?.map((l) => l.id) ?? []),
    ]) ?? []),
  ]);
}

/** 주어진 activeId가 section의 자손인지 검사 */
function isDescendant(section: WorkflowSection, activeId: string): boolean {
  return (
    section.children?.some(
      (c) => c.id === activeId || c.children?.some((l) => l.id === activeId),
    ) ?? false
  );
}

function isSubDescendant(
  subsection: WorkflowSubsection,
  activeId: string,
): boolean {
  return subsection.children?.some((l) => l.id === activeId) ?? false;
}

export function DetailSidebar({ sections }: Props) {
  // 기본으로 자식이 있는 섹션 전부 펼침
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(sections.filter((s) => s.children?.length).map((s) => s.id)),
  );
  const [expandedSubIds, setExpandedSubIds] = useState<Set<string>>(
    () =>
      new Set(
        sections.flatMap(
          (s) =>
            s.children
              ?.filter((c) => c.children?.length)
              .map((c) => c.id) ?? [],
        ),
      ),
  );
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // ── 스크롤 스파이 (IntersectionObserver) ──────────────────────────
  useEffect(() => {
    const allIds = flattenIds(sections);

    // 현재 화면에 보이는 섹션을 추적
    const visibleSet = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSet.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visibleSet.delete(entry.target.id);
          }
        });

        if (visibleSet.size > 0) {
          // 뷰포트 상단에 가장 가까운 항목을 활성화
          const topmost = [...visibleSet.entries()].sort(
            (a, b) => a[1] - b[1],
          )[0];
          setActiveId(topmost[0]);
        }
      },
      { rootMargin: '-8% 0px -72% 0px', threshold: 0 },
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  // 활성 항목의 부모 섹션을 자동 펼침
  useEffect(() => {
    sections.forEach((s) => {
      if (isDescendant(s, activeId)) {
        setExpandedIds((prev) => new Set([...prev, s.id]));
      }
      s.children?.forEach((c) => {
        if (isSubDescendant(c, activeId)) {
          setExpandedSubIds((prev) => new Set([...prev, c.id]));
        }
      });
    });
  }, [activeId, sections]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // 'instant'은 CSS scroll-behavior: smooth 를 무시하고 즉시 스크롤 (테스트 결정성 보장)
      el.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    }
    if (!isDesktop) setMobileOpen(false);
  };

  const toggleSection = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSubsection = (id: string) => {
    setExpandedSubIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── 네비 항목 렌더 ─────────────────────────────────────────────

  const renderLeafItem = (leafId: string, leafTitle: string, indent: number) => {
    const isActive = activeId === leafId;
    return (
      <li key={leafId}>
        <button
          onClick={() => scrollToId(leafId)}
          aria-current={isActive ? 'true' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            paddingLeft: `${12 + indent * 16}px`,
            paddingRight: '12px',
            paddingTop: '5px',
            paddingBottom: '5px',
            background: 'none',
            border: 'none',
            borderLeft: `2px solid ${isActive ? 'var(--color-ember)' : 'transparent'}`,
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '0.8125rem',
            lineHeight: 1.4,
            color: isActive ? 'var(--color-snow)' : 'var(--color-muted)',
            backgroundColor: isActive
              ? 'var(--sidebar-item-active-bg)'
              : 'transparent',
            transition: 'color 0.15s, background-color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                'var(--sidebar-item-hover-bg)';
              (e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-snow)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                'transparent';
              (e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-muted)';
            }
          }}
        >
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: isActive
                ? 'var(--color-ember)'
                : 'var(--color-outline)',
              marginRight: '8px',
            }}
          />
          {leafTitle}
        </button>
      </li>
    );
  };

  const renderSubsectionItem = (sub: WorkflowSubsection, indent: number) => {
    const isActive = activeId === sub.id;
    const isExpanded = expandedSubIds.has(sub.id);
    const hasChildren = (sub.children?.length ?? 0) > 0;
    const isAncestor = isSubDescendant(sub, activeId);

    return (
      <li key={sub.id}>
        <button
          onClick={() => {
            scrollToId(sub.id);
            if (hasChildren) toggleSubsection(sub.id);
          }}
          aria-current={isActive ? 'true' : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' && hasChildren)
              setExpandedSubIds((p) => new Set([...p, sub.id]));
            if (e.key === 'ArrowLeft' && hasChildren)
              setExpandedSubIds((p) => {
                const n = new Set(p);
                n.delete(sub.id);
                return n;
              });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            width: '100%',
            paddingLeft: `${12 + indent * 16}px`,
            paddingRight: '12px',
            paddingTop: '6px',
            paddingBottom: '6px',
            background: 'none',
            border: 'none',
            borderLeft: `2px solid ${isActive || isAncestor ? 'var(--color-ember)' : 'transparent'}`,
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '0.8125rem',
            lineHeight: 1.4,
            color: isActive ? 'var(--color-snow)' : isAncestor ? '#E4914C' : 'var(--color-muted)',
            backgroundColor: isActive
              ? 'var(--sidebar-item-active-bg)'
              : 'transparent',
            transition: 'color 0.15s, background-color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                'var(--sidebar-item-hover-bg)';
              (e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-snow)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                'transparent';
              (e.currentTarget as HTMLButtonElement).style.color =
                isAncestor ? '#E4914C' : 'var(--color-muted)';
            }
          }}
        >
          {hasChildren && (
            <motion.span
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.18 }}
              style={{ flexShrink: 0, display: 'flex' }}
            >
              <ChevronRight size={11} aria-hidden="true" />
            </motion.span>
          )}
          {!hasChildren && (
            <span
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: isActive
                  ? 'var(--color-ember)'
                  : 'var(--color-outline)',
                marginRight: '4px',
              }}
            />
          )}
          <span style={{ flex: 1 }}>{sub.navLabel ?? sub.title}</span>
        </button>

        {/* Depth 3 리프 */}
        {hasChildren && (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.ul
                key={`${sub.id}-children`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                style={{ overflow: 'hidden', listStyle: 'none', padding: 0, margin: 0 }}
              >
                {sub.children!.map((leaf) =>
                  renderLeafItem(leaf.id, leaf.navLabel ?? leaf.title, indent + 1),
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </li>
    );
  };

  const renderSectionItem = (section: WorkflowSection) => {
    const isActive = activeId === section.id;
    const isExpanded = expandedIds.has(section.id);
    const hasChildren = (section.children?.length ?? 0) > 0;
    const isAncestor = isDescendant(section, activeId);

    return (
      <li key={section.id}>
        <button
          onClick={() => {
            scrollToId(section.id);
            if (hasChildren) toggleSection(section.id);
          }}
          aria-current={isActive ? 'true' : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' && hasChildren)
              setExpandedIds((p) => new Set([...p, section.id]));
            if (e.key === 'ArrowLeft' && hasChildren)
              setExpandedIds((p) => {
                const n = new Set(p);
                n.delete(section.id);
                return n;
              });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            padding: '7px 12px',
            background: 'none',
            border: 'none',
            borderLeft: `2px solid ${isActive || isAncestor ? 'var(--color-ember)' : 'transparent'}`,
            borderRadius: '0 6px 6px 0',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '0.875rem',
            fontWeight: isActive || isAncestor ? 600 : 400,
            lineHeight: 1.4,
            color: isActive ? 'var(--color-snow)' : isAncestor ? '#E4914C' : 'var(--color-muted)',
            backgroundColor: isActive
              ? 'var(--sidebar-item-active-bg)'
              : 'transparent',
            transition: 'color 0.15s, background-color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                'var(--sidebar-item-hover-bg)';
              (e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-snow)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                'transparent';
              (e.currentTarget as HTMLButtonElement).style.color =
                isAncestor ? '#E4914C' : 'var(--color-muted)';
            }
          }}
        >
          {hasChildren && (
            <motion.span
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.18 }}
              style={{ flexShrink: 0, display: 'flex' }}
            >
              <ChevronRight size={13} aria-hidden="true" />
            </motion.span>
          )}
          <span style={{ flex: 1 }}>{section.navLabel ?? section.title}</span>
        </button>

        {/* Depth 2 자식 */}
        {hasChildren && (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.ul
                key={`${section.id}-children`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                style={{ overflow: 'hidden', listStyle: 'none', padding: 0, margin: 0 }}
              >
                {section.children!.map((sub) => renderSubsectionItem(sub, 1))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </li>
    );
  };

  // ── 네비 전체 JSX ──────────────────────────────────────────────
  const navContent = (
    <nav aria-label="Workflow sections" style={{ padding: '8px 0' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sections.map(renderSectionItem)}
      </ul>
    </nav>
  );

  // ── 데스크탑: sticky 좌측 TOC (글로벌 사이드바 우측에 이어붙음) ────
  if (isDesktop) {
    return (
      <div
        style={{
          position: 'sticky',
          top: '32px',
          width: '240px',
          flexShrink: 0,
          /* alignSelf 생략 — 부모 .workflow-layout이 default(stretch)이므로
             이 요소는 부모 전체 높이를 얻고, sticky가 스크롤 내내 따라다님.
             maxHeight는 viewport 안으로 시각 높이 제한 */
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-outline) transparent',
          borderRight: '1px solid var(--color-outline)',
          paddingRight: '16px',
        }}
      >
        <p
          style={{
            padding: '0 12px 8px',
            margin: 0,
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
          }}
        >
          이 페이지에서
        </p>
        {navContent}
      </div>
    );
  }

  // ── 모바일: 접힘/펼침 상단 패널 ──────────────────────────────
  return (
    <div
      style={{
        borderRadius: '10px',
        border: '1px solid var(--color-outline)',
        backgroundColor: 'var(--color-surface)',
        marginBottom: '24px',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setMobileOpen((p) => !p)}
        aria-expanded={mobileOpen}
        aria-controls="mobile-detail-nav"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-snow)',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <List size={15} aria-hidden="true" />
          목차
        </span>
        <motion.span
          animate={{ rotate: mobileOpen ? 90 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ display: 'flex' }}
        >
          <ChevronRight size={15} aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-detail-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid var(--color-outline)',
            }}
          >
            <div style={{ padding: '8px 0 12px' }}>{navContent}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
