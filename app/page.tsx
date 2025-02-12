import { CTASection } from "@/components/_components/home_page_components/cta-section";
import { FeaturesSection } from "@/components/_components/home_page_components/features-section";
import Hero from "@/components/_components/home_page_components/hero-section";
import Navbar from "@/components/_components/home_page_components/navbar";
import { SparklesCore } from "@/components/_components/home_page_components/sparkles";
import { TestimonialsSection } from "@/components/_components/home_page_components/testimonials-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
    {/* Ambient background with moving particles */}
    <div className="h-full w-full absolute inset-0 z-0">
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
      <Navbar/>
      <Hero/>
      <FeaturesSection/>
      <TestimonialsSection/>
      <CTASection/>
      
    </div>
  </main>
  );
}
