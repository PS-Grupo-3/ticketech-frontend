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
    onUpdateLocal({ ...sector, available: value });
  };

  const save = async () => {
    await updateEventSector({
      eventSectorId: sector.eventSectorId,

      // CAPACITY:
      // - Controlado → backend la recalcula solo
      // - Libre → enviamos la capacidad real (readonly)
      capacity: sector.isControlled ? null : Number(sector.capacity),

      price: Number(sector.price),
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
              {/* CONTROLADO → capacidad automática */}
              {sector.isControlled ? (
                <p className="text-sm text-gray-400">
                  Capacidad automática: {sector.capacity} asientos
                </p>
              ) : (
                /* LIBRE → capacidad fija del venue, readonly */
                <p className="text-sm text-gray-400">
                  Capacidad del sector: {sector.capacity} personas
                </p>
              )}

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
