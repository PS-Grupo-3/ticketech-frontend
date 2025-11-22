import { useEffect, useState } from "react";
import { getEvents } from "../../../modules/event/api/eventApi";
import { Link } from "react-router-dom";
import EventFilters from "../../../shared/pages/Home/EventFilters";
import EventCard from "../../../shared/pages/Home/EventCard";
import Layout from "../../../shared/components/Layout";
import "../../../shared/pages/Home/css/HomePage.css";
import { useLocation } from "react-router-dom";

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

export default function EventListPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters]);

  // dentro del componente EventListPage
    const location = useLocation();
    const showMenu = location.pathname === "/event"; // solo en EventListPage

  return (
    <Layout>
        <div className="home-container">
        <div className="flex justify-between items-center mb-4">
            <h2 className="home-title">Eventos</h2>
            <Link
            to="/event/create"
            className="create-event-btn"
            >
            Crear Nuevo Evento
            </Link>
        </div>

        <EventFilters onChange={setFilters} />

        {loading ? (
            <p className="mt-10 text-lg">Cargando eventos...</p>
        ) : (
            <div className="home-grid">
            {events.map((event) => (
                <EventCard key={event.eventId} event={event} showMenu={showMenu} />
            ))}
            </div>
        )}
        </div>

        <br />
    </Layout>
  );
}
