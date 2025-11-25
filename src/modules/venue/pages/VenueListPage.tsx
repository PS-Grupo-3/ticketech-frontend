import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVenues } from "../api/venueApi";
import Layout from "../../../shared/components/Layout";
import "../../../shared/pages/Home/css/HomePage.css";
import "../../../shared/pages/Home/css/EventCard.css";
import defaultImage from "../../../assets/default-image.webp";

interface Venue {
  venueId: string;
  name: string;
  address: string;
  totalCapacity: number;
  backgroundImageUrl: string;
  venueType: {
    venueTypeId: number;
    name: string;
  };
}

export default function VenueListPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const data = await getVenues();
      setVenues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load venues:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="home-container">
        <div className="flex justify-between items-center mb-4">
          <h2 className="home-title">Venues</h2>
          <Link
            to="/venue/create"
            className="create-event-btn"
          >
            Crear Nuevo Venue
          </Link>
        </div>

        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-lg">Cargando venues...</p>
          </div>
        ) : (
          <div className="home-grid">
            {venues.map((venue) => (
              <article className="event-card-general" key={venue.venueId}>
                <Link
                  to={`/venue/editor/${venue.venueId}`}
                  className="event-card block h-full"
                >
                  <div className="event-card-image-wrapper">
                    <img
                      src={venue.backgroundImageUrl || defaultImage}
                      alt={venue.name}
                      className="event-card-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="event-card-content">
                    <div className="event-card-date-tittle">
                      <p className="event-card-date">{venue.address}</p>
                      <h3 className="event-card-title">{venue.name}</h3>
                    </div>
                    <div className="event-card-category-status">
                      <p className="event-card-category">{venue.venueType.name}</p>
                      <p className="event-card-status">
                        Capacidad: {venue.totalCapacity}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}