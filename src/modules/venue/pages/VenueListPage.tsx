import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVenues } from "../api/sectorApi";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <p>Loading venues...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Venues
        </h1>
        <p className="text-neutral-400 mt-2">Selecciona un venue para editar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl px-4">
        {venues.map((venue) => (
          <Link
            key={venue.venueId}
            to={`/venue/editor/${venue.venueId}`}
            className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-green-500 to-green-700 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              {venue.backgroundImageUrl && (
                <img
                  src={venue.backgroundImageUrl}
                  alt={venue.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <h2 className="text-xl font-semibold">{venue.name}</h2>
              <p className="text-sm text-neutral-200">{venue.address}</p>
              <p className="text-sm text-neutral-200">Capacidad: {venue.totalCapacity}</p>
              <p className="text-sm text-neutral-200">Tipo: {venue.venueType.name}</p>
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-12 text-neutral-600 text-sm">
        <Link to="/" className="text-blue-400 hover:underline">Volver al inicio</Link>
      </footer>
    </div>
  );
}
