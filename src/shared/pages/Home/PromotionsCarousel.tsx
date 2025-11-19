import { useEffect, useRef, useState } from "react";
import promo1 from "../../../../public/promos/promo1.webp";
import promo2 from "../../../../public/promos/promo2.webp";
import promo3 from "../../../../public/promos/promo3.webp";
import promo4 from "../../../../public/promos/promo4.webp";
import promo5 from "../../../../public/promos/promo5.webp";
import promo6 from "../../../../public/promos/promo6.webp";

const promos = [promo1, promo2, promo3, promo4, promo5, promo6];

export default function PromotionsCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  const GAP_PX = 8;
  const visibleCount = 3;

  const maxIndex = Math.max(0, promos.length - visibleCount);

  const goNext = () => {
    const nextIndex = index >= maxIndex ? 0 : index + 1;
    moveTo(nextIndex);
  };

  const goPrev = () => {
    const prevIndex = index <= 0 ? maxIndex : index - 1;
    moveTo(prevIndex);
  };

  const moveTo = (target: number) => {
    const track = trackRef.current;
    if (!track) return;

    const firstItem = track.children[0] as HTMLElement | undefined;
    if (!firstItem) return;

    const step = firstItem.offsetWidth + GAP_PX;

    setIndex(target);
    track.scrollTo({ left: target * step, behavior: "smooth" });
  };

  useEffect(() => {
    const onResize = () => {
      const track = trackRef.current;
      if (!track) return;

      const firstItem = track.children[0] as HTMLElement | undefined;
      if (!firstItem) return;

      const step = firstItem.offsetWidth + GAP_PX;
      track.scrollTo({ left: index * step, behavior: "auto" });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index]);

  useEffect(() => {
    const interval = setInterval(() => {
      goNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="max-w-7xl mx-auto px-6 mt-14">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">DISFRUTÁ DE NUESTRAS PROMOCIONES</h2>

        <div className="flex gap-3">
          <button
            onClick={goPrev}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg"
          >
            ◀
          </button>

          <button
            onClick={goNext}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl">
        <div
          ref={trackRef}
          style={{ gap: `${GAP_PX}px` }}
          className="flex overflow-x-auto transition-transform duration-500 no-scrollbar"
        >
          {promos.map((p, i) => (
            <div
              key={i}
              style={{
                flex: `0 0 calc((100% - ${(visibleCount - 1) * GAP_PX}px) / ${visibleCount})`,
              }}
              className="flex-shrink-0"
            >
              <div className="w-full h-72 bg-neutral-900 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={p}
                  alt={`promo-${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-3 gap-2">
        {Array.from({ length: 4 }).map((_, i) => {
          const target = Math.min(i, maxIndex);

          return (
            <button
              key={i}
              onClick={() => moveTo(target)}
              className={`h-2 w-8 rounded-full transition-all ${
                index === target
                  ? "bg-neutral-300"
                  : "bg-neutral-600 hover:bg-neutral-500"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
