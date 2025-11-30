import { useEffect, useState } from "react";
import { getEventFull } from "../../api/eventApi";
import { useNavigate } from "react-router-dom";
import SectorMiniMap from "../../components/CanvasForEditor";
import SectorEditorModal from "../../components/SectorEditorModal";

import type { EventFullSnapshot, EventSectorFull } from "../../components/types";

export default function Step5ConfigureSectors({ eventId, onBack }: any) {
  const [event, setEvent] = useState<EventFullSnapshot | null>(null);
  const [sectors, setSectors] = useState<EventSectorFull[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const navigate = useNavigate();

  const load = async () => {
    const full = await getEventFull(eventId);
    setEvent(full);
    setSectors(full.sectors);
  };

  useEffect(() => {
    load();
  }, []);

  const selected = sectors.find((s) => s.eventSectorId === selectedId) ?? null;

  const hasAvailableSector = sectors.some((s) => s.available);

  const updateLocal = (updated: EventSectorFull) => {
    setSectors((prev) =>
      prev.map((s) => (s.eventSectorId === updated.eventSectorId ? updated : s))
    );
  };

  if (!event) return "Cargando...";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurar sectores del evento</h2>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-[900px] overflow-hidden rounded border border-neutral-700 bg-neutral-900 grid grid-cols-1 place-items-center">
          <SectorMiniMap
            background={event.venueBackgroundImageUrl ?? null}
            sectors={sectors}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>


      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm rounded-md border border-neutral-700 text-gray-300 hover:bg-neutral-800"
        >
          Volver
        </button>

        <button
          onClick={() => navigate("/")}
          disabled={!hasAvailableSector}
          className={`px-5 py-2 text-sm rounded-md font-semibold text-white
            ${hasAvailableSector
              ? "bg-blue-600 hover:bg-blue-500 cursor-pointer"
              : "bg-gray-600 cursor-not-allowed opacity-60"
            }`}
          title={!hasAvailableSector ? "Debe haber al menos un sector disponible" : ""}
        >
          Finalizar
        </button>

      </div>

      {selected && (
        <SectorEditorModal
          sector={selected}
          onClose={() => setSelectedId(null)}
          onUpdateLocal={updateLocal}
          reload={load}
        />
      )}
    </div>
  );
}
