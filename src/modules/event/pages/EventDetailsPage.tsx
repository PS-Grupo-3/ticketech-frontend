import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../shared/components/Layout";
import { getEventById } from "../api/eventApi";
import { format } from "date-fns";

import {
  categoryTranslate,
  categoryTypeTranslate,
  statusTranslate
} from "../utils/eventTranslate";

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

  const date = event.time
    ? format(new Date(event.time), "dd/MM/yyyy HH:mm")
    : "Sin fecha";

  const theme = event.themeColor || "#1e40af";

  const translatedCategory =
    categoryTranslate[event.category] ?? event.category;

  const translatedType =
    categoryTypeTranslate[event.type] ?? event.type;

  const translatedStatus =
    statusTranslate[event.status] ?? event.status;

  return (
    <Layout>
      <div className="w-full bg-neutral-900 pb-24">

        <div className="relative w-full h-[420px]">
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

        <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10 space-y-14">
          
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8">

              <div className="w-44 h-44 rounded-xl overflow-hidden bg-neutral-700 flex items-center justify-center">
                {event.thumbnailUrl ? (
                  <img
                    src={event.thumbnailUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Sin thumbnail</span>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">
                  {event.name}
                </h1>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span
                    className="px-3 py-1 rounded-md text-sm font-medium"
                    style={{
                      background: theme + "33",
                      color: theme,
                      border: `1px solid ${theme}`
                    }}
                  >
                    {translatedCategory}
                  </span>

                  <span className="px-3 py-1 rounded-md bg-neutral-900 text-gray-200 text-sm">
                    {translatedType}
                  </span>

                  <span className="px-3 py-1 rounded-md bg-neutral-900 text-gray-200 text-sm">
                    {translatedStatus}
                  </span>
                </div>

                <p className="mt-5 text-gray-300 text-base leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-sm">

              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
                <p className="text-gray-400">Fecha y hora</p>
                <p className="text-white font-semibold text-lg">{date}</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
                <p className="text-gray-400">Dirección</p>
                <p className="text-white font-semibold text-lg">{event.address}</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
                <p className="text-gray-400">Estado</p>
                <p className="text-white font-semibold text-lg">{translatedStatus}</p>
              </div>

            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 shadow-xl space-y-6">
            <h3 className="text-2xl font-bold text-white">Ubicación</h3>

            {event.mapUrl ? (
              <iframe
                src={event.mapUrl}
                className="w-full h-[380px] rounded-xl border border-neutral-700"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-[380px] rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-gray-400">
                No se pudo cargar el mapa
              </div>
            )}
          </div>

          <div
            className="rounded-2xl p-8 shadow-xl border"
            style={{ backgroundColor: theme + "22", borderColor: theme }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: theme }}>
              Comprar entradas
            </h2>

            <p className="text-gray-200 text-sm max-w-2xl leading-relaxed">
              Elegí tus asientos directamente desde el mapa interactivo del espacio.
              La disponibilidad se actualiza en tiempo real.
            </p>

            <button
              className="mt-6 px-8 py-3 rounded-lg text-black font-semibold text-lg shadow-lg hover:scale-[1.02] transition-transform"
              style={{ backgroundColor: theme }}
              onClick={() => navigate(`/event/${event.eventId}/venue`)}
            >
              Ver mapa de asientos
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
