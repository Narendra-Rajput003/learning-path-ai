"use client";

import dynamic from 'next/dynamic';

const Navbar = dynamic(
  () => import('@/components/_components/home_page_components/navbar'),
  { ssr: false, loading: () => <div className="h-[76px]" /> }
);

const Hero = dynamic(
  () => import('@/components/_components/home_page_components/hero-section'),
  { ssr: false, loading: () => <div className="min-h-[calc(100vh-76px)]" /> }
);

export default function ClientWrapper() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}