import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVenues } from "../api/venueApi";
import Layout from "../../../shared/components/Layout";
import VenueCard from "../components/VenueCard";
import "../../../shared/pages/Home/css/EventList.css";

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
      console.error("Failed to load espacios:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="page-container">
          <p>Cargando espacios...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">Espacios</h1>
            <p className="page-subtitle">Selecciona un espacio para editar</p>
          </div>

          <Link to="/venue/create" className="create-button">
            Crear Nuevo Espacio
          </Link>
        </div>

        <div className="event-list">
          {venues.map((venue) => (
            <VenueCard key={venue.venueId} venue={venue} />
          ))}
        </div>

        <footer className="page-footer">
          <Link to="/" className="footer-link">Volver al inicio</Link>
        </footer>
      </div>
    </Layout>
  );
}