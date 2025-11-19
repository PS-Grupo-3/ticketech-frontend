import { useEffect, useState } from "react";
import { getEvents } from "../../../modules/event/api/eventApi";
import HeroCarousel from "./HeroCarousel";
import EventFilters from "./EventFilters";
import ScheduledEventsCarousel from "./ScheduledEventsCarousel";
import EventCard from "./EventCard";
import Layout from "../../components/Layout";
import PromotionsCarousel from "./PromotionsCarousel";

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
  const [visibleCount, setVisibleCount] = useState(8); // ⭐ NEW
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
      setVisibleCount(8); // ⭐ reset cada vez que cambian los filtros
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const scheduledEvents = events.filter((e) => e.status === "Scheduled");

  const visibleEvents = events.slice(0, visibleCount); // ⭐ los que mostramos

  return (
    <Layout>
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-6 mt-10 pb-20">
        <h2 className="text-4xl font-bold mb-6">Eventos</h2>

        <EventFilters onChange={setFilters} />

        {loading ? (
          <p className="mt-10 text-lg">Cargando eventos...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
              {visibleEvents.map((event) => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>

            {visibleCount < events.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount(visibleCount + 8)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-lg text-lg"
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
