import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats, { StatsTicker } from '../components/Stats'
import Trust from '../components/Trust'
import Products from '../components/Products'
import Brands from '../components/Brands'
import About from '../components/About'
import HowToBuy from '../components/HowToBuy'
import Gallery from '../components/Gallery'
import Testimonials from '../components/Testimonials'
import Shipping from '../components/Shipping'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import CookieBanner from '../components/CookieBanner'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Home() {
  useScrollAnimation()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsTicker />
        <Stats />
        <Trust />
        <Products />
        <Brands />
        <About />
        <HowToBuy />
        <Gallery />
        <Testimonials />
        <Shipping />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </>
  )
}
