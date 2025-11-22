import { useEffect, useState } from "react";
import { getEvents } from "../../../modules/event/api/eventApi";
import HeroCarousel from "./HeroCarousel";
import EventFilters from "./EventFilters";
import ScheduledEventsCarousel from "./ScheduledEventsCarousel";
import EventCard from "./EventCard";
import Layout from "../../components/Layout";
import PromotionsCarousel from "./PromotionsCarousel";
import "./css/HomePage.css"

interface EventItem {
  eventId: string;
  venueId: string;
  name: string;
  category: string;
  categoryType: string;
  status: string;
  time: string;
  address: string;
  thumbnailUrl?: string | null;
}

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8); 
  const [filters, setFilters] = useState<{
    categoryId?: number;
    statusId?: number;
    from?: string;
    to?: string;
    search?: string;
  }>({});

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents(filters);
      setEvents(data);
      setVisibleCount(8); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const scheduledEvents = events.filter((e) => e.status === "Scheduled");

  const visibleEvents = events.slice(0, visibleCount);

  return (
    <Layout>
      <HeroCarousel />

      <div className="home-container">
        <h2 className="home-title">Eventos</h2>

        <EventFilters onChange={setFilters} />

        {loading ? (
          <p className="mt-10 text-lg">Cargando eventos...</p>
        ) : (
          <>
            <div className="home-grid">
              {visibleEvents.map((event) => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>

            {visibleCount < events.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount(visibleCount + 8)}
                  className="load-more-btn"
                >
                  Mostrar más
                </button>
              </div>
            )}
          </>
        )}

        {!loading && scheduledEvents.length > 0 && (
          <ScheduledEventsCarousel events={scheduledEvents} />
        )}
      </div>

      <PromotionsCarousel />

      <br></br>
    </Layout>
  );
}
