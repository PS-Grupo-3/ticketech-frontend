import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEventCategories,
  getCategoryTypes,
  getEventStatuses,
  createEvent,
  getEventById,
  getEventSectors,
  createEventSector,
  updateEventSector,
} from "../api/eventApi";
import { getVenues } from "../../venue/api/venueApi";
import { getSectorsForVenue } from "../../venue/api/sectorApi";

type Step = "details" | "sectors";

interface EventCategory {
  categoryId: number;
  name: string;
}

interface EventStatus {
  statusId: number;
  name: string;
}

interface CategoryType {
  typeId: number;
  name: string;
  eventCategory: string;
}

interface Venue {
  venueId: string;
  name: string;
  address: string;
  totalCapacity: number;
}

interface Sector {
  sectorId: string;
  name: string;
  capacity: number;
}

interface EventSector {
  eventSectorId: string;
  eventId: string;
  sectorId: string;
  capacity: number;
  price: number;
  available: boolean;
  sectorName?: string;
}

export default function AdminCreateEventPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("details");

  // cat / status / tipos / venues
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [statuses, setStatuses] = useState<EventStatus[]>([]);
  const [types, setTypes] = useState<CategoryType[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  // formulario de evento
  const [form, setForm] = useState<{
    venueId: string;
    categoryId: number | "";
    typeId: number | "";
    statusId: number | "";
    name: string;
    description: string;
    time: string;
    address: string;
    bannerImageUrl: string;
    thumbnailUrl: string;
    themeColor: string;
  }>({
    venueId: "",
    categoryId: "",
    typeId: "",
    statusId: "",
    name: "",
    description: "",
    time: "",
    address: "",
    bannerImageUrl: "",
    thumbnailUrl: "",
    themeColor: "",
  });

  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [createdVenueId, setCreatedVenueId] = useState<string | null>(null);

  // configuración de sectores del evento
  const [eventSectors, setEventSectors] = useState<EventSector[]>([]);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [savingSectorId, setSavingSectorId] = useState<string | null>(null);

  // ---------- CARGA INICIAL ----------

  useEffect(() => {
    const load = async () => {
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
    };

    load();
  }, []);

  // filtrar tipos por categoría
  const filteredTypes = form.categoryId
    ? types.filter((t) => t.eventCategory === categories.find(c => c.categoryId === form.categoryId)?.name)
    : [];

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ---------- PASO 1: CREAR EVENTO ----------

  const handleCreateEvent = async () => {
    if (!form.venueId || !form.name || !form.time || !form.statusId || !form.categoryId) {
      alert("Completá al menos: venue, nombre, fecha/hora, estado y categoría.");
      return;
    }

    try {
      const payload = {
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

      const created = await createEvent(payload);
      const full = await getEventById(created.eventId);

      setCreatedEventId(full.eventId);
      setCreatedVenueId(full.venueId);
      setStep("sectors");
    } catch (err) {
      console.error(err);
      alert("Error creando el evento.");
    }
  };

  // ---------- PASO 2: CONFIGURAR EVENT SECTORS ----------

  useEffect(() => {
    if (step === "sectors" && createdEventId && createdVenueId) {
      loadEventSectors(createdEventId, createdVenueId);
    }
  }, [step, createdEventId, createdVenueId]);

  const loadEventSectors = async (eventId: string, venueId: string) => {
    setLoadingSectors(true);
    try {
      const [venueSectorsRaw, eventSectorsRaw] = await Promise.all([
        getSectorsForVenue(venueId),
        getEventSectors(eventId),
      ]);

      const venueSectors: Sector[] = Array.isArray(venueSectorsRaw)
        ? venueSectorsRaw.map((s: any) => ({
            sectorId: s.sectorId,
            name: s.name,
            capacity: s.capacity,
          }))
        : [];

      let finalEventSectors: EventSector[] = [];

      if (Array.isArray(eventSectorsRaw) && eventSectorsRaw.length > 0) {
        // Ya existen EventSectors, los usamos
        finalEventSectors = eventSectorsRaw.map((es: any) => {
          const base = venueSectors.find((vs) => vs.sectorId === es.sectorId);
          return {
            eventSectorId: es.eventSectorId,
            eventId: es.eventId,
            sectorId: es.sectorId,
            capacity: es.capacity,
            price: es.price,
            available: es.available,
            sectorName: base?.name ?? es.sectorId,
          };
        });
      } else {
        // No existen -> los creamos clonando los sectores del venue
        const created: EventSector[] = [];
        for (const vs of venueSectors) {
          const payload = {
            eventId,
            sectorId: vs.sectorId,
            capacity: vs.capacity,
            price: 0,
            available: true,
          };
          const es = await createEventSector(payload);
          created.push({
            eventSectorId: es.eventSectorId,
            eventId: es.eventId,
            sectorId: es.sectorId,
            capacity: es.capacity,
            price: es.price,
            available: es.available,
            sectorName: vs.name,
          });
        }
        finalEventSectors = created;
      }

      setEventSectors(finalEventSectors);
    } catch (err) {
      console.error(err);
      alert("Error cargando sectores del evento.");
    } finally {
      setLoadingSectors(false);
    }
  };

  const updateLocalEventSector = (id: string, changes: Partial<EventSector>) => {
    setEventSectors((prev) =>
      prev.map((es) => (es.eventSectorId === id ? { ...es, ...changes } : es))
    );
  };

  const handleSaveSector = async (sector: EventSector) => {
    setSavingSectorId(sector.eventSectorId);
    try {
      await updateEventSector({
        eventSectorId: sector.eventSectorId,
        capacity: sector.capacity,
        price: sector.price,
        available: sector.available,
      });
    } catch (err) {
      console.error(err);
      alert("Error guardando sector.");
    } finally {
      setSavingSectorId(null);
    }
  };

  const handleFinish = () => {
    if (!createdEventId) return;
    // Redirigís donde quieras: a la lista de eventos, detalle, etc.
    navigate(`/event/${createdEventId}`);
  };

  // ---------- RENDER ----------

  return (
    <div className="max-w-6xl mx-auto text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Crear evento</h1>

      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded ${
            step === "details" ? "bg-red-600" : "bg-neutral-800"
          }`}
          onClick={() => setStep("details")}
          disabled={!createdEventId && step === "sectors"}
        >
          1. Detalles
        </button>
        <button
          className={`px-4 py-2 rounded ${
            step === "sectors" ? "bg-red-600" : "bg-neutral-800"
          }`}
          onClick={() => createdEventId && setStep("sectors")}
          disabled={!createdEventId}
        >
          2. Sectores
        </button>
      </div>

      {step === "details" && (
        <div className="space-y-4 bg-neutral-900 p-4 rounded-lg">
          <div>
            <label className="block text-sm mb-1">Venue</label>
            <select
              className="bg-neutral-800 p-2 rounded w-full"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <input
                className="bg-neutral-800 p-2 rounded w-full"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Fecha y hora</label>
              <input
                type="datetime-local"
                className="bg-neutral-800 p-2 rounded w-full"
                value={form.time}
                onChange={(e) => handleChange("time", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Descripción</label>
            <textarea
              className="bg-neutral-800 p-2 rounded w-full"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Dirección</label>
            <input
              className="bg-neutral-800 p-2 rounded w-full"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Categoría</label>
              <select
                className="bg-neutral-800 p-2 rounded w-full"
                value={form.categoryId}
                onChange={(e) =>
                  handleChange(
                    "categoryId",
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              >
                <option value="">Seleccioná</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Tipo</label>
              <select
                className="bg-neutral-800 p-2 rounded w-full"
                value={form.typeId}
                onChange={(e) =>
                  handleChange(
                    "typeId",
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              >
                <option value="">Opcional</option>
                {filteredTypes.map((t) => (
                  <option key={t.typeId} value={t.typeId}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Estado</label>
              <select
                className="bg-neutral-800 p-2 rounded w-full"
                value={form.statusId}
                onChange={(e) =>
                  handleChange(
                    "statusId",
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              >
                <option value="">Seleccioná</option>
                {statuses.map((s) => (
                  <option key={s.statusId} value={s.statusId}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Banner URL</label>
              <input
                className="bg-neutral-800 p-2 rounded w-full"
                value={form.bannerImageUrl}
                onChange={(e) =>
                  handleChange("bannerImageUrl", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Thumbnail URL</label>
              <input
                className="bg-neutral-800 p-2 rounded w-full"
                value={form.thumbnailUrl}
                onChange={(e) =>
                  handleChange("thumbnailUrl", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Color tema</label>
              <input
                type="color"
                className="bg-neutral-800 p-1 rounded w-full h-10"
                value={form.themeColor || "#ff0000"}
                onChange={(e) =>
                  handleChange("themeColor", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              onClick={handleCreateEvent}
            >
              Crear evento y configurar sectores
            </button>
          </div>
        </div>
      )}

      {step === "sectors" && createdEventId && createdVenueId && (
        <div className="bg-neutral-900 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            Sectores del evento
          </h2>

          {loadingSectors ? (
            <p>Cargando sectores…</p>
          ) : (
            <div className="space-y-3">
              {eventSectors.map((es) => (
                <div
                  key={es.eventSectorId}
                  className="flex items-center gap-4 bg-neutral-800 p-3 rounded"
                >
                  <div className="flex-1">
                    <p className="font-semibold">
                      {es.sectorName ?? es.sectorId}
                    </p>
                    <p className="text-sm text-gray-400">
                      Sector del venue
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">
                      Habilitado
                    </label>
                    <input
                      type="checkbox"
                      checked={es.available}
                      onChange={(e) =>
                        updateLocalEventSector(es.eventSectorId, {
                          available: e.target.checked,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400">
                      Capacidad a la venta
                    </label>
                    <input
                      type="number"
                      className="bg-neutral-900 p-1 rounded w-28"
                      min={0}
                      value={es.capacity}
                      onChange={(e) =>
                        updateLocalEventSector(es.eventSectorId, {
                          capacity: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400">
                      Precio
                    </label>
                    <input
                      type="number"
                      className="bg-neutral-900 p-1 rounded w-28"
                      min={0}
                      value={es.price}
                      onChange={(e) =>
                        updateLocalEventSector(es.eventSectorId, {
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                      onClick={() => handleSaveSector(es)}
                      disabled={savingSectorId === es.eventSectorId}
                    >
                      {savingSectorId === es.eventSectorId
                        ? "Guardando..."
                        : "Guardar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              onClick={handleFinish}
            >
              Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
