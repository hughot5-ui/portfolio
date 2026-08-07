import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

type Work = {
  no: string;
  title: string;
  category: string;
  projectId: number;
  accent: string;
};

const works: Work[] = [
  { no: '01', title: '불량소녀, 너를 응원해!', category: 'Poster', projectId: 1, accent: '#41a1f4' },
  { no: '02', title: '헝키쇼', category: 'Musical Poster', projectId: 2, accent: '#e8552d' },
  { no: '03', title: '라인업', category: 'Musical Poster', projectId: 3, accent: '#7b3ff2' },
  { no: '04', title: 'Salon de Ddalki', category: 'Leaflet', projectId: 4, accent: '#d4323d' },
  { no: '05', title: 'Keycap Design', category: 'Character Goods', projectId: 5, accent: '#f7b2bd' },
  { no: '06', title: '여름 피치 스파클링', category: 'Book Cover', projectId: 6, accent: '#ef6676' },
  { no: '07', title: '여름 피치 스파클링', category: 'Book Inside', projectId: 7, accent: '#ef6676' },
  { no: '08', title: 'Miller Magazine', category: 'Magazine Cover', projectId: 8, accent: '#ec4c4b' },
  { no: '09', title: 'Miller Magazine', category: 'Editorial', projectId: 9, accent: '#ec4c4b' },
  { no: '10', title: 'ODO — Personal Logo', category: 'Logo', projectId: 10, accent: '#f5aeb6' },
  { no: '11', title: 'Etude — BI Design', category: 'Branding', projectId: 11, accent: '#e9274a' },
  { no: '12', title: '뽀용 아이메이커', category: 'Package', projectId: 12, accent: '#f5a7b5' },
  { no: '13', title: '슈가 컬러링 젤리밤', category: 'Package', projectId: 13, accent: '#f9d0db' },
  { no: '14', title: '에뛰드 상세페이지', category: 'Detail Page', projectId: 14, accent: '#f9d0db' },
  { no: '15', title: '동네 빵집 소개', category: 'Card News', projectId: 15, accent: '#b87d52' },
  { no: '16', title: '인스타그램 광고 3종', category: 'SNS Ad', projectId: 16, accent: '#f5c518' },
  { no: '17', title: '여름 준비 필수템', category: 'Card News', projectId: 17, accent: '#5aaedc' },
  { no: '18', title: '요즘 유행하는 말랑이 총정리', category: 'Card News', projectId: 18, accent: '#f5c07a' },
  { no: '19', title: 'AI 상세페이지', category: 'AI Detail Page', projectId: 19, accent: '#10b981' },
];

export default function WorkIndex({ onSelect }: { onSelect: (id: number) => void }) {
  const ref = useScrollReveal<HTMLElement>();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="index" ref={ref} className="py-24 md:py-32 px-6 md:px-10 relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="fade-up">
            <p className="section-label mb-3">Index · 03</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight">
              The <span className="italic text-[#D4614A]">Index</span>
            </h2>
          </div>
          <p className="fade-up delay-100 text-xs tracking-[0.15em] uppercase text-[#8a7a6a]">
            {works.length} works
          </p>
        </div>

        {/* Column headers */}
        <div className="hidden md:grid grid-cols-[60px_1fr_200px] gap-4 pb-3 mb-2 border-b border-[#e0d8c8] text-[10px] tracking-[0.18em] uppercase text-[#8a7a6a] fade-up">
          <span>No.</span>
          <span>Title</span>
          <span>Category</span>
        </div>

        <div className="divide-y divide-[#e0d8c8]/60">
          {works.map((w, i) => (
            <button
              key={i}
              onClick={() => onSelect(w.projectId)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="index-row group grid w-full grid-cols-[40px_1fr_140px] md:grid-cols-[60px_1fr_200px] gap-4 items-center py-4 md:py-5 text-left"
            >
              <span
                className="text-sm font-medium tabular-nums transition-colors duration-300"
                style={{ color: hovered === i ? w.accent : '#a09080' }}
              >
                {w.no}
              </span>
              <span className="text-base md:text-lg font-medium tracking-tight text-[#1a1614] flex items-center gap-2">
                {w.title}
                <ArrowUpRight
                  size={14}
                  className="text-[#D4614A] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0 shrink-0"
                />
              </span>
              <span className="text-xs tracking-wide text-[#8a7a6a]">{w.category}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
