import { useState, useEffect, useCallback } from "react";
import { updateSector, getSeatsForSector, deleteSector } from "../api/sectorApi";
import { generateSeats } from "../api/seatApi";

import type { Sector, Shape } from "../components/Types";

function debounce<T extends (...a: any[]) => void>(fn: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

interface SidebarProps {
  sector: Sector;
  onUpdateLocal: (s: Sector) => void;
  onRemoveLocal: (id: string) => void;
}

export default function SectorSidebar({
  sector,
  onUpdateLocal,
  onRemoveLocal
}: SidebarProps) {
  
  const getInitialRows = (s: any) => {
    if (s.shape?.rows && s.shape.rows > 1) return s.shape.rows;
    if (s.rows && s.rows > 1) return s.rows;
    if (s.seats && s.seats.length > 0) {
        return Math.max(...s.seats.map((seat: any) => seat.rowNumber || 0));
    }
    return 10; 
  };

  const getInitialCols = (s: any) => {
    if (s.shape?.columns && s.shape.columns > 1) return s.shape.columns;
    if (s.cols && s.cols > 1) return s.cols;
    if (s.seats && s.seats.length > 0) {
        return Math.max(...s.seats.map((seat: any) => seat.columnNumber || 0));
    }
    return 10; 
  };

  const [local, setLocal] = useState<Sector>({
    ...sector,
    shape: {
      ...sector.shape,
      rows: getInitialRows(sector),
      columns: getInitialCols(sector)
    }
  });

  const hasSeats = (local.seats?.length ?? 0) > 0;

  useEffect(() => {
    setLocal({
      ...sector,
      shape: {
        ...sector.shape,
        rows: getInitialRows(sector),
        columns: getInitialCols(sector)
      }
    });
  }, [sector]);

  const buildPayload = (s: Sector) => {
    const isControlled = s.isControlled === true;

    if (isControlled) {
      const rows = s.shape.rows ?? 1;
      const cols = s.shape.columns ?? 1;
      return {
        name: s.name,
        isControlled: true,
        seatCount: rows * cols,
        capacity: null,
        shape: {
          ...s.shape,
          type: s.shape.type, 
          rows,
          columns: cols
        }
      };
    }

    return {
      name: s.name,
      isControlled: false,
      seatCount: null,
      capacity: Number(s.capacity ?? 0),
      shape: {
        ...s.shape,
        type: s.shape.type, 
        rows: 1,
        columns: 1
      }
    };
  };

  const saveSectorToBackend = async (s: Sector) => {
    try {
      await updateSector(s.sectorId, buildPayload(s));
      console.log("[AUTOSAVE] Guardado.");
    } catch (err) {
      console.error("[AUTOSAVE ERROR]", err);
    }
  };

  const debouncedSave = useCallback(
    debounce((s: Sector) => saveSectorToBackend(s), 500),
    []
  );

  const applyUpdate = (updated: Sector) => {
    setLocal(updated);
    onUpdateLocal(updated);
    debouncedSave(updated); 
  };

  const handleChange = (key: keyof Sector, value: any) => {
    applyUpdate({ ...local, [key]: value });
  };

  const handleShapeChange = (key: keyof Shape, value: any) => {
    applyUpdate({ ...local, shape: { ...local.shape, [key]: value } });
  };

  const handleRowsColsChange = (key: "rows" | "columns", value: number) => {
    const rows = key === "rows" ? value : local.shape.rows;
    const cols = key === "columns" ? value : local.shape.columns;
    
    const r = rows ?? 1;
    const c = cols ?? 1;
    const seatCount = r * c;

    applyUpdate({
      ...local,
      seatCount,
      shape: { ...local.shape, rows: r, columns: c }
    });
  };

  const handleGenerateSeats = async () => {
    try {
      await updateSector(local.sectorId, buildPayload(local)); 
      await generateSeats(local.sectorId);

      const backendSeats = await getSeatsForSector(local.sectorId);
      const updated = { ...local, seats: backendSeats };

      setLocal(updated);
      onUpdateLocal(updated);
      alert("Asientos generados.");
    } catch (err) {
      console.error("[SEATS ERROR]", err);
    }
  };

  const handleDelete = async () => {
    if ((local.seats?.length ?? 0) > 0) {
      if (!window.confirm("Este sector tiene asientos generados. ¿Eliminar?")) return;
    }
    try {
      await deleteSector(local.sectorId);
      onRemoveLocal(local.sectorId);
    } catch (err) {
      console.error("[DELETE ERROR]", err);
    }
  };

  return (
    <aside className="w-96 bg-gray-900 text-gray-100 p-4 border-l border-gray-700 flex flex-col gap-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Editar Sector</h2>
      </div>

      <div>
        <label className="text-sm block mb-1">Nombre</label>
        <input
          value={local.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded p-2"
        />
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={local.isControlled === true}
          onChange={(e) => {
            const isCtrl = e.target.checked;
            const nextState = { ...local, isControlled: isCtrl };

            if (isCtrl) {
              const rows = getInitialRows(local) || 10;
              const cols = getInitialCols(local) || 10;
              
              nextState.seatCount = rows * cols;
              nextState.capacity = null;
              nextState.shape = {
                  ...local.shape,
                  type: local.shape.type, 
                  rows,
                  columns: cols
              };
            } else {
              nextState.seatCount = null;
              nextState.capacity = local.capacity ?? 100;
              nextState.shape = {
                  ...local.shape,
                  rows: 1, 
                  columns: 1 
              };
            }
            applyUpdate(nextState);
          }}
        />
        <label className="text-sm">Sector controlado (Asientos numerados)</label>
      </div>

      {local.isControlled ? (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm block mb-1">Filas</label>
            <input
              type="number"
              value={local.shape.rows}
              min={1}
              onChange={(e) => handleRowsColsChange("rows", Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Col.</label>
            <input
              type="number"
              min={1}
              value={local.shape.columns}
              onChange={(e) => handleRowsColsChange("columns", Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Total</label>
            <input
              type="number"
              readOnly
              value={local.seatCount ?? 0}
              className="w-full bg-gray-700 text-gray-400 border border-gray-600 rounded p-2 cursor-not-allowed"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="text-sm block mb-1">Capacidad Total</label>
          <input
            type="number"
            value={local.capacity ?? 0}
            onChange={(e) => handleChange("capacity", Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded p-2"
          />
        </div>
      )}

      <div className="border-t border-gray-700 pt-4 mt-2">
        <h3 className="text-sm font-semibold mb-2">Apariencia Visual</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm block mb-1">Ancho (px)</label>
            <input
              type="number"
              value={local.shape.width}
              onChange={(e) => handleShapeChange("width", Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Alto (px)</label>
            <input
              type="number"
              value={local.shape.height}
              onChange={(e) => handleShapeChange("height", Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-sm block mb-1">Color</label>
            <input
              type="color"
              value={local.shape.colour}
              onChange={(e) => handleShapeChange("colour", e.target.value)}
              className="w-full h-10 bg-gray-800 border border-gray-600 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Padding</label>
            <input
              type="number"
              value={local.shape.padding}
              onChange={(e) => handleShapeChange("padding", Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm block mb-1">Opacidad (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={local.shape.opacity}
            onChange={(e) => handleShapeChange("opacity", Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded p-2"
          />
        </div>

        <div className="mt-3">
          <label className="text-sm block mb-1">Geometría</label>
          <select
            value={local.shape.type}
            onChange={(e) => handleShapeChange("type", e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded p-2"
          >
            <option value="rectangle">Rectángulo</option>
            <option value="circle">Círculo</option>
            <option value="semicircle">Semicírculo</option>
            <option value="arc">Arco</option>
          </select>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-gray-700">
        
        {local.isControlled && (
          <button
            onClick={handleGenerateSeats}
            disabled={hasSeats}
            className={`py-2 rounded transition-colors font-medium ${
                hasSeats 
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                    : "bg-green-700 text-white hover:bg-green-600"  
            }`}
            title={hasSeats ? "Elimine los asientos existentes para generar nuevos" : "Generar matriz de asientos"}
          >
            {hasSeats ? "Asientos Generados" : "Generar Asientos"}
          </button>
        )}

        <button
          onClick={handleDelete}
          className="bg-red-900/80 text-red-200 py-2 rounded hover:bg-red-800 transition-colors border border-red-800"
        >
          Eliminar Sector
        </button>
      </div>
    </aside>
  );
}