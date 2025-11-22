import { useEffect, useState } from "react";
import banner1 from "../../../../public/banners/banner1.webp";
import banner2 from "../../../../public/banners/banner2.webp";
import banner3 from "../../../../public/banners/banner3.webp";
import "./css/HeroCarousel.css";

const banners = [banner1, banner2, banner3];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-carousel-container">
      <div className="hero-carousel">
        <img src={banners[index]} />

        <div className="hero-dots">
          {banners.map((_, i) => (
            <div
              key={i}
              className={`hero-dot ${i === index ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
