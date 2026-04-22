import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { LayoutShell } from '@/components/LayoutShell';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
  preload: true,
});

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
    <html lang="ko" className={pretendard.variable}>
      <head>
        <link rel="icon" href="/Superwork_KTNasmedia/favicon.svg" type="image/svg+xml" />
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
