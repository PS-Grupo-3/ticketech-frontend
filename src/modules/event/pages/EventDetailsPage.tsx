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

function isColorDark(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  // Luminancia según WCAG
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.5; // true → oscuro
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
  const isDark = isColorDark(theme);
  const autoText = isDark ? "#ffffff" : "#000000";
  const autoTextSecondary = isDark ? "#e5e5e5" : "#333333";

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
              backgroundColor: theme + "22",
              border: `1px solid ${theme}`,
              color: autoText
            }}
          >
            <div className="flex flex-col md:flex-row gap-8">

              <div
                className="w-44 h-44 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: theme + "22" }}
              >
                {event.thumbnailUrl ? (
                  <img
                    src={event.thumbnailUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span style={{ color: autoTextSecondary }}>Sin thumbnail</span>
                )}
              </div>

              <div className="flex-1">
                <h1
                  className="text-5xl font-extrabold tracking-tight"
                  style={{ color: autoText }}
                >
                  {event.name}
                </h1>

                <div className="mt-4 flex flex-wrap gap-3">

                  <span
                    className="px-3 py-1 rounded-md text-sm font-medium"
                    style={{
                      background: theme + "33",
                      color: autoText,
                      border: `1px solid ${theme}`
                    }}
                  >
                    {translatedCategory}
                  </span>

                  <span
                    className="px-3 py-1 rounded-md text-sm"
                    style={{
                      backgroundColor: theme + "22",
                      color: autoTextSecondary
                    }}
                  >
                    {translatedType}
                  </span>

                  <span
                    className="px-3 py-1 rounded-md text-sm"
                    style={{
                      backgroundColor: theme + "22",
                      color: autoTextSecondary
                    }}
                  >
                    {translatedStatus}
                  </span>
                </div>

                <p
                  className="mt-5 text-base leading-relaxed whitespace-pre-line"
                  style={{ color: autoTextSecondary }}
                >
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
              ].map((box, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: theme + "33",
                    border: `1px solid ${theme}55`,
                    color: autoText
                  }}
                >
                  <p style={{ color: autoTextSecondary }}>{box.label}</p>
                  <p
                    className="font-semibold text-lg"
                    style={{ color: autoText }}
                  >
                    {box.value}
                  </p>
                </div>
              ))}

            </div>
          </div>

          {/* UBICACIÓN */}
          <div
            className="rounded-2xl p-8 shadow-xl space-y-6"
            style={{
              backgroundColor: theme + "22",
              border: `1px solid ${theme}`,
              color: autoText
            }}
          >
            <h3
              className="text-2xl font-bold"
              style={{ color: autoText }}
            >
              Ubicación
            </h3>

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
                className="w-full h-[380px] rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: theme + "22",
                  border: `1px solid ${theme}55`,
                  color: autoTextSecondary
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
              backgroundColor: theme + "22",
              borderColor: theme,
              color: autoText
            }}
          >
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: autoText }}
            >
              Comprar entradas
            </h2>

            <p
              className="text-sm max-w-2xl leading-relaxed"
              style={{ color: autoTextSecondary }}
            >
              Elegí tus asientos directamente desde el mapa interactivo del venue.
              La disponibilidad se actualiza en tiempo real.
            </p>

            <button
              className="mt-6 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:scale-[1.02] transition-transform"
              style={{
                backgroundColor: theme,
                color: isDark ? "#fff" : "#000"
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
