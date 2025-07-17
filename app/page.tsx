"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/homepage/Hero";
import Products from "@/components/homepage/Products";
import Footer from "@/components/Footer";

export default function EcommercePage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden pr-24">
      {/* Clean Background with Subtle Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-500/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      <Navbar />
      <Hero />
      <Products />

      <Footer />
    </div>
  );
}
