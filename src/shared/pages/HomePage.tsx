import { useEffect, useState } from "react";
import { getEvents } from "../../modules/event/api/eventApi";
import HeroCarousel from "./HeroCarousel";
import EventFilters from "./EventFilters";
import EventCard from "./EventCard";
import Layout from "../components/Layout";

interface EventItem {
  eventId: string;
  name: string;
  category: string;
  categoryType: string;
  status: string;
  time: string;
  address: string;
}

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    categoryId?: number;
    statusId?: number;
    from?: string;
    to?: string;
  }>({});

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents(filters);
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);

  return (
    <Layout onUserClick={() => {}}>
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-6 mt-10 pb-20">
        <h2 className="text-4xl font-bold mb-6">Películas en cartelera</h2>

        <EventFilters onChange={setFilters} />

        {loading ? (
          <p className="mt-10 text-lg">Cargando eventos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
            {events.map((event) => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
