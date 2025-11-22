import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { categoryTranslate, statusTranslate } from "../../../modules/event/utils/eventTranslate";
import "./css/EventCard.css";
import defaultImage from "../../../assets/default-image.webp";


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

export default function EventCard({ event }: { event: Event }) {
  const navigate = useNavigate();
  const date = new Date(event.time);
  const dateStr = format(date, "dd/MM/yyyy HH:mm");

  const hasThumbnail = Boolean(event.thumbnailUrl && event.thumbnailUrl.trim());

  const goToEventPreview = () => navigate(`/event/${event.eventId}`);

  return (
    <article className="event-card" onClick={goToEventPreview} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") goToEventPreview(); }}>
      <div className="event-card-image-wrapper">
        <img
          src={hasThumbnail ? event.thumbnailUrl! : defaultImage}
          alt={event.name}
          className="event-card-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="event-card-content">
        <div className="event-card-date-tittle">
          <p className="event-card-date">{dateStr}</p>
          <h3 className="event-card-title">{event.name}</h3>
        </div>
        
        <div className="event-card-category-status">
          <p className="event-card-category">
            {categoryTranslate[event.category] ?? event.category} · {event.categoryType}
          </p>

          <p className="event-card-status">
            {statusTranslate[event.status] ?? event.status}
          </p>
        </div>
      </div>
    </article>
  );
}
