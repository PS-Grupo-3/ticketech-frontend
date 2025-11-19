import { useRef } from "react";
import EventCard from "./EventCard";

export default function ScheduledEventsCarousel({ events }: { events: any[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;

    const amount = 320; // ancho aprox. card + gap (280 + 32)
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <div className="mt-10">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Eventos Programados</h2>

        {events.length > 4 && (
          <div className="flex gap-3">
            <button
              onClick={() => scroll(-1)}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg"
            >
              ◀
            </button>
            <button
              onClick={() => scroll(1)}
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg"
            >
              ▶
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {events.map((event) => (
            <div key={event.eventId} className="w-[280px] flex-shrink-0">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
