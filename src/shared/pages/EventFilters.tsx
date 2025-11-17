import { useState } from "react";
import { categoryTranslate, statusTranslate } from "../../modules/event/utils/eventTranslate";

const CATEGORY_OPTIONS = [
  { id: 1, key: "Music" },
  { id: 2, key: "Stand-up" },
  { id: 3, key: "Conference" }
];

const STATUS_OPTIONS = [
  { id: 1, key: "Scheduled" },
  { id: 2, key: "Active" },
  { id: 3, key: "Postponed" },
  { id: 4, key: "Finished" }
];

export default function EventFilters({
  onChange
}: {
  onChange: (f: any) => void;
}) {
  const [local, setLocal] = useState<any>({});

  const update = (field: string, value: any) => {
    const updated = { ...local, [field]: value || undefined };
    setLocal(updated);
    onChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-4 w-full bg-neutral-800 p-4 rounded-lg">      
      <select
        className="bg-neutral-900 p-2 rounded"
        onChange={(e) => update("categoryId", Number(e.target.value) || undefined)}
      >
        <option value="">Categoría</option>
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c.id} value={c.id}>
            {categoryTranslate[c.key]}
          </option>
        ))}
      </select>
      
      <select
        className="bg-neutral-900 p-2 rounded"
        onChange={(e) => update("statusId", Number(e.target.value) || undefined)}
      >
        <option value="">Estado</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s.id} value={s.id}>
            {statusTranslate[s.key]}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        className="bg-neutral-900 p-2 rounded"
        onChange={(e) => update("from", e.target.value)}
      />

      <input
        type="datetime-local"
        className="bg-neutral-900 p-2 rounded"
        onChange={(e) => update("to", e.target.value)}
      />
    </div>
  );
}
