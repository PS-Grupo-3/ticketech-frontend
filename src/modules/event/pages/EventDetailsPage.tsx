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

// -------------------------------------------------------
// UTIL: Detecta si un color hex es oscuro o claro
// -------------------------------------------------------
function isDark(hex: string): boolean {
  if (!hex.startsWith("#")) return false;
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return false;

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  return y < 128; // oscuro
}

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

  const dark = isDark(theme);
  const textOnTheme = dark ? "#ffffff" : "#000000";
  const soft = theme + "22";
  const medium = theme + "33";

  const translatedCategory =
    categoryTranslate[event.category] ?? event.category;

  const translatedType =
    categoryTypeTranslate[event.type] ?? event.type;

  const translatedStatus =
    statusTranslate[event.status] ?? event.status;

  return (
    <Layout>
      <div className="w-full bg-neutral-900 pb-24">

        {/* BANNER */}
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

          {/* CARD PRINCIPAL */}
          <div
            className="rounded-2xl p-8 shadow-xl"
            style={{
              backgroundColor: soft,
              border: `1px solid ${theme}`
            }}
          >
            <div className="flex flex-col md:flex-row gap-8">

              <div
                className="w-44 h-44 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: soft }}
              >
                {event.thumbnailUrl ? (
                  <img
                    src={event.thumbnailUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-300 text-sm">Sin thumbnail</span>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">
                  {event.name}
                </h1>

                <div className="mt-4 flex flex-wrap gap-3">

                  {/* CHIP PRINCIPAL */}
                  <span
                    className="px-3 py-1 rounded-md text-sm font-medium"
                    style={{
                      background: medium,
                      color: textOnTheme,
                      border: `1px solid ${theme}`
                    }}
                  >
                    {translatedCategory}
                  </span>

                  {/* RESTO DE CHIPS */}
                  <span className="px-3 py-1 rounded-md bg-neutral-900 text-gray-200 text-sm">
                    {translatedType}
                  </span>

                  <span className="px-3 py-1 rounded-md bg-neutral-900 text-gray-200 text-sm">
                    {translatedStatus}
                  </span>
                </div>

                <p className="mt-5 text-gray-200 text-base leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>

            {/* TRES CUADROS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-sm">

              {[
                { label: "Fecha y hora", value: date },
                { label: "Dirección", value: event.address },
                { label: "Estado", value: translatedStatus }
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: medium,
                    border: `1px solid ${theme}55`
                  }}
                >
                  <p className="text-gray-200">{item.label}</p>
                  <p className="text-white font-semibold text-lg">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* UBICACION */}
          <div
            className="rounded-2xl p-8 shadow-xl space-y-6"
            style={{
              backgroundColor: soft,
              border: `1px solid ${theme}`
            }}
          >
            <h3 className="text-2xl font-bold text-white">Ubicación</h3>

            {event.mapUrl ? (
              <iframe
                src={event.mapUrl}
                className="w-full h-[380px] rounded-xl"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                style={{
                  border: `1px solid ${theme}55`
                }}
              />
            ) : (
              <div
                className="w-full h-[380px] rounded-xl flex items-center justify-center text-gray-400"
                style={{
                  backgroundColor: soft,
                  border: `1px solid ${theme}55`
                }}
              >
                No se pudo cargar el mapa
              </div>
            )}
          </div>

          {/* COMPRAR ENTRADAS */}
          <div
            className="rounded-2xl p-8 shadow-xl border"
            style={{
              backgroundColor: soft,
              borderColor: theme
            }}
          >
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: textOnTheme }}
            >
              Comprar entradas
            </h2>

            <p className="text-gray-200 text-sm max-w-2xl leading-relaxed">
              Elegí tus asientos directamente desde el mapa interactivo del espacio.
              La disponibilidad se actualiza en tiempo real.
            </p>

            {/* BOTÓN ADAPTADO */}
            <button
              className="mt-6 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:scale-[1.02] transition-transform"
              style={{
                backgroundColor: theme,
                color: textOnTheme
              }}
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
