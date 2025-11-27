import { useNavigate } from "react-router-dom";
import "./VenueCard.css";
import defaultImage from "../../../assets/default-image.webp";

type Venue = {
  venueId: string;
  name: string;
  address: string;
  totalCapacity: number;
  backgroundImageUrl?: string | null;
  venueType: {
    venueTypeId: number;
    name: string;
  };
};

export default function VenueCard({ venue }: { venue: Venue }) {
  const navigate = useNavigate();
  const hasThumbnail = Boolean(venue.backgroundImageUrl && venue.backgroundImageUrl.trim());

  const goToVenueEditor = () => {
    navigate(`/venue/editor/${venue.venueId}`);
  };

  return (
    <article className="venue-card-general">
      <div className="venue-card" role="button" tabIndex={0} onClick={goToVenueEditor}>
        
        <div className="venue-card-image-wrapper">
          <img
            src={hasThumbnail ? venue.backgroundImageUrl! : defaultImage}
            alt={venue.name}
            className="venue-card-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="venue-card-content">
          <div className="venue-card-info">
            <h3 className="venue-card-title">{venue.name}</h3>
            <p className="venue-card-address">{venue.address}</p>
          </div>
          <div className="venue-card-details">
            <p className="venue-card-capacity">
              Capacidad: {venue.totalCapacity}
            </p>
            <p className="venue-card-type">
              {venue.venueType.name}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
