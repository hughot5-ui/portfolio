import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Works', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Index', href: '#index' },
  { label: 'Commission', href: '#commission' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 backdrop-blur-md bg-[#F5F0E8]/90 border-b border-[#e0d8c8]/60'
          : 'py-5'
      }`}
    >
      <nav className="max-w-[1440px] mx-auto px-8 md:px-12 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#top"
          className="text-[10px] tracking-[0.22em] uppercase font-semibold text-[#1a1614] hover:text-[#D4614A] transition-colors"
        >
          Daeun&nbsp;·&nbsp;Portfolio 2025—26
        </a>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </div>

        {/* Right: availability badge */}
        <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1614]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4614A] animate-pulse" />
          Available for 2026
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[#1a1614]"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden mt-3 mx-6 p-5 rounded-2xl bg-[#F5F0E8]/95 backdrop-blur-md border border-[#e0d8c8] flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-xs tracking-[0.14em] uppercase font-medium text-[#3d3530] py-2 border-b border-[#e0d8c8] last:border-0"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
