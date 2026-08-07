import { Star } from 'lucide-react';

const links = [
  { label: 'Work', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Index', href: '#index' },
  { label: 'Contact', href: '#contact' },
];

const social = ['Instagram', 'Behance', 'Pinterest', 'Email'];

export default function Footer() {
  return (
    <footer className="px-6 md:px-10 pb-10 pt-16 border-t border-[#e0d8c8]/60">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <a href="#top" className="flex items-center gap-2 group mb-4">
              <span className="w-7 h-7 rounded-full bg-[#D4614A] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5F0E8]" />
              </span>
              <span className="font-serif text-lg tracking-tight">daeun<span className="text-[#D4614A]">.</span></span>
            </a>
            <p className="font-serif text-3xl md:text-4xl leading-tight tracking-tight max-w-sm">
              Quiet design, <span className="italic text-[#D4614A]">made with care.</span>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-5">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="nav-link">
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-[#8a7a6a]">
              {social.map((s) => (
                <a key={s} href="#" className="hover:text-[#1a1614] transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#e0d8c8]/60 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] tracking-[0.15em] uppercase text-[#8a7a6a]">
          <p>© 2025—26 Daeun Kim — All rights reserved</p>
          <p className="flex items-center gap-2">
            Designed & built with intention
            <Star size={11} className="text-[#D4614A] fill-[#D4614A]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
