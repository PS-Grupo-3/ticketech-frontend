import { useEffect, useState } from "react";
import banner1 from "../../../public/banners/banner1.webp";
import banner2 from "../../../public/banners/banner2.webp";
import banner3 from "../../../public/banners/banner3.webp";


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
  <div className="max-w-7xl mx-auto px-6 mt-10">
    <div className="relative w-full h-[420px] rounded-xl overflow-hidden">
      <img
        src={banners[index]}
        className="w-full h-full object-cover transition-all duration-700"
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-red-600" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);

}