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
  title: 'SUPERWORK — AI 네이티브 개발 조직',
  description:
    'Superwork는 변증법 AI 에이전트 워크플로우로 기획·개발·검증·배포 전 과정을 자동화하는 팀입니다.',
  openGraph: {
    title: 'SUPERWORK — AI 네이티브 개발 조직',
    description:
      'Superwork는 변증법 AI 에이전트 워크플로우로 기획·개발·검증·배포 전 과정을 자동화하는 팀입니다.',
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
