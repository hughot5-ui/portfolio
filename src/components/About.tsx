import { useScrollReveal } from '../hooks/useScrollReveal';

const software = [
  { name: 'Adobe Photoshop', initials: 'Ps', color: '#1e6fb8', bg: '#001e36', sub: '' },
  { name: 'Adobe Illustrator', initials: 'Ai', color: '#ff9a00', bg: '#330000', sub: '' },
  { name: 'Adobe InDesign', initials: 'Id', color: '#ff3b80', bg: '#33001e', sub: '' },
  { name: 'Figma', initials: 'Fg', color: '#a259ff', bg: '#1e0032', sub: '' },
  { name: 'AI Tools', initials: 'AI', color: '#10b981', bg: '#022c22', sub: 'GPT · Gemini · Firefly' },
];

const skills = [
  'Brand Identity',
  'Editorial Layout',
  'Package Design',
  'Typography',
  'Poster Design',
  'Print Production',
  'Art Direction',
  'Social Content',
];

export default function About() {
  const ref = useScrollReveal();

  return (
    <section id="about" ref={ref} className="py-24 md:py-32 px-6 md:px-10 relative overflow-hidden">
      <div className="absolute top-20 right-[5%] w-64 h-64 rounded-full bg-[#F2C4CA]/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <p className="section-label mb-3 fade-up">About · 02</p>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Headline col */}
          <div className="lg:col-span-5 fade-up">
            <h2 className="font-serif text-5xl md:text-6xl lg:text-[4.2rem] leading-[0.95] tracking-tight">
              I design to be{' '}
              <span className="italic text-[#D4614A]">remembered.</span>
            </h2>

            {/* Philosophy quote */}
            <div className="mt-10 p-7 rounded-2xl bg-white/50 border border-[#e8dfcf] fade-up delay-200 relative">
              <span className="absolute -top-3 left-6 font-serif text-4xl text-[#D4614A]">“</span>
              <p className="font-serif italic text-lg md:text-xl leading-snug text-[#1a1614]">
                기분 좋은 경험은 오래 기억된다.<br />
                자연스럽게 스며들고, 시간이 지나도 다시 떠오르는 디자인.
              </p>
              <p className="mt-4 text-[10px] tracking-[0.18em] uppercase text-[#8a7a6a]">
                — Design philosophy
              </p>
            </div>
          </div>

          {/* Content col */}
          <div className="lg:col-span-7">

            <div className="space-y-5 text-[#3d3530] font-light leading-relaxed text-base md:text-lg fade-up delay-100">
              <p>
                안녕하세요, 그래픽 디자이너 <strong className="text-[#1a1614] font-medium">이다은</strong>입니다.
                저는 기분 좋은 경험은 오래 기억된다고 믿습니다. 그래서 보기 좋은 결과물보다 사람들에게 자연스럽게 스며들고, 시간이 지나도 다시 떠오르는 디자인을 만드는 것을 목표로 합니다.
              </p>
              <p>
                브랜드의 이야기를 가장 적절한 형태로 전달하고, 작은 디테일까지 세심하게 다듬어 오래 기억되는 시각 경험을 만드는 것이 제가 디자인하는 이유입니다.
              </p>
            </div>

            {/* Skills */}
            <div className="mt-10 fade-up delay-300">
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#8a7a6a] mb-4">
                Areas of focus
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="pill bg-[#F5F0E8] border border-[#e0d8c8] text-[#3d3530]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Software */}
            <div className="mt-10 fade-up delay-400">
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#8a7a6a] mb-4">
                Tools I work with
              </p>
              <div className="flex flex-wrap gap-3">
                {software.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/60 border border-[#e8dfcf] transition-transform hover:scale-105 hover:-translate-y-0.5"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
                      style={{ backgroundColor: s.bg, color: s.color }}
                    >
                      {s.initials}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-[#1a1614]">{s.name}</span>
                      {s.sub && <p className="text-[10px] text-[#8a7a6a] leading-tight mt-0.5">{s.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
