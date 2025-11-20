import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventFull, updateSeatStatus } from "../api/eventApi";
import EventVenueCanvas from "../components/EventVenueCanvas";
import Layout from "../../../shared/components/Layout";
import backgroundImage from "../../../../public/banners/eventBanner.jpg";

export default function EventVenuePage() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState<any>(null);

  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [selectedSector, setSelectedSector] = useState<any>(null);

  useEffect(() => {
    if (!eventId) return;

    const load = () => {
      getEventFull(eventId).then((d) => {
        setEventData(d);

        if (selectedSeat) {
          const stillExists = d.sectors
            .flatMap((s: any) => s.seats)
            .some((x: any) => x.eventSeatId === selectedSeat.eventSeatId && x.available);

          if (!stillExists) {
            setSelectedSeat(null);
            setSelectedSector(null);
          }
        }
      });
    };

    load();

    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [eventId, selectedSeat]);

  const handleBuy = async () => {
    if (!eventId || !selectedSeat) return;

    try {
      await updateSeatStatus(eventId, selectedSeat.eventSeatId, { available: false });

      const updated = await getEventFull(eventId);
      setEventData(updated);
      setSelectedSeat(null);
      setSelectedSector(null);
    } catch (err) {
      console.error("Error comprando asiento", err);
    }
  };

  if (!eventData) {
    return (
      <Layout>
        Cargando...
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ position: "relative", backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh", padding: "40px 0", overflow: "visible" }}>
        
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.85))", backdropFilter: "brightness(0.6)", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>

          <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "white", textAlign: "left", marginBottom: "30px", textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}>
            {eventData.name}
          </h1>

          <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", justifyContent: "center" }}>

            <div style={{ flex: 1, maxWidth: "fit-content", padding: "5px", background: "rgba(20,20,20,0.55)", backdropFilter: "blur(6px)", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
              <EventVenueCanvas background={eventData.venueBackgroundImageUrl} sectors={eventData.sectors} selectedSeatId={selectedSeat?.eventSeatId || null} 
                onSeatClick={(seat: any, sector: any) => {
                  setSelectedSeat(seat);
                  setSelectedSector(sector);
                }}
              />
            </div>

            <div style={{ width: "340px", padding: "20px", background: "rgba(17,24,39,0.9)", borderRadius: "12px", color: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.55)" }}>
              
              <h2 style={{ fontSize: "20px", marginBottom: "12px", borderBottom: "1px solid #333", paddingBottom: "8px" }}>
                Entradas
              </h2>

              <div style={{ marginBottom: "10px", fontSize: "14px", opacity: 0.9 }}>
                {selectedSector ? `Sector seleccionado: ${selectedSector.name}` : "Sector seleccionado: Ninguno"}
              </div>

              <div style={{ marginBottom: "20px", fontSize: "14px", opacity: 0.9 }}>
                {selectedSeat ? `Asiento seleccionado: fila ${selectedSeat.row}, columna ${selectedSeat.column}` : "Asiento seleccionado: Ninguno"}
              </div>

               <div style={{
                    marginBottom: "30px",
                    textAlign: "center",
                    padding: "20px",
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: "12px",
                    border: "1px solid #444",
                  }}>
                    {selectedSeat ? (
                      <div style={{
                        fontSize: "48px",
                        fontWeight: "900",
                        color: "#4ade80",
                        textShadow: "0 0 10px rgba(0,0,0,0.7)"
                      }}>
                        ${selectedSeat.price}
                      </div>
                    ) : (
                      <div style={{
                        fontSize: "22px",
                        opacity: 0.5
                      }}>
                        Precio
                      </div>
                    )}
                  </div>



              <div onClick={handleBuy} style={{ padding: "14px", background: selectedSeat ? "#1e40af" : "#444", borderRadius: "8px", textAlign: "center", cursor: selectedSeat ? "pointer" : "not-allowed", fontWeight: "bold", letterSpacing: "0.5px" }} >
                Comprar
              </div>

            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
