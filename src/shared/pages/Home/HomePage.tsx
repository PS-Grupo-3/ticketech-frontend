import { useEffect, useState } from "react";
import { getEvents } from "../../../modules/event/api/eventApi";
import HeroCarousel from "./HeroCarousel";
import EventFilters from "./EventFilters";
import ScheduledEventsCarousel from "./ScheduledEventsCarousel";
import EventCard from "./EventCard";
import Layout from "../../components/Layout";
import PromotionsCarousel from "./PromotionsCarousel";
import "./css/HomePage.css";

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
  const [eventsActive, setEventsActive] = useState<EventItem[]>([]);
  const [eventsScheduled, setEventsScheduled] = useState<EventItem[]>([]);
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
      const all = await getEvents({});          

      const now = Date.now();
      
      const active = data.filter((e: { time: string | number | Date; status: string; }) => {
        const date = new Date(e.time).getTime();
        return e.status === "Active" && date >= now;
      });

      const scheduled = all.filter((e: { status: string; }) => e.status === "Scheduled");

      setEventsActive(active);
      setEventsScheduled(scheduled);
      setVisibleCount(8);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const visibleEvents = eventsActive.slice(0, visibleCount);

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
              {visibleEvents.map((ev) => (
                <EventCard key={ev.eventId} event={ev} />
              ))}
            </div>

            {visibleCount < eventsActive.length && (
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

        {!loading && eventsScheduled.length > 0 && (
          <ScheduledEventsCarousel events={eventsScheduled} />
        )}
      </div>

      <PromotionsCarousel />
      <br />
    </Layout>
  );
}
