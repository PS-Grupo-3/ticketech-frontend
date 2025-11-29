import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createVenue, getVenueTypes } from "../api/venueApi";
import Layout from "../../../shared/components/Layout";

interface VenueType {
  venueTypeId: number;
  name: string;
}

interface FormData {
  name: string;
  venueTypeId: number;
  address: string;
  mapUrl: string;
  backgroundImageUrl: string;
}

export default function VenueCreatePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    venueTypeId: 0,
    address: "",
    mapUrl: "",
    backgroundImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModelModal, setShowModelModal] = useState(false);
  const [createdVenueId, setCreatedVenueId] = useState<string | null>(null);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const types = await getVenueTypes();
        setVenueTypes(types);
        if (types.length > 0) {
          setFormData((prev) => ({ ...prev, venueTypeId: types[0].venueTypeId }));
        }
      } catch {
        setError("No se pudieron cargar los tipos de espacio.");
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || formData.venueTypeId <= 0) {
      setError("Nombre y Tipo son obligatorios.");
      return;
    }

    try {
      const dataToSubmit = {
        name: formData.name,
        venueTypeId: formData.venueTypeId,
        address: formData.address || null,
        mapUrl: formData.mapUrl || null,
        backgroundImageUrl: formData.backgroundImageUrl || null,
      };

      const newVenue = await createVenue(dataToSubmit);
      setCreatedVenueId(newVenue.venueId);
      setShowModelModal(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const handleGoToEditor = () => {
    if (createdVenueId) navigate(`/venue/editor/${createdVenueId}`);
  };

  const handleGoToList = () => navigate("/venues");

  return (
    <Layout>
      <div className="bg-neutral-950 text-white">
        <div className="max-w-lg mx-auto pt-12 pb-16 px-8">
          <h1 className="text-4xl font-extrabold mb-8">Crear Nuevo Espacio</h1>

          <form
            onSubmit={handleSubmit}
            className="w-full bg-neutral-900 p-8 rounded-lg shadow-lg"
          >
            <div className="mb-4">
              <label className="block text-sm text-neutral-300">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-neutral-300">Tipo</label>
              <select
                name="venueTypeId"
                value={formData.venueTypeId}
                onChange={handleChange}
                className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded p-2"
              >
                {venueTypes.map((t) => (
                  <option key={t.venueTypeId} value={t.venueTypeId}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-neutral-300">Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-neutral-300">URL del Mapa</label>
              <input
                type="text"
                name="mapUrl"
                value={formData.mapUrl}
                onChange={handleChange}
                className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-neutral-300">Imagen de Fondo</label>
              <input
                type="text"
                name="backgroundImageUrl"
                value={formData.backgroundImageUrl}
                onChange={handleChange}
                className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded p-2"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex justify-between mt-6">
              <Link to="/venues" className="text-neutral-400">
                Cancelar
              </Link>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white"
              >
                Guardar Espacio
              </button>
            </div>
          </form>
        </div>

        {showModelModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-neutral-800 p-8 rounded-xl border border-neutral-700 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Espacio Creado!</h2>
              <p className="text-neutral-300 mb-6">
                ¿Querés empezar a modelar sectores?
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoToEditor}
                  className="w-full py-3 bg-blue-600 rounded-md text-white"
                >
                  Ir al modelador
                </button>
                <button
                  onClick={handleGoToList}
                  className="w-full py-3 bg-neutral-700 rounded-md text-white"
                >
                  Volver a la lista
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}