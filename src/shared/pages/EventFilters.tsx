import { useState } from "react";

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
        <option value="1">Música</option>
        <option value="2">Deportes</option>
      </select>

      <select
        className="bg-neutral-900 p-2 rounded"
        onChange={(e) => update("statusId", Number(e.target.value) || undefined)}
      >
        <option value="">Estado</option>
        <option value="1">Scheduled</option>
        <option value="2">Cancelled</option>
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
