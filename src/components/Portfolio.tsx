import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, ZoomIn, RotateCcw } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

type ZoomPos = { x: number; y: number };

function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState<ZoomPos>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const pinchRef = useRef<{ dist: number; baseScale: number } | null>(null);

  useEffect(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, [src]);

  const clamp = useCallback((x: number, y: number, s: number): ZoomPos => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const maxX = (el.clientWidth * (s - 1)) / 2;
    const maxY = (el.clientHeight * (s - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const zoomAt = useCallback((delta: number, cx: number, cy: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setScale((prev) => {
      const next = Math.max(1, Math.min(5, prev + delta));
      if (next === 1) {
        setPos({ x: 0, y: 0 });
        return 1;
      }
      const originX = cx - rect.left - rect.width / 2;
      const originY = cy - rect.top - rect.height / 2;
      setPos((p) => clamp(
        p.x - originX * (1 / prev - 1 / next),
        p.y - originY * (1 / prev - 1 / next),
        next,
      ));
      return next;
    });
  }, [clamp]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    zoomAt(-e.deltaY * 0.004, e.clientX, e.clientY);
  }, [zoomAt]);

  const handleDblClick = useCallback((e: React.MouseEvent) => {
    setScale((prev) => {
      if (prev >= 2) { setPos({ x: 0, y: 0 }); return 1; }
      const el = containerRef.current;
      if (!el) return 2.5;
      const rect = el.getBoundingClientRect();
      const next = 2.5;
      const originX = e.clientX - rect.left - rect.width / 2;
      const originY = e.clientY - rect.top - rect.height / 2;
      setPos((p) => clamp(
        p.x - originX * (1 / prev - 1 / next),
        p.y - originY * (1 / prev - 1 / next),
        next,
      ));
      return next;
    });
  }, [clamp]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y };
    setDragging(true);
  }, [scale, pos]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.sx;
    const dy = e.clientY - dragRef.current.sy;
    setPos(clamp(dragRef.current.px + dx, dragRef.current.py + dy, scale));
  }, [scale, clamp]);

  const stopDrag = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = { dist: Math.hypot(dx, dy), baseScale: scale };
    } else if (e.touches.length === 1 && scale > 1) {
      dragRef.current = { sx: e.touches[0].clientX, sy: e.touches[0].clientY, px: pos.x, py: pos.y };
    }
  }, [scale, pos]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const next = Math.max(1, Math.min(5, pinchRef.current.baseScale * (dist / pinchRef.current.dist)));
      setScale(next);
      if (next === 1) setPos({ x: 0, y: 0 });
      else setPos((p) => clamp(p.x, p.y, next));
    } else if (e.touches.length === 1 && dragRef.current) {
      const dx = e.touches[0].clientX - dragRef.current.sx;
      const dy = e.touches[0].clientY - dragRef.current.sy;
      setPos(clamp(dragRef.current.px + dx, dragRef.current.py + dy, scale));
    }
  }, [scale, clamp]);

  const handleTouchEnd = useCallback(() => {
    dragRef.current = null;
    pinchRef.current = null;
  }, []);

  const isZoomed = scale > 1.01;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      style={{ cursor: isZoomed ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onDoubleClick={handleDblClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[50vh] md:max-h-[90vh] w-auto h-auto object-contain pointer-events-none"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transition: dragging ? 'none' : 'transform 0.15s ease-out',
        }}
        draggable={false}
      />
      {/* Zoom hint */}
      {!isZoomed && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur text-white text-[10px] pointer-events-none opacity-70 z-10">
          <ZoomIn size={11} />
          <span>휠 · 더블클릭</span>
        </div>
      )}
      {/* Reset button when zoomed */}
      {isZoomed && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); setScale(1); setPos({ x: 0, y: 0 }); }}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-[11px] font-medium hover:bg-black/80 transition-colors z-20 shadow-md"
          aria-label="Reset zoom"
        >
          <RotateCcw size={11} />
          <span>{Math.round(scale * 10) / 10}×</span>
        </button>
      )}
    </div>
  );
}

