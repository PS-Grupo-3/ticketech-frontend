import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getEventCategories, 
  getCategoryTypes, 
  getEventStatuses, 
  createEvent, 
  createEventSector 
} from "../api/eventApi";
import { getVenues } from "../../venue/api/venueApi";
import { getSectorsForVenue } from "../../venue/api/sectorApi";

// Interfaces
interface EventCategory { categoryId: number; name: string; }
interface EventStatus { statusId: number; name: string; }
interface CategoryType { typeId: number; name: string; eventCategory: string; }
interface Venue { venueId: string; name: string; address: string; }
interface Sector { sectorId: string; capacity: number; }

export default function AdminCreateEventPage() {
  const navigate = useNavigate();

  // Dropdowns
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [statuses, setStatuses] = useState<EventStatus[]>([]);
  const [types, setTypes] = useState<CategoryType[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  // Formulario
  const [form, setForm] = useState({
    venueId: "",
    categoryId: "" as number | "",
    typeId: "" as number | "",
    statusId: "" as number | "",
    name: "",
    description: "",
    time: "",
    address: "",
    bannerImageUrl: "",
    thumbnailUrl: "",
    themeColor: "#000000",
  });

  const [isSaving, setIsSaving] = useState(false);

  // Carga Inicial
  useEffect(() => {
    const load = async () => {
      try {
        const [cats, sts, tys, vns] = await Promise.all([
          getEventCategories(),
          getEventStatuses(),
          getCategoryTypes(),
          getVenues(),
        ]);
        setCategories(cats);
        setStatuses(sts);
        setTypes(tys);
        setVenues(vns);
      } catch (error) {
        console.error("Error cargando datos iniciales", error);
      }
    };
    load();
  }, []);

  // Filtro de Tipos en memoria
  const filteredTypes = form.categoryId
    ? types.filter((t) => t.eventCategory === categories.find(c => c.categoryId === form.categoryId)?.name)
    : [];

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // --- LÓGICA PRINCIPAL ---
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.venueId || !form.name || !form.time || !form.statusId || !form.categoryId) {
      alert("Faltan campos obligatorios.");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Crear el Evento
      const eventPayload = {
        venueId: form.venueId,
        categoryId: Number(form.categoryId),
        typeId: form.typeId ? Number(form.typeId) : null,
        statusId: Number(form.statusId),
        name: form.name,
        description: form.description,
        time: new Date(form.time).toISOString(),
        address: form.address,
        bannerImageUrl: form.bannerImageUrl || null,
        thumbnailUrl: form.thumbnailUrl || null,
        themeColor: form.themeColor || null,
      };

      const createdEvent = await createEvent(eventPayload);
      console.log("Evento creado con ID:", createdEvent.eventId);

      // 2. Buscar los sectores del Venue seleccionado (el plano base)
      const venueSectors = await getSectorsForVenue(form.venueId);

      if (Array.isArray(venueSectors) && venueSectors.length > 0) {
        // 3. Crear AUTOMÁTICAMENTE los EventSectors (Copias)
        // Recorremos cada sector del estadio y creamos su equivalente para el evento
        const sectorPromises = venueSectors.map((vs: Sector) => {
            const sectorPayload = {
                eventId: createdEvent.eventId,
                sectorId: vs.sectorId,
                capacity: vs.capacity ?? 0, // Hereda la capacidad del estadio
                price: 0,                   // Precio inicial 0
                available: true             // Habilitado por defecto
            };
            return createEventSector(sectorPayload);
        });

        // Esperamos a que se creen todos los sectores
        await Promise.all(sectorPromises);
        console.log("Sectores copiados automáticamente.");
      }

      // 4. Redirigir a la lista de eventos (o donde quieras)
      navigate("/events"); 

    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al crear el evento.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Crear nuevo evento</h1>

      <form onSubmit={handleCreateEvent} className="space-y-4 bg-neutral-900 p-6 rounded-lg shadow-lg">
        
        {/* Venue */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Venue (Estadio)</label>
          <select
            className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-blue-500 outline-none"
            value={form.venueId}
            onChange={(e) => handleChange("venueId", e.target.value)}
          >
            <option value="">Seleccioná un venue</option>
            {venues.map((v) => (
              <option key={v.venueId} value={v.venueId}>
                {v.name} — {v.address}
              </option>
            ))}
          </select>
        </div>

        {/* Nombre y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Nombre del Evento</label>
            <input
              className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-blue-500 outline-none"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Fecha y Hora</label>
            <input
              type="datetime-local"
              className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-blue-500 outline-none"
              value={form.time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
          </div>
        </div>

        {/* Descripción y Dirección */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Descripción</label>
          <textarea
            className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-blue-500 outline-none"
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">Dirección</label>
          <input
            className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-blue-500 outline-none"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        {/* Categoría, Tipo y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Categoría</label>
            <select
              className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-blue-500 outline-none"
              value={form.categoryId}
              onChange={(e) => handleChange("categoryId", e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Seleccioná</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Tipo</label>
            <select
              className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-blue-500 outline-none"
              value={form.typeId}
              onChange={(e) => handleChange("typeId", e.target.value ? Number(e.target.value) : "")}
              disabled={!form.categoryId}
            >
              <option value="">Opcional</option>
              {filteredTypes.map((t) => (
                <option key={t.typeId} value={t.typeId}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Estado</label>
            <select
              className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-blue-500 outline-none"
              value={form.statusId}
              onChange={(e) => handleChange("statusId", e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Seleccioná</option>
              {statuses.map((s) => (
                <option key={s.statusId} value={s.statusId}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* URLs y Color */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Banner URL</label>
            <input
              className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-blue-500 outline-none"
              value={form.bannerImageUrl}
              onChange={(e) => handleChange("bannerImageUrl", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Thumbnail URL</label>
            <input
              className="bg-neutral-800 p-2 rounded w-full border border-neutral-700 focus:border-blue-500 outline-none"
              value={form.thumbnailUrl}
              onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-300">Color Tema</label>
            <input
              type="color"
              className="bg-neutral-800 p-1 rounded w-full h-10 border border-neutral-700 cursor-pointer"
              value={form.themeColor}
              onChange={(e) => handleChange("themeColor", e.target.value)}
            />
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 rounded font-semibold text-white transition-colors ${
              isSaving 
                ? "bg-gray-600 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700 shadow-md"
            }`}
          >
            {isSaving ? "Creando..." : "Guardar Evento"}
          </button>
        </div>
      </form>
    </div>
  );
}