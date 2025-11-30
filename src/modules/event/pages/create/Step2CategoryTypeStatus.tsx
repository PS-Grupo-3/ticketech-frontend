import { useEffect, useState } from "react";
import { 
  getEventCategories, 
  getEventStatuses, 
  getCategoryTypes 
} from "../../api/eventApi";

import {
  categoryTranslate,
  categoryTypeTranslate,
  statusTranslate
} from "../../utils/eventTranslate";

interface EventCategory {
  categoryId: number;
  name: string;
}

interface CategoryType {
  typeId: number;
  name: string;
  eventCategory: string;
}

interface EventStatus {
  statusId: number;
  name: string;
}

export default function Step2CategoryTypeStatus({ data, onNext, onBack }: any) {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [types, setTypes] = useState<CategoryType[]>([]);
  const [statuses, setStatuses] = useState<EventStatus[]>([]);
  const [error, setError] = useState<string | null>(null); // Nuevo estado para errores

  const [local, setLocal] = useState({
    ...data,
    categoryId: data.categoryId ? Number(data.categoryId) : null,
    typeId: data.typeId ? Number(data.typeId) : null,
    statusId: data.statusId ? Number(data.statusId) : null,
    categoryName: data.categoryName ?? "",
    typeName: data.typeName ?? "",
    statusName: data.statusName ?? ""
  });

  useEffect(() => {
    getEventCategories().then(setCategories);
    getEventStatuses().then(setStatuses);
    getCategoryTypes().then(setTypes);
  }, []);

  const filteredTypes = local.categoryId
    ? types.filter(
        (t) =>
          t.eventCategory ===
          categories.find((c) => c.categoryId === Number(local.categoryId))?.name
      )
    : [];

  const updateCategory = (id: number | null) => {
    const cat = categories.find((c) => c.categoryId === id);
    setLocal({
      ...local,
      categoryId: id,
      categoryName: cat?.name ?? "",
      typeId: null,
      typeName: ""
    });
  };

  const updateType = (id: number | null) => {
    const t = filteredTypes.find((x) => x.typeId === id);
    setLocal({
      ...local,
      typeId: id,
      typeName: t?.name ?? ""
    });
  };

  const updateStatus = (id: number | null) => {
    const st = statuses.find((s) => s.statusId === id);
    setLocal({
      ...local,
      statusId: id,
      statusName: st?.name ?? ""
    });
  };

  // --- VALIDACIÓN ---
  const handleNext = () => {
    setError(null);

    if (!local.categoryId || !local.statusId) {
      setError("Por favor selecciona una Categoría y un Estado.");
      return;
    }

    if (filteredTypes.length > 0 && !local.typeId) {
         setError("Por favor selecciona un Tipo.");
         return;
    }

    onNext(local);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Categoría, tipo y estado</h2>
      <p className="text-sm text-gray-400">Definí cómo se clasifica el evento dentro del sistema.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <label className="block text-sm text-gray-300 mb-1">Categoría</label>
          <select
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={local.categoryId ?? ""}
            onChange={(e) =>
              updateCategory(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Seleccione categoría</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {categoryTranslate[c.name] ?? c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Tipo</label>
          <select
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={!local.categoryId}
            value={local.typeId ?? ""}
            onChange={(e) =>
              updateType(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Seleccione tipo</option>
            {filteredTypes.map((t) => (
              <option key={t.typeId} value={t.typeId}>
                {categoryTypeTranslate[t.name] ?? t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Estado</label>
          <select
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={local.statusId ?? ""}
            onChange={(e) =>
              updateStatus(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Seleccione estado</option>
            {statuses.map((s) => (
              <option key={s.statusId} value={s.statusId}>
                {statusTranslate[s.name] ?? s.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm rounded-md border border-neutral-700 text-gray-300 hover:bg-neutral-800"
        >
          Volver
        </button>

        <button
          onClick={handleNext} 
          className="px-5 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}