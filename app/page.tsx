'use client';

import Features from "./components/landing/Features";
import Footer from "./components/landing/Footer";
import Hero from "./components/landing/Hero";
import MarqueePhotos from "./components/landing/MarqueePhotos";
import MarqueeTestimonials from "./components/landing/MarqueeTestimonials";
import Stats from "./components/landing/Stats";



export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Hero/>
      <Features/>
     <MarqueeTestimonials/>
      <MarqueePhotos/>
      <Stats/>
      <Footer/>
    </main>
  );
}
