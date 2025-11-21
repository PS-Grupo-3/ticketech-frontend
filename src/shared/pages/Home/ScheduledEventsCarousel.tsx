import { useRef } from "react";
import EventCard from "./EventCard";
import "./css/ScheduledEventsCarousel.css";
import "./css/HomePage.css";

export default function ScheduledEventsCarousel({ events }: { events: any[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;

    const amount = 20 * 16;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <div className="scheduled-carousel">

      <div className="scheduled-carousel-header">
        <h2 className="home-title">Eventos Programados</h2>

        {events.length > 4 && (
          <div className="scheduled-carousel-buttons">
            <button onClick={() => scroll(-1)} className="scheduled-btn">◀</button>
            <button onClick={() => scroll(1)} className="scheduled-btn">▶</button>
          </div>
        )}
      </div>

      <div className="scheduled-carousel-viewport">
        <div ref={trackRef} className="scheduled-carousel-track">
          {events.map((event) => (
            <div key={event.eventId} className="scheduled-carousel-card-wrapper">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
