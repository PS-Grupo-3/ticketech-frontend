import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventById } from "../api/eventApi";
import UpdateEventWizard from "./update/UpdateEventWizard";
import Layout from "../../../shared/components/Layout";

export default function UpdateEventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  console.log("EVENT ID:", eventId);

  useEffect(() => {
    if (!eventId) return; // evita undefined
    getEventById(eventId).then(setEvent).catch(console.error);
  }, [eventId]);

  if (!event) return <div className="p-10">Cargando...</div>;

  return (
    <Layout>
      <div style={{ padding: 40 }}>
        <UpdateEventWizard initialData={event} eventId={eventId} />
      </div>
    </Layout>
  );
}
