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
  // ensure shape is always valid for Konva
  const [local, setLocal] = useState<Sector>({
    ...sector,
    shape: {
      ...sector.shape,
      rows: sector.shape.rows ?? 1,
      columns: sector.shape.columns ?? 1
    }
  });

  useEffect(() => {
    setLocal({
      ...sector,
      shape: {
        ...sector.shape,
        rows: sector.shape.rows ?? 1,
        columns: sector.shape.columns ?? 1
      }
    });
  }, [sector]);

  // BUILD PAYLOAD FOR BACKEND
  const buildPayload = (s: Sector) => {
    if (s.isControlled) {
      const rows = s.shape.rows ?? 1;
      const cols = s.shape.columns ?? 1;

      return {
        name: s.name,
        isControlled: true,
        seatCount: rows * cols,
        capacity: null,
        shape: {
          ...s.shape,
          type: s.shape.type, // valid type
          rows,
          columns: cols
        }
      };
    }

    // NON CONTROLLED → must still send valid shape
    return {
      name: s.name,
      isControlled: false,
      seatCount: null,
      capacity: Number(s.capacity ?? 0),
      shape: {
        ...s.shape,
        type: "rectangle", // backend required
        rows: 1,
        columns: 1
      }
    };
  };

  const saveSector = async (updated: Sector) => {
    try {
      await updateSector(updated.sectorId, buildPayload(updated));
    } catch (err) {
      console.error("[UPDATE ERROR]", err);
    }
  };

  const autoSave = useCallback(
    debounce((s: Sector) => saveSector(s), 400),
    []
  );

  const applyUpdate = (updated: Sector) => {
    setLocal(updated);
    onUpdateLocal(updated);
    autoSave(updated);
  };

  const handleChange = (key: keyof Sector, value: any) => {
    applyUpdate({ ...local, [key]: value });
  };

  const handleShapeChange = (key: keyof Shape, value: any) => {
    applyUpdate({ ...local, shape: { ...local.shape, [key]: value } });
  };

  // update grid size for controlled
  const handleRowsColsChange = (key: "rows" | "columns", value: number) => {
    const rows = key === "rows" ? value : local.shape.rows;
    const cols = key === "columns" ? value : local.shape.columns;
    const seatCount = rows * cols;

    applyUpdate({
      ...local,
      seatCount,
      shape: { ...local.shape, rows, columns: cols }
    });
  };

  const handleGenerateSeats = async () => {
    try {
      await saveSector(local);
      await generateSeats(local.sectorId);

      const backendSeats = await getSeatsForSector(local.sectorId);
      const updated = { ...local, seats: backendSeats };

      setLocal(updated);
      onUpdateLocal(updated);
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
    <aside className="w-96 bg-gray-900 text-gray-100 p-4 border-l border-gray-700 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Editar Sector</h2>

      <div>
        <label className="text-sm">Nombre</label>
        <input
          value={local.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded p-2"
        />
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={local.isControlled}
          onChange={(e) => {
            const isCtrl = e.target.checked;

            if (isCtrl) {
              // CONTROLLED
              const rows = local.shape.rows ?? 1;
              const cols = local.shape.columns ?? 1;

              applyUpdate({
                ...local,
                isControlled: true,
                seatCount: rows * cols,
                capacity: null,
                shape: {
                  ...local.shape,
                  type: "rectangle", // keep valid
                  rows,
                  columns: cols
                }
              });
            } else {
              // NON CONTROLLED
              applyUpdate({
                ...local,
                isControlled: false,
                seatCount: null,
                capacity: local.capacity ?? 100,
                shape: {
                  ...local.shape,
                  type: "rectangle",
                  rows: 1,
                  columns: 1
                }
              });
            }
          }}
        />
        <label className="text-sm">Sector controlado</label>
      </div>

      {/* CONTROLLED */}
      {local.isControlled && (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm">Filas</label>
            <input
              type="number"
              value={local.shape.rows}
              min={1}
              onChange={(e) =>
                handleRowsColsChange("rows", Number(e.target.value))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label className="text-sm">Columnas</label>
            <input
              type="number"
              min={1}
              value={local.shape.columns}
              onChange={(e) =>
                handleRowsColsChange("columns", Number(e.target.value))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label className="text-sm">Asientos</label>
            <input
              type="number"
              readOnly
              value={local.seatCount ?? 0}
              className="w-full bg-gray-700 text-gray-400 border border-gray-600 rounded p-2"
            />
          </div>
        </div>
      )}

      {/* NON CONTROLLED */}
      {!local.isControlled && (
        <div>
          <label className="text-sm">Capacidad</label>
          <input
            type="number"
            value={local.capacity ?? 0}
            onChange={(e) => handleChange("capacity", Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-600 rounded p-2"
          />
        </div>
      )}

      {/* SHAPE EDITOR */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="text-sm font-semibold">Forma</h3>

        {/* width / height for both modes */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-sm">Ancho</label>
            <input
              type="number"
              value={local.shape.width}
              onChange={(e) =>
                handleShapeChange("width", Number(e.target.value))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>

          <div>
            <label className="text-sm">Alto</label>
            <input
              type="number"
              value={local.shape.height}
              onChange={(e) =>
                handleShapeChange("height", Number(e.target.value))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-sm">Color</label>
            <input
              type="color"
              value={local.shape.colour}
              onChange={(e) =>
                handleShapeChange("colour", e.target.value)
              }
              className="w-full h-10 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="text-sm">Padding</label>
            <input
              type="number"
              value={local.shape.padding}
              onChange={(e) =>
                handleShapeChange("padding", Number(e.target.value))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-sm">Opacidad</label>
          <input
            type="number"
            min={0}
            max={100}
            value={local.shape.opacity}
            onChange={(e) =>
              handleShapeChange("opacity", Number(e.target.value))
            }
            className="w-full bg-gray-800 border border-gray-600 rounded p-2"
          />
        </div>        
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {local.isControlled && (
          <button
            onClick={handleGenerateSeats}
            className="bg-green-600 py-2 rounded hover:bg-green-500"
          >
            Generar asientos
          </button>
        )}

        <button
          onClick={handleDelete}
          className="bg-red-600 py-2 rounded hover:bg-red-500"
        >
          Eliminar sector
        </button>
      </div>
    </aside>
  );
}
