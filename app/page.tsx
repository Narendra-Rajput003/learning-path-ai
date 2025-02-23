import { Suspense } from 'react';
import { FeaturesSection } from "@/components/_components/home_page_components/features-section";
import { Footer } from '@/components/_components/home_page_components/footer';
import { SparklesCore } from "@/components/_components/home_page_components/sparkles";
import ClientWrapper from '@/components/_components/client-wrapper';
import { PopularPaths } from '@/components/_components/home_page_components/popular-paths';
import { TestimonialsSection } from '@/components/_components/home_page_components/testimonials-section';
import ContactSection from '@/components/_components/home_page_components/contact-section';
export default function Home() {
  return (
    <main className="bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles */}
      <div className="fixed inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10">
        <ClientWrapper />

        <section id="features">
          <FeaturesSection />
        </section>

        <section id="roadmaps">
          <PopularPaths />
        </section>

        <section id="testimonials">
          <TestimonialsSection />
        </section>

        <section id="contact">
          <ContactSection />
        </section>

        <Footer />
      </div>
    </main>
  );
}
