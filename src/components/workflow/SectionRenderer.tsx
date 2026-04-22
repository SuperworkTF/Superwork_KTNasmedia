import type { WorkflowSection, WorkflowSubsection, WorkflowLeaf } from '@/lib/workflow';
import type { CSSProperties, ReactNode } from 'react';

// ──────────────────────────────────────────────────────────────────────────────
// 간이 마크다운 렌더러
// sourceHint, 비공개 링크는 절대 렌더링 안 함
// ──────────────────────────────────────────────────────────────────────────────

/** 인라인 텍스트: **bold**, `code` 처리 */
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // **bold** 와 `code` 를 분리하는 정규식
  const regex = /\*\*(.+?)\*\*|`([^`]+)`/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(
        <strong
          key={key++}
          style={{ color: 'var(--color-snow)', fontWeight: 600 }}
        >
          {match[1]}
        </strong>,
      );
    } else if (match[2] !== undefined) {
      parts.push(
        <code
          key={key++}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '0.8125em',
            padding: '1px 5px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-surface)',
            color: '#F97316',
            border: '1px solid var(--color-outline)',
          }}
        >
          {match[2]}
        </code>,
      );
    }
    last = match.index + match[0].length;
    key++;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts;
}

/** 본문 텍스트를 블록 단위로 파싱하여 렌더 */
function BodyText({ text }: { text: string }) {
  // ``` ... ``` 코드 블록 분리
  const codeBlockRe = /```[^\n]*\n?([\s\S]*?)```/g;
  const elements: ReactNode[] = [];
  let last = 0;
  let blockKey = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRe.exec(text)) !== null) {
    const before = text.slice(last, match.index);
    if (before.trim()) {
      elements.push(
        <TextBlocks key={blockKey++} raw={before} />,
      );
    }
    elements.push(
      <pre
        key={blockKey++}
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: '0.8125rem',
          lineHeight: 1.65,
          padding: '14px 18px',
          borderRadius: '8px',
          backgroundColor: '#0F0F11',
          border: '1px solid var(--color-outline)',
          overflowX: 'auto',
          color: '#A1A1AA',
          margin: '16px 0',
        }}
      >
        <code>{match[1].trim()}</code>
      </pre>,
    );
    last = match.index + match[0].length;
  }

  const remaining = text.slice(last);
  if (remaining.trim()) {
    elements.push(<TextBlocks key={blockKey++} raw={remaining} />);
  }

  return <>{elements}</>;
}

/** 코드블록을 제외한 텍스트를 단락/목록으로 렌더 */
function TextBlocks({ raw }: { raw: string }) {
  const blocks = raw
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n');
        const isList = lines.every((l) => l.trimStart().startsWith('- '));

        if (isList) {
          return (
            <ul
              key={bi}
              style={{
                margin: '12px 0',
                paddingLeft: '0',
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {lines.map((l, li) => {
                const content = l.replace(/^[\s]*-\s/, '');
                return (
                  <li
                    key={li}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '0.9375rem',
                      color: 'var(--color-muted)',
                      lineHeight: 1.7,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        marginTop: '0.55em',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-ember)',
                      }}
                    />
                    <span>{renderInline(content)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 일반 단락 — 단일 줄바꿈은 공백으로 연결
        return (
          <p
            key={bi}
            style={{
              margin: '0 0 12px',
              color: 'var(--color-muted)',
              lineHeight: 1.75,
              fontSize: '0.9375rem',
            }}
          >
            {renderInline(lines.join(' '))}
          </p>
        );
      })}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Self-Healing 개념도 (Sentry/Firebase → detect → auto-fix → PR 플로우)
// ──────────────────────────────────────────────────────────────────────────────

function SelfHealingDiagram() {
  const nodeStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '0.8125rem',
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: 1.3,
    minWidth: '120px',
  };

  const arrowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-muted)',
    fontSize: '1.25rem',
    lineHeight: 1,
    userSelect: 'none',
  };

  const labelStyle: CSSProperties = {
    fontSize: '0.6875rem',
    color: 'var(--color-muted)',
    textAlign: 'center',
    marginTop: '4px',
    letterSpacing: '0.02em',
  };

  return (
    <div
      role="img"
      aria-label="Self-Healing 흐름: Sentry/Firebase 에러 감지 → 자동 수정(PingPong) → PR 생성 → 담당자 알림"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0',
        padding: '28px 16px',
        borderRadius: '12px',
        backgroundColor: '#0D0D0F',
        border: '1px solid var(--color-outline)',
        margin: '24px 0',
        overflowX: 'auto',
      }}
    >
      {/* ── 소스 노드 행 ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              ...nodeStyle,
              backgroundColor: '#1C1020',
              border: '1px solid #7C3AED',
              color: '#C084FC',
            }}
          >
            Sentry
          </div>
          <p style={labelStyle}>백엔드 / 프론트엔드</p>
        </div>

        <div
          style={{
            ...arrowStyle,
            marginBottom: '24px',
            opacity: 0.5,
          }}
        >
          +
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              ...nodeStyle,
              backgroundColor: '#0F1C1A',
              border: '1px solid #10B981',
              color: '#6EE7B7',
            }}
          >
            Firebase
            <br />
            Crashlytics
          </div>
          <p style={labelStyle}>모바일 크래시</p>
        </div>
      </div>

      {/* 화살표 ↓ */}
      <div style={{ ...arrowStyle, margin: '4px 0' }}>↓</div>

      {/* 에러 감지 & 분류 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            ...nodeStyle,
            backgroundColor: '#1A1410',
            border: '1px solid var(--color-ember)',
            color: '#FB923C',
            minWidth: '200px',
          }}
        >
          에러 감지 &amp; 분류
        </div>
        <p style={labelStyle}>빈도 · 스택 트레이스 · 영향 범위</p>
      </div>

      {/* 분기: 낮은 심각도(좌) / 높은 심각도 경로(우) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '24px',
          margin: '8px 0',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* 좌: 낮은 심각도 → 로그 기록 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...arrowStyle, marginBottom: '4px' }}>↙</div>
          <div
            style={{
              ...nodeStyle,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-outline)',
              color: 'var(--color-muted)',
              fontSize: '0.75rem',
              minWidth: '100px',
              padding: '8px 12px',
            }}
          >
            낮은 심각도
          </div>
          <div style={{ ...arrowStyle, fontSize: '0.75rem', color: 'var(--color-muted)', margin: '4px 0' }}>
            ↓
          </div>
          <div
            style={{
              ...nodeStyle,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-outline)',
              color: 'var(--color-muted)',
              fontSize: '0.75rem',
              minWidth: '100px',
              padding: '8px 12px',
            }}
          >
            로그 기록
          </div>
        </div>

        {/* 우: 높은 심각도 → TAS Quick → 자동 수정 → PR → 알림 (수직 스택) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...arrowStyle, marginBottom: '4px' }}>↘</div>

          {/* 높은 심각도 */}
          <div
            style={{
              ...nodeStyle,
              backgroundColor: '#1A1410',
              border: '1px solid var(--color-ember)',
              color: '#FB923C',
              fontSize: '0.75rem',
              minWidth: '160px',
              padding: '8px 12px',
            }}
          >
            높은 심각도
          </div>

          <div style={{ ...arrowStyle, margin: '4px 0' }}>↓</div>

          {/* TAS Quick 트리거 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                ...nodeStyle,
                backgroundColor: '#141420',
                border: '1px solid #818CF8',
                color: '#A5B4FC',
                minWidth: '180px',
              }}
            >
              TAS Quick 자동 트리거
            </div>
            <p style={labelStyle}>
              <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.7rem', color: '#F97316' }}>
                tas quick &#34;에러 스택 + 재현 조건&#34;
              </code>
            </p>
          </div>

          <div style={{ ...arrowStyle, margin: '4px 0' }}>↓</div>

          {/* PingPong 자동 수정 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                ...nodeStyle,
                backgroundColor: '#141420',
                border: '1px solid #818CF8',
                color: '#A5B4FC',
                minWidth: '180px',
              }}
            >
              자동 수정 (PingPong)
            </div>
            <p style={labelStyle}>Executor(正) → HumanRole(反) → ACCEPT</p>
          </div>

          <div style={{ ...arrowStyle, margin: '4px 0' }}>↓</div>

          {/* PR 자동 생성 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                ...nodeStyle,
                backgroundColor: '#0F1C1A',
                border: '1px solid #10B981',
                color: '#6EE7B7',
                minWidth: '180px',
              }}
            >
              PR 자동 생성
            </div>
            <p style={labelStyle}>GitHub API · 원인 분석 · 재발 방지 포함</p>
          </div>

          <div style={{ ...arrowStyle, margin: '4px 0' }}>↓</div>

          {/* 담당자 알림 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                ...nodeStyle,
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-outline)',
                color: 'var(--color-snow)',
                minWidth: '180px',
              }}
            >
              담당자 알림
            </div>
            <p style={labelStyle}>Slack · 이메일 → 코드 리뷰 대기</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Self-Healing 면책 배너
// ──────────────────────────────────────────────────────────────────────────────
function SelfHealingDisclaimer() {
  return (
    <div
      role="note"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: 'rgba(249,115,22,0.07)',
        border: '1px solid rgba(249,115,22,0.25)',
        marginBottom: '20px',
      }}
    >
      <span
        aria-hidden="true"
        style={{ flexShrink: 0, fontSize: '0.9rem', lineHeight: '1.6' }}
      >
        ⚠
      </span>
      <p
        style={{
          margin: 0,
          fontSize: '0.8125rem',
          color: '#FB923C',
          lineHeight: 1.6,
        }}
      >
        이 섹션은 bmad-orchestrator 레포 및 로컬 디렉터리에 존재하지 않는
        추가 콘텐츠입니다. 운영 환경 자동화 비전으로 제시되며, 현재는
        구현되지 않은 기능입니다.
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Leaf 렌더러 (Depth 3)
// ──────────────────────────────────────────────────────────────────────────────
function LeafSection({ leaf }: { leaf: WorkflowLeaf }) {
  return (
    <section
      id={leaf.id}
      aria-labelledby={`${leaf.id}-heading`}
      style={{ marginBottom: '28px' }}
    >
      <h4
        id={`${leaf.id}-heading`}
        style={{
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: 'var(--color-snow)',
          letterSpacing: '-0.01em',
          marginBottom: '8px',
          paddingLeft: '10px',
          borderLeft: '2px solid var(--color-outline)',
        }}
      >
        {leaf.title}
      </h4>
      {leaf.body && <BodyText text={leaf.body} />}
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Subsection 렌더러 (Depth 2)
// ──────────────────────────────────────────────────────────────────────────────
function SubsectionBlock({
  sub,
  isSelfHealing,
}: {
  sub: WorkflowSubsection;
  isSelfHealing: boolean;
}) {
  return (
    <section
      id={sub.id}
      aria-labelledby={`${sub.id}-heading`}
      style={{ marginBottom: '36px' }}
    >
      <h3
        id={`${sub.id}-heading`}
        style={{
          fontSize: '1.0625rem',
          fontWeight: 700,
          color: 'var(--color-snow)',
          letterSpacing: '-0.02em',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-ember)',
            flexShrink: 0,
          }}
        />
        {sub.title}
      </h3>

      {sub.body && <BodyText text={sub.body} />}

      {/* Self-Healing 자동 수정 섹션에 개념도 삽입 */}
      {isSelfHealing && sub.id === 'auto-fix' && <SelfHealingDiagram />}

      {sub.children && sub.children.length > 0 && (
        <div style={{ paddingLeft: '0', marginTop: '16px' }}>
          {sub.children.map((leaf) => (
            <LeafSection key={leaf.id} leaf={leaf} />
          ))}
        </div>
      )}
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// 최상위 SectionRenderer (Depth 1)
// ──────────────────────────────────────────────────────────────────────────────
export function SectionRenderer({ section }: { section: WorkflowSection }) {
  const isSelfHealing = section.id === 'self-healing';

  return (
    <article
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      style={{
        paddingBottom: '48px',
        borderBottom: '1px solid var(--color-outline)',
        marginBottom: '48px',
      }}
    >
      {/* Depth 1 헤딩 */}
      <h2
        id={`${section.id}-heading`}
        style={{
          fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
          fontWeight: 700,
          color: 'var(--color-snow)',
          letterSpacing: '-0.025em',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--color-outline)',
        }}
      >
        {section.title}
      </h2>

      {/* Self-Healing 면책 배너 */}
      {isSelfHealing && <SelfHealingDisclaimer />}

      {/* Depth 1 본문 */}
      {section.body && <BodyText text={section.body} />}

      {/* Depth 2 하위 섹션 */}
      {section.children && section.children.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          {section.children.map((sub) => (
            <SubsectionBlock
              key={sub.id}
              sub={sub}
              isSelfHealing={isSelfHealing}
            />
          ))}
        </div>
      )}
    </article>
  );
}
