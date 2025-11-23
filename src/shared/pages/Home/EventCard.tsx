import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { categoryTranslate, statusTranslate } from "../../../modules/event/utils/eventTranslate";
import "./css/EventCard.css";
import defaultImage from "../../../assets/default-image.webp";
import { useState, useRef, useEffect } from "react";
import StatusChange from "../../../modules/event/pages/updateStatus/StatusChange";
import DeleteEvent from "../../../modules/event/pages/delete/DeleteEvent";

type Event = {
  eventId: string;
  venueId: string;
  name: string;
  category: string;
  categoryType: string;
  status: string;
  time: string;
  address: string;
  thumbnailUrl?: string | null;
};


export default function EventCard({ event, showMenu = false }: { event: Event; showMenu?: boolean }) {
  const navigate = useNavigate();
  const date = new Date(event.time);
  const dateStr = format(date, "dd/MM/yyyy HH:mm");
  const hasThumbnail = Boolean(event.thumbnailUrl && event.thumbnailUrl.trim());

  const [menuOpen, setMenuOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [currentStatus, setCurrentStatus] = useState(event.status);
  
  const menuRef = useRef<HTMLDivElement>(null);

  const goToEventPreview = () => navigate(`/event/${event.eventId}`);

  // cerrar menú al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <article className="event-card-general">
      {showMenu && (
        <div className="event-card-menu" ref={menuRef}>
          <button
            className="menu-button"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="menu-dropdown">
              <button onClick={(e) => { e.stopPropagation();}}>Editar</button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentStatus !== "Finished") {
                    setStatusOpen(!statusOpen);
                  }
                }}
                disabled={currentStatus === "Finished"}
                title={
                  currentStatus === "Finished"
                    ? "Este evento ya está finalizado y no puede cambiar de estado."
                    : ""
                }
              >
                Actualizar estado
              </button>
              <button onClick={(e) => { e.stopPropagation();}}>Estadísticas</button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentStatus === "Scheduled") {
                    setDeleteOpen(true);
                  }
                }}
                disabled={currentStatus !== "Scheduled"}
                title={
                  currentStatus !== "Scheduled"
                    ? "Solo se pueden eliminar eventos programados."
                    : ""
                }
              >
                Eliminar
              </button>

            
              {statusOpen && (
                <StatusChange
                  eventId={event.eventId}
                  currentStatus={currentStatus}
                  eventDate={event.time}   // <<--- agregar esto
                  onChange={(newStatus) => {
                    setCurrentStatus(newStatus);
                    setStatusOpen(false);
                    setMenuOpen(false);
                  }}
                />
              )}

              {deleteOpen && (
                <DeleteEvent
                  eventId={event.eventId}
                  eventName={event.name}
                  thumbnailUrl={event.thumbnailUrl}
                  onCancel={() => setDeleteOpen(false)}
                  onDeleted={() => {
                    setDeleteOpen(false);
                    setMenuOpen(false);
                    window.location.reload();
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
      <div className="event-card" role="button" tabIndex={0}>
        
        <div className="event-card-image-wrapper" onClick={goToEventPreview}>
          <img
            src={hasThumbnail ? event.thumbnailUrl! : defaultImage}
            alt={event.name}
            className="event-card-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="event-card-content" onClick={goToEventPreview}>
          <div className="event-card-date-tittle">
            <p className="event-card-date">{dateStr}</p>
            <h3 className="event-card-title">{event.name}</h3>
          </div>
          <div className="event-card-category-status">
            <p className="event-card-category">
              {categoryTranslate[event.category] ?? event.category} · {event.categoryType}
            </p>
            <p className="event-card-status">
              {statusTranslate[currentStatus] ?? currentStatus}
            </p>

          </div>
        </div>
      </div>
    </article>
    
  );
}
