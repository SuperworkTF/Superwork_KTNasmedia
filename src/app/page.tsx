import { Hero } from '@/components/Hero';
import { ProjectsSection } from '@/components/ProjectsSection';
import { TeamSection } from '@/components/TeamSection';

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <ProjectsSection />
      <TeamSection />
    </main>
  );
}
