import { BrowserCategorySection } from "@/components/landing/browser-category";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { PopularKurta } from "@/components/landing/popular-product";
import { Testimonials } from "@/components/landing/testimonials";
import { CraftsmanshipSection } from "@/components/landing/craftsmanship-section";
import { Hero } from "@/components/landing/hero";
import { BentoGrid } from "@/components/landing/bento-card";
import { Features } from "@/components/landing/feature";

export default function Home() {
  return (
    <>
      {/* <OfferBanner /> */}
      <Header />
      <Hero />
      <main className="font-sans max-w-7xl mx-auto px-4 space-y-16 ">
        {/* <CarouselHeroSection /> */}
        <BentoGrid />
        <BrowserCategorySection />
        <PopularKurta />
        <CraftsmanshipSection />
        <Testimonials />
      </main>

      <Features />
      <Footer />
    </>
  );
}
