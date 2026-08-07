import { useScrollReveal } from '../hooks/useScrollReveal';

type Entry = {
  year: string;
  title: string;
  org: string;
  description: string;
  tag: string;
  color: string;
};

const entries: Entry[] = [
  {
    year: '2025',
    title: 'Freelance Graphic Designer',
    org: 'Independent Practice',
    description:
      'Working with small studios and private clients on editorial, packaging, and identity commissions. Currently accepting select projects for the spring season.',
    tag: 'Current',
    color: '#D4614A',
  },
  {
    year: '2024',
    title: 'Package Designer',
    org: 'Bloom Tea Co.',
    description:
      'Led the visual identity and packaging system for a floral tea brand, including botanical illustrations, label design, and print production oversight.',
    tag: 'Commission',
    color: '#E8A0A8',
  },
  {
    year: '2023',
    title: 'Editorial Designer',
    org: 'Field Notes Quarterly',
    description:
      'Designed layout and covers for a nature-writing journal across three issues, establishing the publication’s typographic system and grid.',
    tag: 'Editorial',
    color: '#7BAFD4',
  },
  {
    year: '2022',
    title: 'Junior Designer',
    org: 'Atelier Lune Studio',
    description:
      'Collaborated on brand identities and web design for small businesses, while developing my own illustration and lettering practice on the side.',
    tag: 'Studio',
    color: '#B83232',
  },
  {
    year: '2021',
    title: 'BFA, Visual Communication Design',
    org: 'Hongik University',
    description:
      'Graduated with a focus on editorial and typographic design. My thesis project — a 64-page independent magazine — earned the department’s senior award.',
    tag: 'Education',
    color: '#C4A060',
  },
];

export default function Timeline() {
  const ref = useScrollReveal();

  return (
    <section id="timeline" ref={ref} className="py-24 md:py-32 px-6 md:px-10 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3 fade-up">Journey · 03</p>
          <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight fade-up">
            A short <span className="italic text-[#D4614A]">history</span>
          </h2>
          <p className="mt-4 max-w-md mx-auto text-[#3d3530] font-light leading-relaxed fade-up delay-100">
            The path so far — studios, clients, and the projects that shaped my approach along the way.
          </p>
        </div>

        <div className="relative pl-8 md:pl-0">
          {/* Vertical line */}
          <div className="absolute left-[11px] md:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#E8A0A8] via-[#D4614A] to-transparent md:-translate-x-1/2" />

          <div className="space-y-8 md:space-y-0">
            {entries.map((e, i) => {
              const leftSide = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative fade-up delay-${(i % 3) * 100 + 100} md:grid md:grid-cols-2 md:gap-12`}
                >
                  {/* Dot */}
                  <div
                    className="absolute left-[7px] md:left-1/2 top-6 w-[10px] h-[10px] rounded-full md:-translate-x-1/2 ring-4 ring-[#F5F0E8] z-10"
                    style={{ backgroundColor: e.color }}
                  />

                  {/* Card */}
                  <div
                    className={`pl-8 md:pl-0 ${
                      leftSide ? 'md:pr-12 md:text-right' : 'md:col-start-2 md:pl-12'
                    }`}
                  >
                    <div className="mb-6 md:mb-12 p-6 rounded-2xl bg-white/60 border border-[#e8dfcf] transition-transform hover:-translate-y-1 hover:shadow-lg">
                      <div
                        className={`flex items-center gap-3 mb-2 ${
                          leftSide ? 'md:justify-end' : ''
                        }`}
                      >
                        <span className="pill text-white" style={{ backgroundColor: e.color }}>
                          {e.tag}
                        </span>
                        <span className="font-serif text-2xl text-[#1a1614]">{e.year}</span>
                      </div>
                      <h3 className="font-serif text-xl text-[#1a1614] mb-1">{e.title}</h3>
                      <p className="text-xs tracking-[0.1em] uppercase text-[#8a7a6a] mb-3">
                        {e.org}
                      </p>
                      <p className="text-sm text-[#3d3530] font-light leading-relaxed">
                        {e.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
