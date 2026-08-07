import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

type Item = { src: string; alt: string };

const logos: Item[] = [
  { src: `${import.meta.env.BASE_URL}work/commission/commission-01.png`, alt: 'Logo — PANDA 魅了' },
  { src: `${import.meta.env.BASE_URL}work/commission/commission-02.png`, alt: 'Logo — yCN soul' },
  { src: `${import.meta.env.BASE_URL}work/commission/commission-03.png`, alt: 'Logo — Pale Blue Lo' },
  { src: `${import.meta.env.BASE_URL}work/commission/commission-07.png`, alt: 'Logo — ゆごまだ' },
  { src: `${import.meta.env.BASE_URL}work/commission/commission-08.png`, alt: 'Logo — GATEWAY' },
  { src: `${import.meta.env.BASE_URL}work/commission/commission-09.png`, alt: 'Logo — ぼくかな' },
];

const bookCovers: Item[] = [
  { src: `${import.meta.env.BASE_URL}work/commission/commission-04.jpg`, alt: 'Book Cover — 블루' },
  { src: `${import.meta.env.BASE_URL}work/commission/commission-05.jpg`, alt: 'Book Cover — 라...' },
  { src: `${import.meta.env.BASE_URL}work/commission/commission-06.jpg`, alt: 'Book Cover — Dance' },
  { src: `${import.meta.env.BASE_URL}work/commission/만화_표지_목업 copy copy copy copy copy.jpg`, alt: 'Book Cover — 시간이 우리를 사랑한 방식' },
];

function ImageGrid({ items, cols }: { items: Item[]; cols: string }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  return (
    <>
      <div className={`grid ${cols} gap-3`}>
        {items.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightbox(img.src)}
            className="group relative overflow-hidden rounded-xl bg-[#ede5d6] cursor-zoom-in fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-400" />
          </button>
        ))}
      </div>
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 md:p-16 cursor-zoom-out animate-[fadeIn_0.2s_ease-out]"
        >
          <img
            src={lightbox}
            alt="Detail"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

export default function Commission() {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="commission" ref={ref} className="py-20 md:py-28 px-6 md:px-10 relative">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div className="fade-up">
            <p className="section-label mb-3">Commission · 04</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight">
              <span className="italic text-[#D4614A]">Commission</span> Works
            </h2>
          </div>
          <p className="fade-up delay-100 text-xs tracking-[0.15em] uppercase text-[#8a7a6a]">
            {logos.length + bookCovers.length} pieces
          </p>
        </div>

        {/* Logos group */}
        <div className="mb-14 fade-up">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8a7a6a] mb-5">
            Logo Design
          </p>
          <ImageGrid items={logos} cols="grid-cols-2 md:grid-cols-3" />
        </div>

        {/* Book covers group */}
        <div className="fade-up delay-100">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8a7a6a] mb-5">
            Book Cover Design
          </p>
          <ImageGrid items={bookCovers} cols="grid-cols-2 md:grid-cols-3" />
        </div>

      </div>
    </section>
  );
}
