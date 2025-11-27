import { useState } from "react";
import { categoryTranslate, statusTranslate } from "../../../modules/event/utils/eventTranslate";
import "./css/EventFilters.css";

const CATEGORY_OPTIONS = [
  { id: 1, key: "Music" },
  { id: 2, key: "Stand-up" },
  { id: 3, key: "Conference" },
  { id: 4, key: "Sports" },
  { id: 5, key: "Theatre" },
  { id: 6, key: "Arts" },
  { id: 7, key: "Workshops" }
];

const STATUS_OPTIONS = [
  { id: 1, key: "Scheduled" },
  { id: 2, key: "Active" },
  { id: 3, key: "Postponed" },
  { id: 4, key: "Finished" }
];

export default function EventFilters({ onChange }: { onChange: (f: any) => void }) {
  const [local, setLocal] = useState<any>({});

  const toIso = (value: string | undefined) => {
    if (!value) return undefined;    
    const date = new Date(value);
    return date.toISOString(); 
  };

  const update = (field: string, rawValue: any) => {
    const value = rawValue === "" ? undefined : rawValue;

    const updated = {
      ...local,
      [field]: value
    };

    setLocal(updated);
    onChange(updated);
  };

  return (
    <div className="event-filters">

      <select
        onChange={(e) =>
          update("categoryId", e.target.value ? Number(e.target.value) : undefined)
        }
      >
        <option value="">Categoría</option>
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c.id} value={c.id}>
            {categoryTranslate[c.key]}
          </option>
        ))}
      </select>

      <select
        onChange={(e) =>
          update("statusId", e.target.value ? Number(e.target.value) : undefined)
        }
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
        onChange={(e) => update("from", toIso(e.target.value))}
      />

      <input
        type="datetime-local"
        onChange={(e) => update("to", toIso(e.target.value))}
      />

      <input
        type="text"
        placeholder="Buscar evento..."        
        onChange={(e) => update("name", e.target.value)}
      />
    </div>
  );
}
