import { useEffect, useState } from "react";
import { getEventFull, updateEventSector } from "../../api/eventApi";
import { useNavigate } from "react-router-dom";

export default function Step5ConfigureSectors({ eventId, onBack }: any) {
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const full = await getEventFull(eventId);
      setSectors(full.sectors || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = (sectorId: string, field: string, value: any) => {
    setSectors((prev) =>
      prev.map((s) =>
        s.eventSectorId === sectorId ? { ...s, [field]: value } : s
      )
    );
  };

  const saveSector = async (s: any) => {
    await updateEventSector({
      eventSectorId: s.eventSectorId,
      capacity: Number(s.capacity),
      price: Number(s.price),
      available: true
    });

    load();
  };

  if (loading) {
    return <div className="text-center py-6">Cargando sectores...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Configurar sectores</h2>
      <p className="text-sm text-gray-400 mb-4">
        Ajustá la capacidad y el precio de cada sector asignado al evento.
      </p>

      <div className="space-y-5">
        {sectors.map((s) => (
          <div
            key={s.eventSectorId}
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-4"
          >
            <h3 className="text-white font-semibold text-lg mb-3">
              Sector {s.eventSectorId.substring(0, 6)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-gray-300 block mb-1">
                  Capacidad
                </label>
                <input
                  type="number"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-2 text-sm"
                  value={s.capacity}
                  onChange={(e) =>
                    updateField(s.eventSectorId, "capacity", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-md p-2 text-sm"
                  value={s.price}
                  onChange={(e) =>
                    updateField(s.eventSectorId, "price", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => saveSector(s)}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        ))}
      </div>
      
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
          onClick={() => navigate("/")}
          className="px-5 py-2 text-sm rounded-md bg-green-600 hover:bg-green-500 text-white font-semibold"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}
