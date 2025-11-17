import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createVenue, getVenueTypes } from "../api/venueApi";

interface VenueType {
  venueTypeId: number;
  name: string;
}
interface FormData {
  name: string;
  backgroundImageUrl: string;
  totalCapacity: number;
  venueTypeId: number;
  address: string;
  mapUrl: string;
}

export default function VenueCreatePage() {
  const navigate = useNavigate();
  const [venueTypes, setVenueTypes] = useState<VenueType[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    backgroundImageUrl: "",
    totalCapacity: 0,
    venueTypeId: 0,
    address: "",
    mapUrl: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTypes = async () => {
      const types = await getVenueTypes();
      setVenueTypes(types);
      if (types.length > 0) {
        setFormData((prev) => ({ ...prev, venueTypeId: types[0].venueTypeId }));
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
      setError("Nombre, Capacidad y Tipo son obligatorios.");
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        mapUrl: formData.mapUrl || null,
        location: formData.backgroundImageUrl || null,
      };

      const newVenue = await createVenue(dataToSubmit);
      navigate(`/venue/editor/${newVenue.venueId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white p-8">
      <h1 className="text-4xl font-extrabold mb-8">Crear Nuevo Venue</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-neutral-900 p-8 rounded-lg shadow-lg">
        {/* Campo Nombre */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300">Nombre</label>
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
            <label htmlFor="totalCapacity" className="block text-sm font-medium text-neutral-300">Capacidad Total</label>
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
            <label htmlFor="venueTypeId" className="block text-sm font-medium text-neutral-300">Tipo de Venue</label>
            <select
              id="venueTypeId"
              name="venueTypeId"
              value={formData.venueTypeId}
              onChange={handleChange}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm text-white p-2"
            >
              <option value={0} disabled>Seleccione un tipo...</option>
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
          <label htmlFor="address" className="block text-sm font-medium text-neutral-300">Dirección (Opcional)</label>
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
        <div className="mb-6">
          <label htmlFor="mapUrl" className="block text-sm font-medium text-neutral-300">URL del Mapa (Opcional)</label>
          <input
            type="text"
            id="mapUrl"
            name="mapUrl"
            value={formData.mapUrl}
            onChange={handleChange}
            className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm text-white p-2"
          />
        </div>

        {/* Campo Map URL */}
        <div className="mb-6">
          <label htmlFor="backgroundImageUrl" className="block text-sm font-medium text-neutral-300">backgroundImageUrl (Opcional)</label>
          <input
            type="text"
            id="backgroundImageUrl"
            name="backgroundImageUrl"
            value={formData.backgroundImageUrl}
            onChange={handleChange}
            className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md shadow-sm text-white p-2"
          />
        </div>
        {formData.backgroundImageUrl && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-300">Previsualización:</label>
            <img
              src={formData.backgroundImageUrl}
              alt="Previsualización de la imagen de fondo"
              className="mt-2 w-full h-32 object-cover rounded-lg border border-neutral-700"
              
              onError={(e) => (e.currentTarget.style.display = 'none')}
              onLoad={(e) => (e.currentTarget.style.display = 'block')}
            />
          </div>)}

        {/* Error y Botones */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="flex justify-between items-center">
          <Link to="/venue" className="text-neutral-400 hover:text-white">Cancelar</Link>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            Guardar Venue
          </button>
        </div>
      </form>
    </div>
  );
}