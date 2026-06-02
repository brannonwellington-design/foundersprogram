import { Hero } from "@/components/sections/Hero";
import { Edge } from "@/components/sections/Edge";
import { Details } from "@/components/sections/Details";
import { Mentors } from "@/components/sections/Mentors";
import { Testimonials } from "@/components/sections/Testimonials";
import { Apply } from "@/components/sections/Apply";
import { Footer } from "@/components/layout/Footer";
import { MobileApplyBar } from "@/components/layout/MobileApplyBar";

export default function Home() {
  return (
    <main>
      <Hero />
      <Edge />
      <Details />
      <Mentors />
      <Testimonials />
      <Apply />
      <Footer />
      <MobileApplyBar />
    </main>
  );
}
