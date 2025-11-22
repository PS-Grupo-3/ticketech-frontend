// StatusChange.tsx
import { useState } from "react";
import { updateEventStatus } from "../../api/eventApi";
import { statusTranslate } from "../../utils/eventTranslate";

const STATUS_OPTIONS = [
  { id: 1, key: "Scheduled" },
  { id: 2, key: "Active" },
  { id: 3, key: "Postponed" },
  { id: 4, key: "Finished" }
];

export default function StatusChange({
  eventId,
  currentStatus,
  onChange
}: {
  eventId: string;
  currentStatus: string;
  onChange: (newStatusKey: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatusKey: string, newStatusId: number) => {
    if (newStatusKey === currentStatus || loading) return;

    try {
      setLoading(true);

      await updateEventStatus(eventId, newStatusId);

      onChange(newStatusKey);
    } catch (err) {
      console.error("Error actualizando estado:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-dropdown">
      {STATUS_OPTIONS.map((s) => (
        <button
          key={s.id}
          disabled={s.key === currentStatus || loading}
          onClick={(e) => {
            e.stopPropagation();
            handleStatusChange(s.key, s.id);
          }}
        >
          {statusTranslate[s.key] ?? s.key}
        </button>
      ))}
    </div>
  );
}
