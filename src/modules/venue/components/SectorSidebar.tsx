import { useState, useEffect, useCallback } from "react";
import { updateSector, updateSectorShape, generateSeats, getSeatsForSector, deleteSector, getSectorById } from "../api/sectorApi";

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: number;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as any;
  }) as T;
}

export default function SectorSidebar({ sector, onUpdateLocal, onRemoveLocal }: any) {
  const [local, setLocal] = useState(sector);

  useEffect(() => {
    setLocal(sector);
  }, [sector]);

  const handleRowsColsChange = (key: string, value: any) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onUpdateLocal(updated);
    // Immediate save for rows/cols changes
    const payload = buildPayload(updated);
    updateSector(updated.sectorId, payload).then(async () => {
      // Fetch the full sector data to ensure we have the latest rows/cols
      const fullSector = await getSectorById(updated.sectorId);
      onUpdateLocal(fullSector);
    }).catch(err => {
      console.error("[ROWS/COLS SAVE] Error:", err);
    });
  };

  // Debounced auto-save for sector updates
  const autoSaveSector = useCallback(
    debounce(async (updated: any) => {
      const payload = buildPayload(updated);
      try {
        const res = await updateSector(updated.sectorId, payload);
        onUpdateLocal({ ...updated, ...res });
      } catch (err) {
        console.error("[AUTO-SAVE] Error:", err);
      }
    }, 300),
    []
  );

  // Debounced auto-save for shape updates
  const autoSaveShape = useCallback(
    debounce(async (shape: any, sectorId: string) => {
      try {
        await updateSectorShape(sectorId, shape);
      } catch (err) {
        console.error("[AUTO-SAVE SHAPE] Error:", err);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (local.sectorId && local !== sector) {
      autoSaveSector(local);
    }
  }, [local, autoSaveSector, sector]);

  const handleChange = (key: string, value: any) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onUpdateLocal(updated);
  };

  const handleShapeChange = (key: string, value: any) => {
    const shape = { ...local.shape, [key]: value };
    const updated = { ...local, shape };
    setLocal(updated);
    onUpdateLocal(updated);
    autoSaveShape(shape, local.sectorId);
  };

  const buildPayload = (s: any) => ({
    name: s.name ?? "Sector",
    isControlled: s.isControlled ?? false,
    seatCount: s.seatCount ?? 0,
    capacity: s.capacity ?? 0,
    rows: s.rows ?? 0,
    cols: s.cols ?? 0,
    width: Math.max(1, s.width ?? s.shape?.width ?? 100),
    height: Math.max(1, s.height ?? s.shape?.height ?? 100),
    shape: {
      type: s.shape?.type ?? "rectangle",
      width: Math.max(1, s.shape?.width ?? s.width ?? 100),
      height: Math.max(1, s.shape?.height ?? s.height ?? 100),
      x: Math.max(0, s.shape?.x ?? 0),
      y: Math.max(0, s.shape?.y ?? 0),
      rotation: s.shape?.rotation ?? 0,
      padding: s.shape?.padding ?? 0,
      opacity: s.shape?.opacity ?? 100,
      colour: s.shape?.colour ?? "#22c55e",
    },
  });



  const handleGenerateSeats = async () => {
    try {
      // Ensure sector is updated with latest rows/cols before generating
      const payload = buildPayload(local);
      await updateSector(local.sectorId, payload);
      await generateSeats(local.sectorId);
      const seats = await getSeatsForSector(local.sectorId);
      onUpdateLocal({ ...local, seats });
    } catch (err) {
      console.error("[SEATS] Error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSector(local.sectorId);
      onRemoveLocal(local.sectorId);
    } catch (err) {
      console.error("[DELETE] Error:", err);
    }
  };

  return (
    <aside className="w-96 bg-gray-900 text-gray-100 p-4 border-l border-gray-700 flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Editar Sector</h2>

      <label className="text-sm">Nombre</label>
      <input className="w-full bg-gray-800 border border-gray-700 rounded p-1" value={local.name ?? ""} onChange={(e) => handleChange("name", e.target.value)} />

      {!local.isControlled && (
        <div>
          <label className="text-sm">Capacidad</label>
          <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded p-1" value={local.capacity ?? 0} onChange={(e) => handleChange("capacity", Number(e.target.value))} />
        </div>
      )}
      {local.isControlled && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Asientos</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded p-1" value={local.seatCount ?? 0} onChange={(e) => handleChange("seatCount", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm">Filas</label>
              <input type="number" min="1" className="w-full bg-gray-800 border border-gray-700 rounded p-1" value={local.rows ?? 0} onChange={(e) => handleRowsColsChange("rows", Number(e.target.value))} />
            </div>
            <div>
              <label className="text-sm">Columnas</label>
              <input type="number" min="1" className="w-full bg-gray-800 border border-gray-700 rounded p-1" value={local.cols ?? 0} onChange={(e) => handleRowsColsChange("cols", Number(e.target.value))} />
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-2">
        <input type="checkbox" checked={local.isControlled ?? false} onChange={(e) => handleChange("isControlled", e.target.checked)} />
        <span>Sector controlado</span>
      </div>

      <div className="border-t border-gray-700 pt-3">
        <h3 className="text-sm font-medium mb-2">Forma</h3>
        <label className="text-xs">Tipo</label>
        <select className="w-full bg-gray-800 border border-gray-700 rounded p-1" value={local.shape?.type ?? "rectangle"} onChange={(e) => handleShapeChange("type", e.target.value)}>
          <option value="rectangle">Rectángulo</option>
          <option value="circle">Círculo</option>
          <option value="semicircle">Semicírculo</option>
          <option value="arc">Arco</option>
        </select>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="text-xs">Ancho</label>
            <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded p-1" value={local.shape?.width ?? 100} onChange={(e) => {
              handleShapeChange("width", Number(e.target.value));
              handleChange("width", Number(e.target.value));
            }} />
          </div>
          <div>
            <label className="text-xs">Alto</label>
            <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded p-1" value={local.shape?.height ?? 100} onChange={(e) => {
              handleShapeChange("height", Number(e.target.value));
              handleChange("height", Number(e.target.value));
            }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="text-xs">Color</label>
            <input type="color" className="w-full h-8 bg-gray-800 border border-gray-700 rounded" value={local.shape?.colour ?? "#22c55e"} onChange={(e) => handleShapeChange("colour", e.target.value)} />
          </div>
          <div>
            <label className="text-xs">Padding</label>
            <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded p-1" value={local.shape?.padding ?? 0} onChange={(e) => handleShapeChange("padding", Number(e.target.value))} />
          </div>
        </div>
        <div className="mt-2">
          <label className="text-xs">Opacidad</label>
          <input type="number" min="0" max="100" className="w-full bg-gray-800 border border-gray-700 rounded p-1" value={local.shape?.opacity ?? 100} onChange={(e) => handleShapeChange("opacity", Number(e.target.value))} />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {local.isControlled && <button onClick={handleGenerateSeats} className="bg-green-600 py-1 rounded hover:bg-green-500">Generar asientos</button>}
        <button onClick={handleDelete} className="bg-red-600 py-1 rounded hover:bg-red-500">Eliminar sector</button>
      </div>
    </aside>
  );
}
