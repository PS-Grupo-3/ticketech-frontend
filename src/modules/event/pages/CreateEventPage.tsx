import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getVenues } from "../../venue/api/venueApi"; 
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import LoginSidebar from "../../auth/pages/LoginSB";
import {
  getEventCategories,
  getCategoryTypes,
  getEventStatuses,
  createEvent,
} from "../api/eventApi";

// Interfaces
interface Venue { venueId: string; name: string; } // <-- Interface para Venue
interface EventCategory { categoryId: number; name: string; }
interface CategoryTypeFromApi { typeId: number; name: string; eventCategory: string; }
interface EventStatus { statusId: number; name: string; }

export default function CreateEventPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    venueId: "",
    categoryId: 0,
    typeId: 0,
    statusId: 0,
    name: "",
    description: "",
    time: "",
    address: "",
    bannerImageUrl: "",
    thumbnailUrl: "",
    themeColor: "#FFFFFF",
  });
  
  // 2. Estado para Venues
  const [venues, setVenues] = useState<Venue[]>([]); 
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [statuses, setStatuses] = useState<EventStatus[]>([]);
  const [allTypes, setAllTypes] = useState<CategoryTypeFromApi[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<CategoryTypeFromApi[]>([]);
  
  const [error, setError] = useState<string | null>(null);

  // Carga inicial
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 3. Cargar Venues junto con lo demás
        const [venuesData, categoriesData, statusesData, allTypesData] = await Promise.all([
          getVenues(), // <-- Llamada al VenueService
          getEventCategories(),
          getEventStatuses(),
          getCategoryTypes(),
        ]);
        
        setVenues(venuesData); // Guardar venues
        setCategories(categoriesData);
        setStatuses(statusesData);
        setAllTypes(allTypesData);

        // Valores por defecto
        if (venuesData.length > 0) {
             setFormData(prev => ({ ...prev, venueId: venuesData[0].venueId }));
        }
        if (categoriesData.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: categoriesData[0].categoryId }));
        }
        if (statusesData.length > 0) {
            setFormData(prev => ({ ...prev, statusId: statusesData[0].statusId }));
        }
        
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos iniciales.");
      }
    };
    loadInitialData();
  }, []);

  // ... (El useEffect de Tipos sigue igual) ...
  useEffect(() => {
    if (formData.categoryId > 0) {
        const selectedCategoryName = categories.find(
            c => c.categoryId === formData.categoryId
        )?.name;

        if (selectedCategoryName) {
            const typesForCategory = allTypes.filter(
                t => t.eventCategory === selectedCategoryName
            );
            setFilteredTypes(typesForCategory); 
            if (typesForCategory.length > 0) {
                setFormData(prev => ({ ...prev, typeId: typesForCategory[0].typeId }));
            } else {
                setFormData(prev => ({ ...prev, typeId: 0 }));
            }
        }
    }
  }, [formData.categoryId, categories, allTypes]);

  // ... (handleChange y handleSubmit siguen igual) ...
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: (name === "categoryId" || name === "typeId" || name === "statusId") ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name || !formData.time || !formData.address || !formData.venueId) {
        setError("VenueId, Nombre, Fecha/Hora y Dirección son obligatorios.");
        return;
    }
    try {
      const dataToSubmit = {
        ...formData,
        typeId: formData.typeId || null,
        bannerImageUrl: formData.bannerImageUrl || null,
        thumbnailUrl: formData.thumbnailUrl || null,
      };
      await createEvent(dataToSubmit);
      navigate("/events"); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el evento");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
      <Navbar onUserClick={() => setSidebarOpen(true)} />
      <LoginSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col items-center justify-center p-8 flex-grow w-full">
        <h1 className="text-4xl font-extrabold mb-8">Crear Nuevo Evento</h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-neutral-900 p-8 rounded-lg shadow-lg">
          
          <div className="mb-4">
            <label htmlFor="venueId" className="block text-sm font-medium text-neutral-300">Venue ID (GUID)</label>
            <input
              type="text"
              id="venueId"
              name="venueId"
              value={formData.venueId}
              onChange={handleChange}
              placeholder="Pegá el GUID del Venue aquí..."
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-300">Nombre del Evento</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-neutral-300">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-medium text-neutral-300">Fecha y Hora</label>
            <input
              type="datetime-local"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-neutral-300">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
            />
          </div>

          {/* Dropdowns de Categoría y Tipo (Ahora funcionan con filtrado local) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-neutral-300">Categoría</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
              >
                <option value={0} disabled>Cargando...</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="typeId" className="block text-sm font-medium text-neutral-300">Tipo</label>
              <select
                id="typeId"
                name="typeId"
                value={formData.typeId}
                onChange={handleChange}
                disabled={filteredTypes.length === 0}
                className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
              >
                {filteredTypes.length > 0 ? (
                  filteredTypes.map((type) => (
                    <option key={type.typeId} value={type.typeId}>{type.name}</option>
                  ))
                ) : (
                  <option value={0}>Seleccione una categoría</option>
                )}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="statusId" className="block text-sm font-medium text-neutral-300">Estado</label>
              <select
                id="statusId"
                name="statusId"
                value={formData.statusId}
                onChange={handleChange}
                className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
              >
                <option value={0} disabled>Cargando...</option>
                {statuses.map((status) => (
                  <option key={status.statusId} value={status.statusId}>{status.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="themeColor" className="block text-sm font-medium text-neutral-300">Color (Hex)</label>
              <input
                type="text"
                id="themeColor"
                name="themeColor"
                value={formData.themeColor}
                onChange={handleChange}
                className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="bannerImageUrl" className="block text-sm font-medium text-neutral-300">URL de Banner (Opcional)</label>
            <input
              type="text"
              id="bannerImageUrl"
              name="bannerImageUrl"
              value={formData.bannerImageUrl}
              onChange={handleChange}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-neutral-300">URL de Miniatura (Opcional)</label>
            <input
              type="text"
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="mt-1 block w-full bg-neutral-800 border-neutral-700 rounded-md p-2"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end items-center mt-6">
            <Link to="/" className="text-neutral-400 hover:text-white mr-4">Cancelar</Link>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
            >
              Guardar Evento
            </button>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}