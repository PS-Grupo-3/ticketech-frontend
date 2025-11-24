import { useEffect, useState } from "react";
import { 
  getEventCategories, 
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

export default function Step2CategoryType({ data, onNext, onBack }: any) {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [types, setTypes] = useState<CategoryType[]>([]);

  const [local, setLocal] = useState(data as {
    categoryId: number | null;
    typeId: number | null;
    [key: string]: any;
  });

  useEffect(() => {
    getEventCategories().then(setCategories);
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
      <h2 className="text-2xl font-bold mb-2">Categoría y tipo</h2>
      <p className="text-sm text-gray-400">
        Definí cómo se clasifica el evento dentro del sistema.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* -------- CATEGORÍA -------- */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Categoría</label>
          <select
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm"
            value={local.categoryId ?? ""}
            onChange={(e) => {
              const newCategory = e.target.value ? Number(e.target.value) : null;

              setLocal((prev) => ({
                ...prev,
                categoryId: newCategory,
                typeId: prev.categoryId !== newCategory ? null : prev.typeId,
              }));
            }}
          >
            <option value="">Seleccione categoría</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* -------- TIPO -------- */}
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

      </div>

      {/* -------- BOTONES -------- */}
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
