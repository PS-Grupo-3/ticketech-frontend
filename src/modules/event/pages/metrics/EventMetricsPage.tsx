import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../../shared/components/Layout";
import { getEventMetrics } from "../../api/eventApi";

import {
  categoryTranslate,
  categoryTypeTranslate,
  statusTranslate
} from "../../utils/eventTranslate";

export default function EventMetricsPage() {
  const { eventId } = useParams();

  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getEventMetrics(eventId!);
      setMetrics(data);
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
        <div className="p-10 text-white">Cargando métricas...</div>
      </Layout>
    );
  }

  if (!metrics) {
    return (
      <Layout>
        <div className="p-10 text-white">No se encontraron métricas</div>
      </Layout>
    );
  }

  const theme = metrics.themeColor || "#1e40af";

  const translatedCategory =
    categoryTranslate[metrics.category] ?? metrics.category;

  const translatedType =
    categoryTypeTranslate[metrics.type] ?? metrics.type;

  const translatedStatus =
    statusTranslate[metrics.status] ?? metrics.status;

  return (
    <Layout>
      <div className="w-full bg-neutral-900 pb-24">

        <div className="relative w-full h-[420px]">
          {metrics.bannerImageUrl ? (
            <img
              src={metrics.bannerImageUrl}
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
                {metrics.thumbnailUrl ? (
                  <img
                    src={metrics.thumbnailUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Sin thumbnail</span>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-5xl font-extrabold text-white tracking-tight">
                  {metrics.name}
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
                  {metrics.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-sm">
              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
                <p className="text-gray-400">Fecha y hora</p>
                <p className="text-white font-semibold text-lg">
                  {metrics.time}
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
                <p className="text-gray-400">Dirección</p>
                <p className="text-white font-semibold text-lg">
                  {metrics.address}
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
                <p className="text-gray-400">Estado</p>
                <p className="text-white font-semibold text-lg">
                  {translatedStatus}
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-10">Métricas generales</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
              <MetricCard title="Asientos totales" value={metrics.totalSeats} />
              <MetricCard title="Vendidos" value={metrics.soldSeats} />
              <MetricCard title="Disponibles" value={metrics.availableSeats} />
              <MetricCard title="Ocupación (%)" value={metrics.ocupancyRate.toFixed(2) + "%"} />
              <MetricCard title="Recaudación total" value={`$${metrics.totalRenueve}`} />
            </div>

            <h2 className="text-2xl font-bold text-white mt-10">Por sector</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {metrics.sectors.map((s: any) => (
                <MetricCard
                  key={s.sectorId}
                  title={s.name}
                  value={`${s.soldSeats}/${s.totalSeats} (${s.occupancyRate.toFixed(2)}%)`}
                  extra={`Recaudado: $${s.renueve}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 shadow-xl space-y-6">
            <h3 className="text-2xl font-bold text-white">Ubicación</h3>

            {metrics.mapUrl ? (
              <iframe
                src={metrics.mapUrl}
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

        </div>
      </div>
    </Layout>
  );
}

/* Tarjeta reutilizable */
function MetricCard({ title, value, extra }: any) {
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
      {extra && <p className="text-gray-300 mt-1">{extra}</p>}
    </div>
  );
}
