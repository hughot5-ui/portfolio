export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Vertical sidebar text */}
      <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 vertical-text text-[8px] tracking-[0.5em] uppercase text-[#a09080] font-medium hidden md:block select-none">
        Portfolio&nbsp;MMXXVI
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center pl-4 md:pl-14 lg:pl-18 pr-6 md:pr-10 pt-28 md:pt-32 pb-20">
        <div className="w-full max-w-[1440px] mx-auto grid md:grid-cols-12 gap-y-10 md:gap-x-4 items-center">

          {/* ── Left: editorial headline ── */}
          <div className="md:col-span-7 lg:col-span-7 relative">

            {/* Kitchy ① — small spinning star near "Editorial," */}
            <div
              className="absolute -top-3 right-[22%] md:-top-5 md:right-[28%] text-[#D4614A] spin-slow pointer-events-none"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2l2.09 6.26L20.78 9l-5.2 3.97 1.76 6.53L12 16.4l-5.34 3.1 1.76-6.53L3.22 9l6.69-.74z" />
              </svg>
            </div>

            <h1
              className="font-serif leading-[0.93] tracking-tight text-[#1a1614]"
              style={{ fontSize: 'clamp(52px, 9.5vw, 148px)' }}
            >
              <span className="block italic text-[#B83232]">Editorial,</span>
              <span className="block">Identity &amp;</span>
              <span className="block">Visual</span>
              <span className="block italic text-[#B83232] wavy-underline-red">
                Design.
              </span>
            </h1>


          </div>

          {/* ── Right: meta info ── */}
          <div className="md:col-span-5 lg:col-span-4 lg:col-start-9 flex flex-col gap-5 md:pl-6 lg:pl-8">

            {/* Korean description */}
            <p className="text-sm leading-[1.8] text-[#3d3530]">
              책임감과 성심성의 바탕으로 작업을 완성하는<br className="hidden md:block" />
              그래픽 디자이너{' '}
              <strong className="text-[#1a1614] font-semibold">이다은</strong>의 포트폴리오.
            </p>

            {/* Discipline tags */}
            <p className="text-[11px] tracking-wide text-[#8a7a6a] leading-relaxed">
              Editorial&nbsp;·&nbsp;Branding&nbsp;·&nbsp;Poster&nbsp;·&nbsp;Book Cover
              &nbsp;·&nbsp;Web&nbsp;·&nbsp;Visual Identity.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-5 border-t border-[#e0d8c8]">
              <div>
                <p className="font-serif text-2xl md:text-[28px] leading-none text-[#1a1614]">05</p>
                <p className="text-[8px] tracking-[0.2em] uppercase text-[#8a7a6a] mt-2">Disciplines</p>
              </div>
              <div>
                <p className="font-serif text-2xl md:text-[28px] leading-none text-[#1a1614]">
                  16<span className="text-[#D4614A]">+</span>
                </p>
                <p className="text-[8px] tracking-[0.2em] uppercase text-[#8a7a6a] mt-2">Selected Works</p>
              </div>
              <div>
                <p className="font-serif text-2xl md:text-[28px] leading-none text-[#1a1614] whitespace-nowrap">2025<span className="text-[#D4614A]">–</span>26</p>
                <p className="text-[8px] tracking-[0.2em] uppercase text-[#8a7a6a] mt-2">Edition</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — bottom right */}
      <div className="absolute bottom-8 right-8 md:right-12 flex flex-col items-center gap-2">
        <span className="text-[8px] tracking-[0.35em] uppercase text-[#8a7a6a] font-medium">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#8a7a6a] to-transparent" />
      </div>
    </section>
  );
}
