import { useState, useEffect, useCallback } from "react";
import { updateSector, generateSeats, getSeatsForSector, deleteSector } from "../api/sectorApi";

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
  onRemoveLocal,
}: SidebarProps) {
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

  const buildPayload = (s: Sector) => ({
    name: s.name,
    isControlled: s.isControlled,
    seatCount: s.seatCount,
    capacity: s.capacity,
    shape: {
      ...s.shape
    }
  });

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

  const handleRowsColsChange = (
    key: "rows" | "columns",
    value: number
  ) => {
    applyUpdate({
      ...local,
      shape: { ...local.shape, [key]: value }
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
          onChange={(e) => handleChange("isControlled", e.target.checked)}
        />
        <label className="text-sm">Sector controlado</label>
      </div>

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
              value={local.seatCount ?? 0}
              onChange={(e) =>
                handleChange("seatCount", Number(e.target.value))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded p-2"
            />
          </div>
        </div>
      )}

      <div className="border-t border-gray-700 pt-4">
        <h3 className="text-sm font-semibold">Forma</h3>

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

        <div className="mt-3">
          <label className="text-sm">Tipo</label>
          <select
            value={local.shape.type}
            onChange={(e) =>
              handleShapeChange("type", e.target.value)
            }
            className="w-full bg-gray-800 border border-gray-600 rounded p-2"
          >
            <option value="rectangle">Rectángulo</option>
            <option value="circle">Círculo</option>
            <option value="semicircle">Semicírculo</option>
            <option value="arc">Arco</option>
          </select>
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
