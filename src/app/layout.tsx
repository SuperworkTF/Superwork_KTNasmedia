import type { Metadata } from 'next';
import './globals.css';
import { LayoutShell } from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: 'SUPERWORK — 오픈소스 AI 도구',
  description:
    'Claude Code에서 두 에이전트가 논쟁하며 코드를 개선하는 TAS, DALL-E 3·gpt-image-1로 이미지를 생성·편집하는 MCP 서버입니다.',
  openGraph: {
    title: 'SUPERWORK — 오픈소스 AI 도구',
    description:
      'Claude Code에서 두 에이전트가 논쟁하며 코드를 개선하는 TAS, DALL-E 3·gpt-image-1로 이미지를 생성·편집하는 MCP 서버입니다.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/Superwork_KTNasmedia/favicon.svg" />
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">본문으로 바로가기</a>
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}
