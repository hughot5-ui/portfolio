import { Star } from 'lucide-react';

const items = [
  'Editorial Design',
  'Book Covers',
  'Brand Identity',
  'Packaging',
  'Poster Design',
  'Web Design',
  'Commissions',
  'Art Direction',
];

export default function Marquee() {
  const loop = [...items, ...items];
  return (
    <div className="py-6 border-y border-[#e0d8c8]/60 bg-[#EDE8DC]/40 overflow-hidden">
      <div className="marquee-track">
        {loop.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 mx-6">
            <span className="font-serif text-2xl md:text-3xl italic text-[#1a1614]">{item}</span>
            <Star size={14} className="text-[#D4614A] fill-[#D4614A]" />
          </span>
        ))}
      </div>
    </div>
  );
}
