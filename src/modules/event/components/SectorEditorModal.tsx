import type { EventSectorFull } from "./types";
import { updateEventSector } from "../api/eventApi";

interface Props {
  sector: EventSectorFull;
  onClose: () => void;
  onUpdateLocal: (sector: EventSectorFull) => void;
  reload: () => void;
}

export default function SectorEditorModal({ sector, onClose, onUpdateLocal, reload }: Props) {
  const updateField = (field: string, value: any) => {
    onUpdateLocal({ ...sector, [field]: value });
  };

  const toggleAvailable = (value: boolean) => {
    if (!value) {
      onUpdateLocal({
        ...sector,
        available: false,
        capacity: 100,
        price: 100
      });
    } else {
      onUpdateLocal({ ...sector, available: true });
    }
  };

  const save = async () => {
    await updateEventSector({
      eventSectorId: sector.eventSectorId,
      capacity: sector.available ? Number(sector.capacity) : 100,
      price: sector.available ? Number(sector.price) : 100,
      available: sector.available
    });

    reload();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-[420px] shadow-xl">

        <h2 className="text-xl font-bold mb-4">Editar sector: {sector.name}</h2>

        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-300 block mb-1">Disponible</label>
            <select
              className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-sm"
              value={sector.available ? "yes" : "no"}
              onChange={(e) => toggleAvailable(e.target.value === "yes")}
            >
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          {sector.available && (
            <>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Capacidad</label>
                <input
                  type="number"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-sm"
                  value={sector.capacity}
                  onChange={(e) => updateField("capacity", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-sm"
                  value={sector.price}
                  onChange={(e) => updateField("price", e.target.value)}
                />
              </div>
            </>
          )}

        </div>

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 text-sm rounded-md border border-neutral-600 text-gray-300 hover:bg-neutral-800"
            onClick={onClose}
          >
            Cerrar
          </button>

          <button
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold"
            onClick={save}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
