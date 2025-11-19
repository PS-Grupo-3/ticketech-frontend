import { useState } from "react";

export default function Step1BasicInfo({ data, onNext, onBack }: any) {
  const [local, setLocal] = useState(data);

  const handleNext = () => {
    onNext(local);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Información básica</h2>
      <p className="text-sm text-gray-400">
        Datos fundamentales del evento antes de clasificarlo o elegir el venue.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">

        {/* NOMBRE */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nombre del evento
          </label>
          <input
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Ej: Noche Electrónica - Edición 2025"
            value={local.name}
            onChange={(e) => setLocal({ ...local, name: e.target.value })}
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm min-h-[90px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Detalles sobre artistas, temática, duración..."
            value={local.description}
            onChange={(e) =>
              setLocal({ ...local, description: e.target.value })
            }
          />
        </div>

        {/* FECHA Y HORA + DIRECCIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FECHA */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fecha del evento
            </label>
            <input
              type="date"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={local.time?.split("T")[0] ?? ""}
              onChange={(e) => {
                const t = local.time ?? "";
                const oldHour = t.includes("T") ? t.split("T")[1] : "00:00";
                setLocal({ ...local, time: `${e.target.value}T${oldHour}` });
              }}
            />
          </div>

          {/* HORA */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Hora del evento
            </label>
            <input
              type="time"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={local.time?.split("T")[1] ?? ""}
              onChange={(e) => {
                const date = local.time?.split("T")[0] ?? "2025-01-01";
                setLocal({ ...local, time: `${date}T${e.target.value}` });
              }}
            />
          </div>
        </div>

        {/* DIRECCIÓN */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Dirección
          </label>
          <input
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Dirección o referencia del lugar"
            value={local.address}
            onChange={(e) =>
              setLocal({ ...local, address: e.target.value })
            }
          />
        </div>

        {/* BANNER + THUMBNAIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BANNER */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Banner principal (URL)
            </label>
            <input
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="https://..."
              value={local.bannerImageUrl}
              onChange={(e) =>
                setLocal({ ...local, bannerImageUrl: e.target.value })
              }
            />
          </div>

          {/* THUMBNAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Miniatura (URL)
            </label>
            <input
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="https://..."
              value={local.thumbnailUrl}
              onChange={(e) =>
                setLocal({ ...local, thumbnailUrl: e.target.value })
              }
            />
          </div>
        </div>

        {/* COLOR DEL TEMA */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Color del tema
          </label>

          <div className="flex items-center gap-3">
            <input
              type="color"
              className="w-12 h-10 rounded cursor-pointer border border-neutral-700"
              value={local.themeColor || "#000000"}
              onChange={(e) =>
                setLocal({ ...local, themeColor: e.target.value })
              }
            />

            <input
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="#ff2244"
              value={local.themeColor}
              onChange={(e) =>
                setLocal({ ...local, themeColor: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm rounded-md border border-neutral-700 text-gray-300 hover:bg-neutral-800"
        >
          Volver
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-5 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
