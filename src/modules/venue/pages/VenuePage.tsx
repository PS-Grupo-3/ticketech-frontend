import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVenueById } from "../../venue/api/venueApi";
import { getSectorsForVenue, getSectorById, getSeatsForSector } from "../api/sectorApi";

import VenueCanvas from "../components/VenueCanvas";
import type { Sector, Shape, Seat } from "../components/Types";

const CANVAS_WIDTH = 900;

export default function VenueViewPage() {
  const { venueId } = useParams<{ venueId: string }>();

  const [venue, setVenue] = useState<any>(null);
  const [background, setBackground] = useState<string | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);

  useEffect(() => {
    if (venueId) {
      loadVenue();
      loadSectors();
    }
  }, [venueId]);

  const loadVenue = async () => {
    if (!venueId) return;

    try {
      const data = await getVenueById(venueId);
      setVenue(data);

      if (data.backgroundImageUrl) {
        setBackground(data.backgroundImageUrl);
      }
    } catch (err) {
      console.error("Error cargando venue", err);
    }
  };

  const loadSectors = async () => {
    if (!venueId) return;

    try {
      const raw = await getSectorsForVenue(venueId);
      const sectorsData = Array.isArray(raw) ? raw : [];

      const enriched: Sector[] = await Promise.all(
        sectorsData.map(async (s: any) => {
          const full = await getSectorById(s.sectorId);

          const shape: Shape = {
            type: full.shape.type,
            width: full.shape.width,
            height: full.shape.height,
            x: full.shape.x,
            y: full.shape.y,
            rotation: full.shape.rotation,
            padding: full.shape.padding,
            opacity: full.shape.opacity,
            colour: full.shape.colour,
            rows: full.rowNumber ?? 1,
            columns: full.columnNumber ?? 1,
          };

          let seats: Seat[] = [];
          if (full.isControlled) {
            const backendSeats = await getSeatsForSector(full.sectorId);
            if (backendSeats && backendSeats.length > 0) {
              seats = backendSeats;
            }
          }

          return {
            sectorId: full.sectorId,
            name: full.name,
            isControlled: full.isControlled,
            seatCount: full.seatCount,
            capacity: full.capacity,
            shape,
            seats,
          };
        })
      );

      setSectors(enriched);
    } catch (err) {
      console.error("Error cargando sectores", err);
    }
  };

  if (!venue) {
    return <p className="text-white p-6">Cargando venue…</p>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Título */}
      <div className="px-8 py-4 border-b border-gray-800">
        <h1 className="text-3xl font-bold">{venue.name}</h1>
        <p className="text-gray-400">{venue.address}</p>
      </div>

      {/* Canvas solo lectura */}
      <div className="flex flex-row flex-nowrap flex-1 overflow-hidden">
        <div
          className="flex flex-col gap-3 p-4 flex-none"
          style={{ width: CANVAS_WIDTH + 32 }}
        >
          <div className="relative">
            <VenueCanvas
              background={background}
              sectors={sectors}
              selectedId={null}               // Nunca selecciona
              onSelect={() => {}}             // Desactivado
              onTransformLive={() => {}}      // Desactivado
              onTransformCommit={() => {}}    // Desactivado
              onMoveLive={() => {}}           // Desactivado
              onMoveCommit={() => {}}         // Desactivado
              onSeatHoverEnter={() => {}}
              onSeatHoverLeave={() => {}}
              onDragStart={() => {}}
              onDragEnd={() => {}}
            />
          </div>
        </div>

        {/* Sin sidebar, porque es read-only */}
      </div>
    </div>
  );
}
