import { useEffect, useRef, useState } from "react";
import "./css/PromotionsCarousel.css";

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

  const GAP_PX = 12;
  const visibleCount = 3;

  const maxIndex = Math.max(0, promos.length - visibleCount);

  const moveTo = (target: number) => {
    const track = trackRef.current;
    if (!track) return;

    const firstItem = track.children[0] as HTMLElement;
    if (!firstItem) return;

    const step = firstItem.offsetWidth + GAP_PX;
    setIndex(target);
    track.scrollTo({ left: target * step, behavior: "smooth" });
  };

  const goNext = () => moveTo(index >= maxIndex ? 0 : index + 1);
  const goPrev = () => moveTo(index <= 0 ? maxIndex : index - 1);

  useEffect(() => {
    const interval = setInterval(goNext, 3000);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="promo-container">

      <div className="scheduled-carousel-header">
        <h2 className="home-title">Disfrutá de nuestra promociones!</h2>

        <div className="scheduled-carousel-buttons">
          <button onClick={goPrev} className="scheduled-btn">◀</button>
          <button onClick={goNext} className="scheduled-btn">▶</button>
        </div>
      </div>

      <div className="promo-viewport">
        <div
          ref={trackRef}
          className="promo-track"
          style={{ gap: `${GAP_PX}px` }}
        >
          {promos.map((p, i) => (
            <div
              key={i}
              className="promo-item"
              style={{
                flex: `0 0 calc((100% - ${(visibleCount - 1) * GAP_PX}px) / ${visibleCount})`
              }}
            >
              <div className="promo-image-wrapper">
                <img src={p} alt={`promo-${i}`} className="promo-image" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="promo-indicators">
        {Array.from({ length: 4 }).map((_, i) => {
          const target = Math.min(i, maxIndex);
          return (
            <button
              key={i}
              onClick={() => moveTo(target)}
              className={`promo-dot ${index === target ? "active" : ""}`}
            />
          );
        })}
      </div>

    </div>
  );
}
