import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Step1BasicInfo({ data, onNext, onBack }: any) {
  const [local, setLocal] = useState({
    ...data,
    time: data.time ?? "2025-01-01T00:00"
  });

  const today = new Date().toISOString().split("T")[0];

  const MAX_NAME = 100;
  const MAX_DESCRIPTION = 500;
  const MAX_WORD = 15;

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!local.name || !local.description || !local.time || !local.bannerImageUrl || !local.thumbnailUrl)
      return false;

    const eventDate = local.time.split("T")[0];
    if (eventDate < today)
      return false;

    if (local.name.length > MAX_NAME || local.description.length > MAX_DESCRIPTION)
      return false;

    return true;
  };

  const isValid = validate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "name" | "description"
  ) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/);

    if (words.some(w => w.length > MAX_WORD)) return;

    setLocal({ ...local, [field]: value });
  };

  const handleNext = () => {
    if (!isValid) {
      setError("Por favor corrige los errores antes de continuar.");
      return;
    }
    setError(null);
    onNext(local);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Información básica</h2>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nombre del evento
          </label>
          <input
            maxLength={MAX_NAME}
            className={`w-full bg-neutral-800 border px-3 py-2 text-sm rounded-md
              ${local.name.length >= MAX_NAME ? "border-red-500" : "border-neutral-700"}
            `}
            placeholder="Ej: Noche Electrónica - Edición 2025"
            value={local.name}
            onChange={(e) => handleInputChange(e, "name")}
          />
          <p className="text-xs text-gray-500 mt-1">
            {local.name.length}/{MAX_NAME}
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Descripción</label>
          <textarea
            maxLength={MAX_DESCRIPTION}
            className={`w-full bg-neutral-800 border px-3 py-2 text-sm rounded-md min-h-[90px]
              ${local.description.length >= MAX_DESCRIPTION ? "border-red-500" : "border-neutral-700"}
            `}
            placeholder="Detalles sobre artistas, temática, duración..."
            value={local.description}
            onChange={(e) => handleInputChange(e, "description")}
          />
          <p className="text-xs text-gray-500 mt-1">
            {local.description.length}/{MAX_DESCRIPTION}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Fecha</label>
            <input
              type="date"
              min={today}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm"
              value={local.time.split("T")[0]}
              onChange={(e) =>
                setLocal({ ...local, time: `${e.target.value}T${local.time.split("T")[1]}` })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Hora</label>
            <input
              type="time"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm"
              value={local.time.split("T")[1]}
              onChange={(e) => {
                const date = local.time.split("T")[0];
                setLocal({ ...local, time: `${date}T${e.target.value}` });
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-300 mb-1">Banner principal</label>
            <input
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm"
              placeholder="https://..."
              value={local.bannerImageUrl}
              onChange={(e) => setLocal({ ...local, bannerImageUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1">Miniatura</label>
            <input
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm"
              placeholder="https://..."
              value={local.thumbnailUrl}
              onChange={(e) => setLocal({ ...local, thumbnailUrl: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-1">Color del tema</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="w-12 h-10 border border-neutral-700 rounded"
              value={local.themeColor || "#000000"}
              onChange={(e) => setLocal({ ...local, themeColor: e.target.value })}
            />

            <input
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm"
              placeholder="#ff2244"
              value={local.themeColor || ""}
              onChange={(e) => setLocal({ ...local, themeColor: e.target.value })}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

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
          disabled={!isValid}
          onClick={handleNext}
          className={`px-5 py-2 text-sm rounded-md text-white font-semibold
            ${isValid
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-500 cursor-not-allowed opacity-50"
            }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
