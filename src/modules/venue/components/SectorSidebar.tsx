import { useState, useEffect, useCallback } from "react";
import { updateSector, updateSectorShape, generateSeats, getSeatsForSector, deleteSector, getSectorById } from "../api/sectorApi";
import { generateRectangleSeats, generateCircleSeats, generateSemicircleSeats, generateArcSeats } from "../lib/seatGenerator";

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: number;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as any;
  }) as T;
}

// Removed unused autoSaveSector callback

export default function SectorSidebar({ sector, onUpdateLocal, onRemoveLocal }: any) {
  const [local, setLocal] = useState(sector);

  useEffect(() => {
    setLocal(sector);
  }, [sector.sectorId]); // Only reset when sector changes, not on every prop update

  const handleRowsColsChange = (key: string, value: any) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onUpdateLocal(updated);
    // Immediate save for rows/cols changes
    const payload = buildPayload(updated);
    updateSector(updated.sectorId, payload).catch(err => {
      console.error("[ROWS/COLS SAVE] Error:", err);
    });
  };

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
    rowNumber: s.rows ?? 0,
    columnNumber: s.cols ?? 0,
    width: Math.max(1, s.width ?? s.shape?.width ?? 100),
    height: Math.max(1, s.height ?? s.shape?.height ?? 100),
    shape: {
      type: s.shape?.type ?? "rectangle",
      width: Math.max(1, s.shape?.width ?? s.width ?? 100),
      height: Math.max(1, s.shape?.height ?? s.height ?? 100),
      x: Math.max(0, s.shape?.x ?? 0),
      y: Math.max(0, s.shape?.y ?? 0),
      rotation: s.shape?.rotation ?? 0,
      padding: Math.max(10, s.shape?.padding ?? 10),
      opacity: s.shape?.opacity ?? 100,
      colour: s.shape?.colour ?? "#22c55e",
    },
  });

  const handleGenerateSeats = async () => {
    try {
      // Generate seats locally based on shape type
      let generatedSeats = [];
      const width = local.shape?.width || local.width || 100;
      const height = local.shape?.height || local.height || 100;
      const rows = local.rows || 1;
      const cols = local.cols || 1;

      switch (local.shape?.type) {
        case "rectangle":
          generatedSeats = generateRectangleSeats(width, height, rows, cols);
          break;
        case "circle":
          generatedSeats = generateCircleSeats(width, height, rows, cols);
          break;
        case "semicircle":
          generatedSeats = generateSemicircleSeats(width, height, rows, cols);
          break;
        case "arc":
          generatedSeats = generateArcSeats(width, height, rows, cols);
          break;
        default:
          generatedSeats = generateRectangleSeats(width, height, rows, cols);
      }

      // Convert to backend format
      const seats = generatedSeats.map((seat, index) => ({
        seatId: `temp-${index}`,
        posX: seat.x,
        posY: seat.y,
        rowNumber: Math.floor(index / cols) + 1,
        columnNumber: (index % cols) + 1,
      }));

      // Update local state with generated seats
      const updated = { ...local, seats };
      onUpdateLocal(updated);
      setLocal(updated);

      // Ensure sector is updated with latest rows/cols
      const payload = buildPayload(local);
      await updateSector(local.sectorId, payload);

      // Call backend to persist seats
      await generateSeats(local.sectorId);

      // Fetch updated seats from backend
      const backendSeats = await getSeatsForSector(local.sectorId);
      const finalUpdated = { ...local, seats: backendSeats };
      onUpdateLocal(finalUpdated);
      setLocal(finalUpdated);
    } catch (err) {
      console.error("[SEATS] Error:", err);
    }
  };

  const handleDelete = async () => {
    const hasSeats = local.seats && local.seats.length > 0;
    if (hasSeats) {
      const confirmDelete = window.confirm("Este sector tiene asientos generados. ¿Estás seguro de que quieres eliminarlo? Esta acción no se puede deshacer.");
      if (!confirmDelete) return;
    }
    try {
      await deleteSector(local.sectorId);
      onRemoveLocal(local.sectorId);
    } catch (err) {
      console.error("[DELETE] Error:", err);
    }
  };

  return (
    <aside className="w-96 bg-gray-900 text-gray-100 p-4 border-l border-gray-700 flex flex-col gap-4 overflow-y-auto max-h-[80vh] rounded-tl-lg">
      <h2 className="text-lg font-semibold mb-2">Editar Sector</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Nombre</label>
        <input className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400" value={local.name ?? ""} onChange={(e) => handleChange("name", e.target.value)} />
      </div>

      {!local.isControlled && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Capacidad</label>
          <input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400" value={local.capacity ?? 0} onChange={(e) => handleChange("capacity", Number(e.target.value))} />
        </div>
      )}
      {local.isControlled && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Asientos</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400" value={local.seatCount ?? 0} onChange={(e) => handleChange("seatCount", Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Filas</label>
              <div className="flex items-center gap-1">
                <button className="bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors" onClick={() => handleRowsColsChange("rows", Math.max(1, (local.rows ?? 0) - 1))}>-</button>
                <span className="flex-1 text-center bg-gray-800 border border-gray-600 rounded-md p-2 text-sm">{local.rows ?? 0}</span>
                <button className="bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors" onClick={() => handleRowsColsChange("rows", (local.rows ?? 0) + 1)}>+</button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Columnas</label>
              <div className="flex items-center gap-1">
                <button className="bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors" onClick={() => handleRowsColsChange("cols", Math.max(1, (local.cols ?? 0) - 1))}>-</button>
                <span className="flex-1 text-center bg-gray-800 border border-gray-600 rounded-md p-2 text-sm">{local.cols ?? 0}</span>
                <button className="bg-gray-700 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors" onClick={() => handleRowsColsChange("cols", (local.cols ?? 0) + 1)}>+</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 p-3 bg-gray-850 rounded-lg border border-gray-700">
        <input type="checkbox" id="isControlled" checked={local.isControlled ?? false} onChange={(e) => handleChange("isControlled", e.target.checked)} className="w-4 h-4 text-green-400 bg-gray-800 border-gray-600 rounded focus:ring-green-400 focus:ring-2" />
        <label htmlFor="isControlled" className="text-sm font-medium text-gray-300 cursor-pointer">Sector controlado</label>
      </div>

      <div className="border-t border-gray-700 pt-4 bg-gray-850 rounded-lg p-3 mt-4">
        <h3 className="text-sm font-medium mb-3">Forma</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">Ancho</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400" value={local.shape?.width ?? 100} onChange={(e) => {
                handleShapeChange("width", Number(e.target.value));
                handleChange("width", Number(e.target.value));
              }} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">Alto</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400" value={local.shape?.height ?? 100} onChange={(e) => {
                handleShapeChange("height", Number(e.target.value));
                handleChange("height", Number(e.target.value));
              }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">Color</label>
              <input type="color" className="w-full h-10 bg-gray-800 border border-gray-600 rounded-md cursor-pointer" value={local.shape?.colour ?? "#22c55e"} onChange={(e) => handleShapeChange("colour", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">Padding</label>
              <input type="number" className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400" value={local.shape?.padding ?? 10} onChange={(e) => handleShapeChange("padding", Math.max(10, Number(e.target.value)))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-300 mb-1 block">Opacidad (%)</label>
            <input type="number" min="0" max="100" className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400" value={local.shape?.opacity ?? 100} onChange={(e) => handleShapeChange("opacity", Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-300 mb-1 block">Tipo</label>
            <select className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:border-green-400 focus:ring-1 focus:ring-green-400" value={local.shape?.type ?? "rectangle"} onChange={(e) => handleShapeChange("type", e.target.value)}>
              <option value="rectangle">Rectángulo</option>
              <option value="circle">Círculo</option>
              <option value="semicircle">Semicírculo</option>
              <option value="arc">Arco</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6 p-3 bg-gray-850 rounded-lg border border-gray-700">
        {local.isControlled && (
          <button onClick={handleGenerateSeats} className="bg-green-600 py-2 px-4 rounded-md hover:bg-green-500 transition-colors font-medium">
            Generar asientos
          </button>
        )}
        <button onClick={handleDelete} className="bg-red-600 py-2 px-4 rounded-md hover:bg-red-500 transition-colors font-medium">
          Eliminar sector
        </button>
      </div>
    </aside>
  );
}
