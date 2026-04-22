import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProjectsSection } from '@/components/ProjectsSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <ProjectsSection />
      </main>
      <Footer />
    </>
  );
}
