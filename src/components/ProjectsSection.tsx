'use client';

import { motion } from 'framer-motion';
import { projects } from '@/data/projects';
import { ProjectCard } from './ProjectCard';

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="section-full"
      style={{ backgroundColor: '#18181B' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          style={{ marginBottom: '64px', textAlign: 'center' }}
        >
          <p
            style={{
              marginBottom: '12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#F97316',
            }}
          >
            우리가 만든 것들
          </p>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#FAFAFA',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Projects
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid-2col">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
