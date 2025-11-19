import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../shared/components/Layout";
import { getEventById } from "../../event/api/eventApi";

export default function EventPreviewPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const data = await getEventById(eventId!);
      setEvent(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <Layout onUserClick={() => {}}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          Cargando evento...
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout onUserClick={() => {}}>
        <div style={{ padding: "20px", textAlign: "center" }}>
          Evento no encontrado
        </div>
      </Layout>
    );
  }

  return (
    <Layout onUserClick={() => {}}>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
        
        <div style={{ width: "100%", height: "300px", background: "#ddd", overflow: "hidden" }}>
          {event.bannerImageUrl ? (
            <img
              src={event.bannerImageUrl}
              alt="Banner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555"
              }}
            >
              Sin imagen
            </div>
          )}
        </div>

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            onClick={() => navigate(`/event/${event.eventId}/venue`)}
            style={{
              padding: "12px 24px",
              background: "#1e40af",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Ir al Venue
          </button>
        </div>

      </div>
    </Layout>
  );
}
