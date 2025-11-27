import { useState } from "react";
import { updateEvent } from "../../api/eventApi";
import { useNavigate } from "react-router-dom";
import {
  categoryTranslate,
  categoryTypeTranslate
} from "../../utils/eventTranslate";

export default function Step3Review({ data, onBack, onUpdated, eventId }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUpdate = async () => {
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name: data.name,
        description: data.description,
        time: data.time ? new Date(data.time).toISOString() : null,
        categoryId: data.categoryId,
        typeId: data.typeId,
        bannerImageUrl: data.bannerImageUrl,
        thumbnailUrl: data.thumbnailUrl,
        themeColor: data.themeColor
      };

      const updated = await updateEvent(eventId, payload);
      navigate("/event");
      if (onUpdated) onUpdated(updated.eventId);
    } catch {
      setError("No se pudo actualizar el evento.");
    } finally {
      setLoading(false);
    }
  };

  const categoryName =
    categoryTranslate[data.categoryName] ??
    data.categoryName ??
    "Sin categoría";

  const typeName =
    categoryTypeTranslate[data.typeName] ??
    data.typeName ??
    "Sin tipo";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Revisión final</h2>
      <p className="text-sm text-gray-400 mb-4">
        Confirmá que los datos sean correctos antes de actualizar.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-2 text-gray-400">Nombre</td>
              <td className="px-4 py-2 text-gray-100">{data.name}</td>
            </tr>

            <tr className="border-b border-neutral-800">
              <td className="px-4 py-2 text-gray-400">Descripción</td>
              <td className="px-4 py-2 text-gray-100">{data.description}</td>
            </tr>

            <tr className="border-b border-neutral-800">
              <td className="px-4 py-2 text-gray-400">Fecha y hora</td>
              <td className="px-4 py-2 text-gray-100">{data.time}</td>
            </tr>

            <tr className="border-b border-neutral-800">
              <td className="px-4 py-2 text-gray-400">Categoría</td>
              <td className="px-4 py-2 text-gray-100">{categoryName}</td>
            </tr>

            <tr className="border-b border-neutral-800">
              <td className="px-4 py-2 text-gray-400">Tipo</td>
              <td className="px-4 py-2 text-gray-100">{typeName}</td>
            </tr>

            <tr className="border-b border-neutral-800">
              <td className="px-4 py-2 text-gray-400">Banner</td>
              <td className="px-4 py-2 text-gray-100">{data.bannerImageUrl}</td>
            </tr>

            <tr>
              <td className="px-4 py-2 text-gray-400">Thumbnail</td>
              <td className="px-4 py-2 text-gray-100">{data.thumbnailUrl}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-md px-3 py-2">
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
          onClick={handleUpdate}
          disabled={loading}
          className={`px-5 py-2 text-sm rounded-md font-semibold ${
            loading
              ? "bg-neutral-700 text-gray-400 cursor-wait"
              : "bg-green-600 hover:bg-green-500 text-white"
          }`}
        >
          {loading ? "Actualizando..." : "Actualizar evento"}
        </button>
      </div>
    </div>
  );
}
