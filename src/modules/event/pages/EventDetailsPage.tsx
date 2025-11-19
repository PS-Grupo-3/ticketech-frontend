import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../shared/components/Layout";
import { getEventById } from "../api/eventApi";
import { format } from "date-fns";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEventById(eventId!);
      setEvent(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="w-full text-center py-10">Cargando evento...</div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="w-full text-center py-10">Evento no encontrado</div>
      </Layout>
    );
  }

  const date = event.time ? format(new Date(event.time), "dd/MM/yyyy HH:mm") : "Sin fecha";
  const theme = event.themeColor || "#1e40af";

  return (
    <Layout>
      <div className="w-full bg-neutral-900 pb-24">

        <div className="relative w-full h-[380px]">
          {event.bannerImageUrl ? (
            <img
              src={event.bannerImageUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-neutral-900" />
        </div>
        <div className="max-w-5xl mx-auto px-6 -mt-28 relative z-10 space-y-10">

          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-xl">

            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-40 h-40 rounded-lg overflow-hidden bg-neutral-700 flex items-center justify-center">
                {event.thumbnailUrl ? (
                  <img
                    src={event.thumbnailUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Sin<br/>thumbnail</span>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white">{event.name}</h1>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className="px-3 py-1 rounded-md text-sm font-medium"
                    style={{
                      background: theme + "33",
                      color: theme,
                      border: `1px solid ${theme}`
                    }}
                  >
                    {event.category}
                  </span>

                  <span className="px-3 py-1 rounded-md bg-neutral-900 text-gray-200 text-sm">
                    {event.type}
                  </span>

                  <span className="px-3 py-1 rounded-md bg-neutral-900 text-gray-200 text-sm">
                    {event.status}
                  </span>
                </div>

                <p className="mt-4 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-sm">
              <div>
                <p className="text-gray-400">Fecha y hora</p>
                <p className="text-white font-semibold">{date}</p>
              </div>

              <div>
                <p className="text-gray-400">Dirección</p>
                <p className="text-white font-semibold">{event.address}</p>
              </div>
            </div>
          </div>
          
          <div
            className="rounded-xl p-6 shadow-xl border"
            style={{
              backgroundColor: theme + "22",
              borderColor: theme,
            }}
          >
            <h2 className="text-2xl font-bold mb-3" style={{ color: theme }}>
              ¿Querés comprar entradas para {event.name}?
            </h2>

            <p className="text-gray-200 text-sm max-w-2xl">
              Accedé al mapa de asientos y comprá tus entradas seleccionando el sector,
              la ubicación y la cantidad exacta. La disponibilidad se actualiza en tiempo real.
            </p>

            <div className="mt-6">
              <button
                className="px-8 py-3 rounded-lg text-black font-semibold text-lg shadow-lg hover:scale-[1.02] transition-transform"
                style={{ backgroundColor: theme }}
                onClick={() => navigate(`/event/${event.eventId}/venue`)}
              >
                Ver mapa de asientos
              </button>
            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-semibold text-white">Información general</h3>

            <p className="text-gray-300 text-sm">
              Este evento se encuentra activo y los sectores se asignaron desde el Venue seleccionado.
            </p>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Sectores disponibles</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                {event.sectors?.map((s: any) => (
                  <li key={s.eventSectorId}>
                    • Sector {s.eventSectorId.substring(0, 6)} — Capacidad: {s.capacity} — Precio: ${s.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
