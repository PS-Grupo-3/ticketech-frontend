import { useState } from "react";
import { createEvent } from "../../api/eventApi";

import {
  categoryTranslate,
  categoryTypeTranslate,
  statusTranslate
} from "../../utils/eventTranslate";

export default function Step4Review({ data, onBack, onCreated }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name: data.name,
        description: data.description,
        time: data.time ? new Date(data.time).toISOString() : new Date().toISOString(), 
        categoryId: Number(data.categoryId), 
        typeId: data.typeId ? Number(data.typeId) : null, 
        statusId: Number(data.statusId), 
        venueId: data.venueId,
        address: data.address,
        thumbnailUrl: data.thumbnailUrl || null, 
        bannerImageUrl: data.bannerImageUrl || null, 
        themeColor: data.themeColor || "#000000" 
      };

      console.log("Enviando payload:", payload); // Debugging

      const created = await createEvent(payload);
      onCreated(created.eventId);
    } catch (err: any) {
      console.error("Error creando evento:", err);
      // Extract specific error message if available
      const errorMessage = err.response?.data?.detail || err.message || "No se pudo crear el evento.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categoryName =
    categoryTranslate[data.categoryName] ?? data.categoryName ?? "Sin categoría";

  const typeName =
    categoryTypeTranslate[data.typeName] ?? data.typeName ?? "Sin tipo";

  const statusName =
    statusTranslate[data.statusName] ?? data.statusName ?? "Sin estado";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Revisión final</h2>
      <p className="text-sm text-gray-400 mb-4">
        Confirmá que los datos del evento sean correctos antes de crear.
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
              <td className="px-4 py-2 text-gray-400">Dirección</td>
              <td className="px-4 py-2 text-gray-100">{data.address}</td>
            </tr>

            <tr className="border-b border-neutral-800">
              <td className="px-4 py-2 text-gray-400">Categoría</td>
              <td className="px-4 py-2 text-gray-100">{categoryName}</td>
            </tr>

            <tr className="border-b border-neutral-800">
              <td className="px-4 py-2 text-gray-400">Tipo</td>
              <td className="px-4 py-2 text-gray-100">{typeName}</td>
            </tr>

            <tr>
              <td className="px-4 py-2 text-gray-400">Espacio</td>
              <td className="px-4 py-2 text-gray-100">{data.venueName}</td>
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
          onClick={handleCreate}
          disabled={loading}
          className={`px-5 py-2 text-sm rounded-md font-semibold ${loading
            ? "bg-neutral-700 text-gray-400 cursor-wait"
            : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
        >
          {loading ? "Creando..." : "Crear evento"}
        </button>
      </div>
    </div>
  );
}