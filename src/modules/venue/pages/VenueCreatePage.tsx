import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createVenue, getVenueTypes } from "../api/sectorApi";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import LoginSidebar from "../../auth/pages/LoginSB";

// DTO para el dropdown
interface VenueType {
  venueTypeId: number;
  name: string;
}

// DTO para el formulario
interface FormData {
  name: string;
  totalCapacity: number;
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
    totalCapacity: 0,
    venueTypeId: 0,
    address: "",
    mapUrl: "",
    backgroundImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- ESTADOS NUEVOS PARA EL POPUP ---
  const [showModelModal, setShowModelModal] = useState(false);
  const [createdVenueId, setCreatedVenueId] = useState<string | null>(null);

  // Cargar los VenueTypes
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const types = await getVenueTypes();
        setVenueTypes(types);
        if (types.length > 0) {
          setFormData((prev) => ({ ...prev, venueTypeId: types[0].venueTypeId }));
        }
      } catch (err) {
        setError("No se pudieron cargar los tipos de venue.");
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalCapacity" || name === "venueTypeId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || formData.totalCapacity <= 0 || formData.venueTypeId <= 0) {
      setError("Nombre, Capacidad (> 0) y Tipo son obligatorios.");
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        address: formData.address || null,
        mapUrl: formData.mapUrl || null,
        backgroundImageUrl: formData.backgroundImageUrl || null,
      };

      const newVenue = await createVenue(dataToSubmit);

      // 1. Guardamos el ID
      setCreatedVenueId(newVenue.venueId);

      // 2. Mostramos modal
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
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      
      {/* 1. Navbar: Pegado arriba */}
      <Navbar onUserClick={() => setSidebarOpen(true)} />
      
      <LoginSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Contenido Principal: Crece y centra el formulario */}
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        
        <h1 className="text-4xl font-extrabold mb-8">Crear Nuevo Venue</h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-neutral-900 p-8 rounded-lg shadow-lg"
        >
          {/* Campo Nombre */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm text-white p-2"
            />
          </div>

          {/* Fila para Capacidad y Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Campo Capacidad */}
            <div>
              <label htmlFor="totalCapacity" className="block text-sm font-medium text-neutral-300">
                Capacidad Total
              </label>
              <input
                type="number"
                id="totalCapacity"
                name="totalCapacity"
                value={formData.totalCapacity}
                onChange={handleChange}
                className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm text-white p-2"
              />
            </div>
            {/* Campo Tipo de Venue */}
            <div>
              <label htmlFor="venueTypeId" className="block text-sm font-medium text-neutral-300">
                Tipo de Venue
              </label>
              <select
                id="venueTypeId"
                name="venueTypeId"
                value={formData.venueTypeId}
                onChange={handleChange}
                className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm text-white p-2"
                disabled={loading}
              >
                <option value={0} disabled>
                  Cargando tipos...
                </option>
                {venueTypes.map((type) => (
                  <option key={type.venueTypeId} value={type.venueTypeId}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo Dirección */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-neutral-300">
              Dirección (Opcional)
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm text-white p-2"
            />
          </div>

          {/* Campo Map URL */}
          <div className="mb-4">
            <label htmlFor="mapUrl" className="block text-sm font-medium text-neutral-300">
              URL del Mapa (Opcional)
            </label>
            <input
              type="text"
              id="mapUrl"
              name="mapUrl"
              value={formData.mapUrl}
              onChange={handleChange}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm text-white p-2"
            />
          </div>

          {/* Campo Background Image URL */}
          <div className="mb-4">
            <label htmlFor="backgroundImageUrl" className="block text-sm font-medium text-neutral-300">
              URL Imagen de Fondo (Opcional)
            </label>
            <input
              type="text"
              id="backgroundImageUrl"
              name="backgroundImageUrl"
              value={formData.backgroundImageUrl}
              onChange={handleChange}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm text-white p-2"
            />
          </div>

          {/* Previsualización de Imagen */}
          {formData.backgroundImageUrl && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-300">
                Previsualización:
              </label>
              <img
                src={formData.backgroundImageUrl}
                alt="Previsualización"
                className="mt-2 w-full h-32 object-cover rounded-lg border border-neutral-700"
                onError={(e) => (e.currentTarget.style.display = "none")}
                onLoad={(e) => (e.currentTarget.style.display = "block")}
              />
            </div>
          )}

          {/* Mensaje de Error */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Botones de Acción */}
          <div className="flex justify-between items-center mt-6">
            <Link to="/venues" className="text-neutral-400 hover:text-white">
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
            >
              Guardar Venue
            </button>
          </div>
        </form>
      </div>

      {/* 3. Modal de Confirmación */}
      {showModelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-neutral-700">
            <div className="mb-4 flex justify-center">
              <div className="bg-green-900/50 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              ¡Venue Creado!
            </h2>
            <p className="text-neutral-300 mb-8">
              El venue se guardó correctamente. ¿Querés empezar a modelar los sectores y asientos ahora mismo?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoToEditor}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
              >
                Sí, ir al Modelador
              </button>
              <button
                onClick={handleGoToList}
                className="w-full py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-lg transition duration-200"
              >
                No, volver a la lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Footer: Pegado abajo */}
      <Footer />
    </div>
  );
}
