import { CTASection } from "@/components/_components/home_page_components/cta-section";
import { FeaturesSection } from "@/components/_components/home_page_components/features-section";
import { HeroSection } from "@/components/_components/home_page_components/hero-section";
import { TestimonialsSection } from "@/components/_components/home_page_components/testimonials-section";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
