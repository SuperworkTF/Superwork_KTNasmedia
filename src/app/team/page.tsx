import type { Metadata } from 'next';
import { TeamSection } from '@/components/TeamSection';

export const metadata: Metadata = {
  title: 'Superwork Team — SUPERWORK',
  description:
    '우리는 문제의 밑바닥까지 깊게 파고들어(Question & Re-define), AI 에이전트 워크플로우를 통해 가장 효율적인 방식으로 비즈니스 해답을 찾아냅니다.',
};

export default function TeamPage() {
  return (
    <main id="main-content">
      <TeamSection />
    </main>
  );
}
