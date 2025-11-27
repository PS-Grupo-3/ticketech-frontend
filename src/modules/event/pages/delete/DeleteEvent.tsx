// modules/event/pages/delete/DeleteEvent.tsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { deleteEvent } from "../../api/eventApi";
import "./DeleteEvent.css";
import defaultImage from "../../../../assets/default-image.webp";
import { useNotification } from "../../../../shared/components/NotificationContext";

export default function DeleteEvent({
  eventId,
  eventName,
  thumbnailUrl,
  onCancel,
  onDeleted,
}: {
  eventId: string;
  eventName: string;
  thumbnailUrl?: string | null;
  onCancel: () => void;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // bloqueo scroll del body mientras está abierto
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onCancel]);

  const { show } = useNotification();
    
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteEvent(eventId);
      onDeleted();
    } catch (err) {
      console.error("Error eliminando evento", err);
      show("No se pudo eliminar el evento.");
    } finally {
      setLoading(false);
    }
  };
  const popup = (
    <div
        className="delete-popup-overlay"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCancel();
        }}
    >
        <div className="delete-popup" onMouseDown={(e) => e.stopPropagation()}>
            <p className="delete-popup-title">Seguro que quieres elimininar
                el evento {eventName}?</p>

            <div className="delete-popup-buttons">
                <button
                    className="delete-btn confirm"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? "Eliminando..." : "Sí"}
                </button>

                <button
                    className="delete-btn cancel"
                    onClick={onCancel}
                    disabled={loading}
                >
                    No
                </button>
            </div>
        </div>
    </div>

  );

  // asegúrate que document.body existe (en SSR habría que protegerlo)
  return typeof document !== "undefined"
    ? createPortal(popup, document.body)
    : popup;
}