type Project = {
  id: number;
  title: string;
  subtitle: string;
  mainCategory: string;
  subCategory: string;
  description: string;
  software: string;
  images: string[];
  accent: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: '불량소녀, 너를 응원해!',
    subtitle: 'Movie Poster',
    mainCategory: 'Graphic Design',
    subCategory: '',
    description:
      '학년 꼴찌였던 불량소녀가 1년 만에 편차치 40을 올려 게이오대학에 합격한 실화를 바탕으로 한 영화 포스터. 노트와 낙서 요소를 활용한 그래픽 스타일로 학생의 학습 환경과 도전적인 분위기를 시각적으로 표현했습니다.',
    software: 'Photoshop · Illustrator',
    images: [`${import.meta.env.BASE_URL}work/poster-girl.png`],
    accent: '#41a1f4',
  },
  {
    id: 2,
    title: '헝키쇼',
    subtitle: 'Musical Poster',
    mainCategory: 'Graphic Design',
    subCategory: '',
    description:
      '블랙과 레드의 매혹적인 대조, 강렬하게 확장된 타이포그래피를 통해 여성 전용 19금 뮤지컬 특유의 은밀하면서도 화려한 퍼포먼스 에너지를 직관적으로 표현한 그래픽 포스터입니다.',
    software: 'Photoshop · Illustrator',
    images: [`${import.meta.env.BASE_URL}work/poster-hungki.jpg`],
    accent: '#e8552d',
  },
  {
    id: 3,
    title: '라인업',
    subtitle: 'Musical Poster',
    mainCategory: 'Graphic Design',
    subCategory: '',
    description:
      '깨지는 유리 그래픽과 쏟아지는 스포트라이트 연출을 통해, 평가의 압박을 이겨내고 하나의 팀으로 완성되어 가는 청소년들의 패기와 청춘의 서사를 묵직하면서도 감각적으로 담아낸 포스터입니다.',
    software: 'Photoshop · Illustrator',
    images: [`${import.meta.env.BASE_URL}work/poster-lineup.jpg`],
    accent: '#7b3ff2',
  },
  {
    id: 4,
    title: 'Salon de Ddalki',
    subtitle: 'Leaflet · JW 메리어트 동대문',
    mainCategory: 'Graphic Design',
    subCategory: '',
    description:
      '팬톤 컬러 협업 콘셉트로 기획된 딸기 디저트 뷔페 리플렛. 올해의 팬톤 컬러 Cloud Dancer를 메인 배경으로, 딸기 레드 컬러를 포인트로 사용해 상큼함과 프리미엄 살롱 감성을 동시에 표현했습니다.',
    software: 'Photoshop · Illustrator · InDesign',
    images: [`${import.meta.env.BASE_URL}work/leaflet/leaflet-01.jpg`, `${import.meta.env.BASE_URL}work/leaflet/leaflet-02.jpg`],
    accent: '#d4323d',
  },
  {
    id: 5,
    title: 'Keycap Design',
    subtitle: 'Character Goods',
    mainCategory: 'Graphic Design',
    subCategory: '',
    description:
      '캐릭터를 활용한 키캡 디자인 프로젝트. 각 키캡에 감정과 개성을 담은 그래픽을 적용해 소장 가치를 높였습니다. 부드러운 컬러와 입체감으로 아기자기하면서도 완성도 있는 굿즈를 표현했습니다.',
    software: 'Illustrator',
    images: [
      `${import.meta.env.BASE_URL}work/keycap/keycap-01.jpg`,
      `${import.meta.env.BASE_URL}work/keycap/keycap-02.jpg`,
      `${import.meta.env.BASE_URL}work/keycap/keycap-03.jpg`,
      `${import.meta.env.BASE_URL}work/keycap/keycap-04.jpg`,
    ],
    accent: '#f7b2bd',
  },
  {
    id: 6,
    title: '여름 피치 스파클링',
    subtitle: 'Book Cover · 차정은',
    mainCategory: 'Editorial Design',
    subCategory: 'Book',
    description:
      '시집의 분위기를 시각적으로 풀어낸 북커버 디자인. 복숭아가 떨어지는 듯한 그래픽으로 탄산 속에 스며드는 장면을 표현하고, 그라데이션·라인·도트 요소로 전체 23페이지의 통일감을 완성했습니다.',
    software: 'Photoshop · Illustrator · InDesign',
    images: [`${import.meta.env.BASE_URL}work/book-cover.jpg`],
    accent: '#ef6676',
  },
  {
    id: 7,
    title: '여름 피치 스파클링',
    subtitle: 'Book Inside Design',
    mainCategory: 'Editorial Design',
    subCategory: 'Book',
    description:
      '시의 흐름과 감정을 시각적으로 표현한 내지 디자인. 부드러운 컬러와 그래픽으로 여백의 미를 살리고, 텍스트와 비주얼의 균형으로 몰입감 있는 독서 경험을 제공합니다.',
    software: 'Illustrator · InDesign',
    images: [
      `${import.meta.env.BASE_URL}work/book/inside-01.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-02.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-03.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-04.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-05.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-06.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-07.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-08.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-09.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-10.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-11.jpg`,
      `${import.meta.env.BASE_URL}work/book/inside-12.jpg`,
    ],
    accent: '#ef6676',
  },
  {
    id: 8,
    title: 'Miller Magazine',
    subtitle: 'Magazine Cover · 일본 가상 잡지',
    mainCategory: 'Editorial Design',
    subCategory: 'Magazine',
    description:
      '일본 잡지 스타일 기반의 크리스마스 시즌 매거진 커버. 메인 컬러와 서브 컬러의 대비로 계절감을 강조하고, 그래픽 요소와 타이포그래피를 조화롭게 배치했습니다.',
    software: 'Photoshop · Illustrator · InDesign · AI',
    images: [`${import.meta.env.BASE_URL}work/magazine-cover.jpg`],
    accent: '#ec4c4b',
  },
  {
    id: 9,
    title: 'Miller Magazine',
    subtitle: 'Magazine Inside · 일본 가상 잡지',
    mainCategory: 'Editorial Design',
    subCategory: 'Magazine',
    description:
      '레드와 그린 포인트 컬러, 빈티지 무드 톤으로 따뜻한 연말 분위기를 담은 에디토리얼. 패션 룩북과 겨울 라이프스타일 아이템, 미피 캐릭터 콘텐츠를 실제 잡지 흐름으로 구성했습니다.',
    software: 'Photoshop · Illustrator · InDesign · AI',
    images: [
      `${import.meta.env.BASE_URL}work/magazine/inside-01.jpg`,
      `${import.meta.env.BASE_URL}work/magazine/inside-02.jpg`,
      `${import.meta.env.BASE_URL}work/magazine/inside-03.jpg`,
      `${import.meta.env.BASE_URL}work/magazine/inside-04.jpg`,
      `${import.meta.env.BASE_URL}work/magazine/inside-05.jpg`,
    ],
    accent: '#ec4c4b',
  },
  {
    id: 10,
    title: 'ODO — Personal Logo',
    subtitle: 'Personal Branding · Lee DaEun',
    mainCategory: 'Branding & Identity',
    subCategory: 'Logo',
    description:
      '이름의 한·영 이니셜을 결합한 ODO를 모티브로 제작한 개인 로고. 두 이니셜을 무한(∞) 형태로 단순화하여 끊임없이 확장해 나가는 디자인 사고방식을 상징합니다.',
    software: 'Illustrator',
    images: [`${import.meta.env.BASE_URL}work/personal-logo.jpg`],
    accent: '#f5aeb6',
  },
  {
    id: 11,
    title: 'Etude — BI Design',
    subtitle: 'Branding · 리브랜딩',
    mainCategory: 'Branding & Identity',
    subCategory: 'Logo',
    description:
      '에뛰드 특유의 사랑스럽고 키치한 무드를 현대적인 감각으로 재해석한 리브랜딩. 부드러운 곡선의 로고타입과 핑크 컬러 시스템으로 브랜드 아이덴티티를 시각화했습니다.',
    software: 'Illustrator',
    images: [
      `${import.meta.env.BASE_URL}work/branding-01.png`,
      `${import.meta.env.BASE_URL}work/branding-02.png`,
      `${import.meta.env.BASE_URL}work/branding-03.png`,
      `${import.meta.env.BASE_URL}work/branding-04.png`,
      `${import.meta.env.BASE_URL}work/branding-05.png`,
      `${import.meta.env.BASE_URL}work/branding-06.png`,
      `${import.meta.env.BASE_URL}work/branding-07.png`,
      `${import.meta.env.BASE_URL}work/branding-08.png`,
      `${import.meta.env.BASE_URL}work/branding-09.png`,
      `${import.meta.env.BASE_URL}work/branding-10.png`,
      `${import.meta.env.BASE_URL}work/branding-11.png`,
    ],
    accent: '#e9274a',
  },
  {
    id: 12,
    title: '뽀용 아이메이커',
    subtitle: 'Package Design · Etude',
    mainCategory: 'Branding & Identity',
    subCategory: 'Package',
    description:
      '마법소녀에서 영감 받은 키치하고 경쾌한 무드의 아이섀도우 패키지. 비비드 컬러 팔레트와 팝한 그래픽 모티브로 제품의 생기 있는 에너지를 시각화했습니다.',
    software: 'Illustrator',
    images: [`${import.meta.env.BASE_URL}work/package-bboyong.jpg`, `${import.meta.env.BASE_URL}work/branding-bboyong-single.jpg`, `${import.meta.env.BASE_URL}work/branding-cosmetic-01.jpg`],
    accent: '#f5a7b5',
  },
  {
    id: 13,
    title: '슈가 컬러링 젤리밤',
    subtitle: 'Package Design · Etude',
    mainCategory: 'Branding & Identity',
    subCategory: 'Package',
    description:
      '물방울처럼 투명하고 탱글한 제형의 촉촉함을 담은 립 패키지. 몽글몽글한 곡선형 요소와 파스텔 톤으로 젤리 질감을 시각화하고, 볼륨감 있는 타이포그래피로 제품의 매력을 극대화했습니다.',
    software: 'Illustrator',
    images: [`${import.meta.env.BASE_URL}work/package-jelly.jpg`, `${import.meta.env.BASE_URL}work/branding-cosmetic-02.jpg`, `${import.meta.env.BASE_URL}work/branding-lip-box.jpg`],
    accent: '#f9d0db',
  },
  {
    id: 14,
    title: '에뛰드 상세페이지',
    subtitle: 'Detail Page · Mobile',
    mainCategory: 'Branding & Identity',
    subCategory: 'Package',
    description:
      '제품의 탱글한 질감과 컬러감을 직관적으로 전달하는 모바일 전용 상세페이지. 콜라주 형태의 키치한 그래픽 요소로 MZ세대 시선을 사로잡는 트렌디한 무드를 연출했습니다.',
    software: 'Photoshop · AI',
    images: [`${import.meta.env.BASE_URL}work/detail-page.jpg`],
    accent: '#f9d0db',
  },
  {
    id: 15,
    title: '동네 빵집 소개',
    subtitle: 'Card News · 6P',
    mainCategory: 'Web Design',
    subCategory: '',
    description:
      '동네 베이커리의 매력을 전달하는 카드뉴스 콘텐츠. 따뜻한 색감과 일러스트로 편안하고 친근한 이미지를 표현하고, 정보와 이미지를 균형 있게 배치했습니다.',
    software: 'Photoshop · Illustrator',
    images: [
      `${import.meta.env.BASE_URL}work/cardnews/card-01.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/card-02.png`,
      `${import.meta.env.BASE_URL}work/cardnews/card-03.png`,
      `${import.meta.env.BASE_URL}work/cardnews/card-04.png`,
      `${import.meta.env.BASE_URL}work/cardnews/card-05.png`,
      `${import.meta.env.BASE_URL}work/cardnews/card-06.png`,
    ],
    accent: '#b87d52',
  },
  {
    id: 16,
    title: '인스타그램 광고 3종',
    subtitle: 'SNS Ad · 바나나는 원래 하얗다',
    mainCategory: 'Web Design',
    subCategory: '',
    description:
      '매일유업 바나나우유, 댕근마켓, 효민사와 등 서로 다른 콘셉트의 브랜드 인스타그램 광고. 브랜드별 아이덴티티에 맞춰 컬러·일러스트·레이아웃을 각기 다르게 적용했습니다.',
    software: 'Photoshop · Illustrator',
    images: [`${import.meta.env.BASE_URL}work/insta/insta-01.jpg`, `${import.meta.env.BASE_URL}work/insta/insta-02.png`, `${import.meta.env.BASE_URL}work/insta/insta-03.png`],
    accent: '#f5c518',
  },
  {
    id: 17,
    title: '여름 준비 필수템',
    subtitle: 'Card News · 6P',
    mainCategory: 'Web Design',
    subCategory: '',
    description:
      '보냉 텀블러를 중심으로 여름철 필수 아이템을 소개하는 SNS 카드뉴스. 아이스 블루와 민트 톤의 배경 위에 제품 특징과 활용 팁을 카드 한 장씩 명료하게 담아, 스크롤을 멈추게 하는 시원한 비주얼과 효과적인 정보 전달을 동시에 구현했습니다.',
    software: 'Figma',
    images: [
      `${import.meta.env.BASE_URL}work/cardnews/summer-1.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/summer-2.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/summer-3.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/summer-4.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/summer-5.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/summer-6.jpg`,
    ],
    accent: '#5aaedc',
  },
  {
    id: 19,
    title: 'AI 상세페이지',
    subtitle: 'Detail Page · AI Generated',
    mainCategory: 'Web Design',
    subCategory: '',
    description:
      'AI 툴을 활용해 제작한 모바일 상세페이지 디자인. 제품의 핵심 특징과 매력을 시각적으로 전달하며, 트렌디한 컬러와 구성으로 소비자 시선을 사로잡는 레이아웃을 완성했습니다.',
    software: 'AI',
    images: [`${import.meta.env.BASE_URL}work/ai-generated/ai-generated-detail.png`],
    accent: '#10b981',
  },
  {
    id: 18,
    title: '요즘 유행하는 말랑이 총정리',
    subtitle: 'Card News · 7P',
    mainCategory: 'Web Design',
    subCategory: '',
    description:
      'Z세대에게 다시 사랑받는 말랑이 트렌드를 소개하는 SNS 카드뉴스. 리락쿠마 말랑이, 청사과 왁뿌 슬랑이, 크런치 슬랑이 등 인기 아이템을 종류별로 소개하고, 각각의 매력과 활용 팁을 직관적으로 정리했습니다. 따뜻한 크림 옐로 톤을 기반으로 귀엽고 트렌디한 무드를 연출했습니다.',
    software: 'Figma',
    images: [
      `${import.meta.env.BASE_URL}work/cardnews/mallang-1.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/mallang-2.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/mallang-3.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/mallang-4.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/mallang-5.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/mallang-6.jpg`,
      `${import.meta.env.BASE_URL}work/cardnews/mallang-7.jpg`,
    ],
    accent: '#f5c07a',
  },
];

