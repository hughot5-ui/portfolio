import { Mail, FileText, ArrowUpRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const cards = [
  {
    icon: Mail,
    label: 'Email',
    value: 'l1is2fr0@naver.com',
    note: 'Best for project enquiries',
    href: 'mailto:l1is2fr0@naver.com',
    accent: '#D4614A',
  },
  {
    icon: FileText,
    label: 'Portfolio PDF',
    value: 'Download the 2025—26 lookbook',
    note: '12 MB · Latest edition',
    href: 'https://drive.google.com/uc?export=download&id=1ZX6A1QlxE2UwQnK_NH7j-mHbL12vj4xO',
    accent: '#7BAFD4',
  },
];

export default function Contact() {
  const ref = useScrollReveal();

  return (
    <section id="contact" ref={ref} className="py-24 md:py-32 px-6 md:px-10 relative overflow-hidden">
      <div className="absolute top-10 left-[10%] w-72 h-72 rounded-full bg-[#A8CDE0]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-[8%] w-72 h-72 rounded-full bg-[#F2C4CA]/40 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14">
          <p className="section-label mb-3 fade-up">Contact · 04</p>
          <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight fade-up">
            Let’s make <span className="italic text-[#D4614A]">something</span>
          </h2>
          <p className="mt-5 max-w-lg mx-auto text-[#3d3530] font-light leading-relaxed fade-up delay-100">
            I’m currently taking on select freelance projects for the spring season.
            Drop a line, grab the lookbook, or follow along — whichever feels right.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-2xl mx-auto">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`contact-card fade-up delay-${(i + 1) * 100} group block`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${c.accent}22`, color: c.accent }}
                >
                  <Icon size={22} />
                </div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#8a7a6a] mb-1">
                  {c.label}
                </p>
                <p className="font-serif text-xl text-[#1a1614] mb-1">{c.value}</p>
                <p className="text-xs text-[#8a7a6a] font-light">{c.note}</p>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-[#1a1614]">
                  {c.label === 'Portfolio PDF'
                  ? <span className="uppercase tracking-[0.1em]">Download</span>
                  : <span className="uppercase tracking-[0.1em]">Open</span>}
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
