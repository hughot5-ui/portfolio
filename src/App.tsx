import { useState, useCallback } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Portfolio from './components/Portfolio';
import About from './components/About';
import WorkIndex from './components/WorkIndex';
import Commission from './components/Commission';
import CustomCursor from './components/CustomCursor';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const ref = useScrollReveal();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const handleSelect = useCallback((id: number) => {
    setSelectedProjectId(id);
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleClearSelected = useCallback(() => setSelectedProjectId(null), []);

  return (
    <div ref={ref} className="min-h-screen bg-[#F5F0E8] text-[#1a1614] overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Portfolio selectedId={selectedProjectId} onClearSelected={handleClearSelected} />
        <About />
        <WorkIndex onSelect={handleSelect} />
        <Commission />
        <Contact />
      </main>
      <Footer />
      <CustomCursor />
    </div>
  );
}

export default App;