type MainCat = 'All' | 'Graphic Design' | 'Editorial Design' | 'Branding & Identity' | 'Web Design';
type SubCat = 'All' | 'Book' | 'Magazine' | 'Logo' | 'Package';

const mainCategories: MainCat[] = [
  'All',
  'Graphic Design',
  'Editorial Design',
  'Branding & Identity',
  'Web Design',
];

const subCategories: Partial<Record<MainCat, SubCat[]>> = {
  'Editorial Design': ['All', 'Book', 'Magazine'],
  'Branding & Identity': ['All', 'Logo', 'Package'],
};

export default function Portfolio({ selectedId, onClearSelected }: { selectedId?: number | null; onClearSelected?: () => void }) {
  const [main, setMain] = useState<MainCat>('All');
  const [sub, setSub] = useState<SubCat>('All');
  const [selected, setSelected] = useState<Project | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const ref = useScrollReveal<HTMLElement>([main, sub]);

  useEffect(() => {
    if (selectedId != null) {
      const p = projects.find((pr) => pr.id === selectedId);
      if (p) {
        setSelected(p);
        setImgIdx(0);
      }
    }
  }, [selectedId]);

  const handleMain = (cat: MainCat) => {
    setMain(cat);
    setSub('All');
  };

  const closeModal = useCallback(() => {
    setSelected(null);
    setImgIdx(0);
    onClearSelected?.();
  }, [onClearSelected]);

  const prevImg = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setImgIdx((i) => (i - 1 + selected!.images.length) % selected!.images.length);
    },
    [selected],
  );

  const nextImg = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setImgIdx((i) => (i + 1) % selected!.images.length);
    },
    [selected],
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft' && selected.images.length > 1)
        setImgIdx((i) => (i - 1 + selected.images.length) % selected.images.length);
      if (e.key === 'ArrowRight' && selected.images.length > 1)
        setImgIdx((i) => (i + 1) % selected.images.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected, closeModal]);

  const filtered = projects.filter((p) => {
    if (main === 'All') return true;
    if (p.mainCategory !== main) return false;
    if (sub === 'All') return true;
    return p.subCategory === sub;
  });

  const subs = main !== 'All' ? subCategories[main] : undefined;

  return (
    <section id="portfolio" ref={ref} className="py-24 md:py-32 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="fade-up">
            <p className="section-label mb-3">Selected Work · 01</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight">
              The <span className="italic text-[#D4614A]">Portfolio</span>
            </h2>
            <p className="mt-4 max-w-md text-[#3d3530] font-light leading-relaxed">
              그래픽 디자인부터 에디토리얼, 브랜딩까지 —<br> 책임감과 성실함을 바탕으로 완성한 작업들입니다.
            </p>
          </div>
          <div className="fade-up delay-200 hidden md:flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#8a7a6a]">
            <span>{filtered.length} projects</span>
            <span className="w-1 h-1 rounded-full bg-[#D4614A]" />
            <span>2025—26</span>
          </div>
        </div>

        {/* Main category tabs */}
        <div className="fade-up delay-200 flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
          {mainCategories.map((c) => (
            <button
              key={c}
              onClick={() => handleMain(c)}
              className={`category-tab ${main === c ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sub category tabs */}
        {subs && (
          <div className="fade-up flex flex-wrap gap-2 mb-10 pl-1">
            {subs.map((s) => (
              <button
                key={s}
                onClick={() => setSub(s)}
                className={`px-4 py-1.5 rounded-full text-[11px] tracking-widest uppercase border transition-all duration-200 ${
                  sub === s
                    ? 'bg-[#1a1614] text-[#F5F0E8] border-[#1a1614]'
                    : 'bg-transparent text-[#8a7a6a] border-[#d8cfc0] hover:border-[#1a1614] hover:text-[#1a1614]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((p, i) => (
            <article
              key={p.id}
              onClick={() => {
                setSelected(p);
                setImgIdx(0);
              }}
              className={`project-card fade-up delay-${(i % 3) * 100 + 100} group rounded-3xl overflow-hidden bg-white/60 border border-[#e8dfcf] flex flex-col cursor-pointer`}
            >
              {/* Image */}
              <div className="img-overlay relative aspect-[4/5] overflow-hidden bg-[#f0ece4]">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute top-3 left-3 pill text-white shadow-sm text-[10px]"
                  style={{ backgroundColor: p.accent }}
                >
                  {p.mainCategory}
                  {p.subCategory ? ` — ${p.subCategory}` : ''}
                </div>
                {p.images.length > 1 && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur text-white text-[10px] font-medium">
                    {p.images.length} images
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight size={18} className="text-[#1a1614]" />
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-serif text-2xl leading-tight tracking-tight">
                    {p.title}
                  </h3>
                </div>
                <p className="text-xs tracking-wide text-[#8a7a6a] mb-2">{p.subtitle}</p>
                <p className="text-sm text-[#3d3530] leading-relaxed font-light flex-1">
                  {p.description}
                </p>
                <div className="mt-4 pt-4 border-t border-[#e8dfcf] flex items-center gap-2 text-[11px] tracking-wide text-[#8a7a6a] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.accent }} />
                  {p.software}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          onClick={closeModal}
        >
          <div
            className="relative bg-[#F5F0E8] rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-[scaleIn_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-md"
              aria-label="Close"
            >
              <X size={20} className="text-[#1a1614]" />
            </button>

            {/* Image side — contains the full image at its natural aspect ratio */}
            <div className="md:w-1/2 flex-shrink-0 bg-[#1a1614] flex items-center justify-center overflow-hidden relative">
              <ZoomableImage src={selected.images[imgIdx]} alt={`${selected.title} — image ${imgIdx + 1}`} />
              {selected.images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-md"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={20} className="text-[#1a1614]" />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-md"
                    aria-label="Next"
                  >
                    <ChevronRight size={20} className="text-[#1a1614]" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {selected.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setImgIdx(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === imgIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                        }`}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-white text-[11px] font-medium">
                    {imgIdx + 1} / {selected.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Text side */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
              <div
                className="pill text-white text-[10px] mb-4 self-start"
                style={{ backgroundColor: selected.accent }}
              >
                {selected.mainCategory}
                {selected.subCategory ? ` — ${selected.subCategory}` : ''}
              </div>
              <h3 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight mb-1">
                {selected.title}
              </h3>
              <p className="text-sm tracking-wide text-[#8a7a6a] mb-6">{selected.subtitle}</p>
              <p className="text-[#3d3530] leading-relaxed font-light text-[15px] mb-6">
                {selected.description}
              </p>
              <div className="mt-auto pt-6 border-t border-[#e8dfcf] flex items-center gap-2 text-xs tracking-wide text-[#8a7a6a] uppercase">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selected.accent }} />
                {selected.software}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
