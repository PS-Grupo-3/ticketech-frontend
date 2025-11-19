import { useEffect, useState } from "react";
import { 
  getEventCategories, 
  getEventStatuses, 
  getCategoryTypes 
} from "../../api/eventApi";

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
  const [local, setLocal] = useState(data);

  useEffect(() => {
    getEventCategories().then(setCategories);
    getEventStatuses().then(setStatuses);
    getCategoryTypes().then(setTypes);
  }, []);

  const filteredTypes = local.categoryId
    ? types.filter(
        (t) =>
          t.eventCategory ===
          categories.find((c) => c.categoryId === local.categoryId)?.name
      )
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Categoría, tipo y estado</h2>
      <p className="text-sm text-gray-400">
        Definí cómo se clasifica el evento dentro del sistema.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* CATEGORÍA */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Categoría</label>
          <select
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm"
            value={local.categoryId ?? ""}
            onChange={(e) =>
              setLocal({
                ...local,
                categoryId: e.target.value ? Number(e.target.value) : null,
                typeId: null,
              })
            }
          >
            <option value="">Seleccione categoría</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* TIPO */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Tipo</label>
          <select
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm"
            disabled={!local.categoryId}
            value={local.typeId ?? ""}
            onChange={(e) =>
              setLocal({
                ...local,
                typeId: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">Seleccione tipo</option>
            {filteredTypes.map((t) => (
              <option key={t.typeId} value={t.typeId}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* ESTADO */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Estado</label>
          <select
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm"
            value={local.statusId ?? ""}
            onChange={(e) =>
              setLocal({
                ...local,
                statusId: e.target.value ? Number(e.target.value) : null,
              })
            }
          >
            <option value="">Seleccione estado</option>
            {statuses.map((s) => (
              <option key={s.statusId} value={s.statusId}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm rounded-md border border-neutral-700 text-gray-300 hover:bg-neutral-800"
        >
          Volver
        </button>

        <button
          onClick={() => onNext(local)}
          className="px-5 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
