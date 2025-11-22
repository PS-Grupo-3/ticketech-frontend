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
  eventDate,
  onChange
}: {
  eventId: string;
  currentStatus: string;
  eventDate: string;
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
      {STATUS_OPTIONS.map((s) => {
        const isCurrent = s.key === currentStatus;

        // convertir fecha del evento
        const eventDateObj = new Date(eventDate);
        const now = new Date();
        const hasPassed = eventDateObj < now;

        // reglas extra
        const isDisabled =
          isCurrent ||
          loading ||
          (currentStatus === "Active" && s.key === "Scheduled") ||
          (currentStatus === "Finished" &&
            (s.key === "Scheduled" || s.key === "Active" || s.key === "Postponed")) ||
          (s.key === "Finished" && !hasPassed);

        // mensaje explicativo
        let reason: string | null = null;

        if (isCurrent) {
          reason = "Este es el estado actual.";
        } else if (loading) {
          reason = "Actualizando estado...";
        } else if (currentStatus === "Active" && s.key === "Scheduled") {
          reason = "No puedes volver un evento activo a programado.";
        } else if (
          currentStatus === "Finished" &&
          (s.key === "Scheduled" || s.key === "Active" || s.key === "Postponed")
        ) {
          reason = "Un evento finalizado no puede cambiar a otro estado.";
        } else if (s.key === "Finished" && !hasPassed) {
          reason = "Solo puedes finalizar un evento después de su fecha programada.";
        }

        return (
          <button
            key={s.id}
            disabled={isDisabled}
            title={isDisabled && reason ? reason : ""}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(s.key, s.id);
            }}
          >
            {statusTranslate[s.key] ?? s.key}
          </button>
        );
      })}
    </div>
  );
}
