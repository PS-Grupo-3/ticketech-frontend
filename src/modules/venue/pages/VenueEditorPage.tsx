import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VenueCanvas from "../components/VenueCanvas";
import SectorSidebar from "../components/SectorSidebar";
import { getVenueById, updateVenue } from "../api/venueApi";
import { getSectorsForVenue, createSector, updateSector, getSeatsForSector, getSectorById } from "../api/sectorApi";

import type { Sector, Shape, Seat } from "../components/Types";
import Layout from "../../../shared/components/Layout";

const CANVAS_WIDTH = 900;

export default function VenueEditorPage() {
  const { venueId } = useParams<{ venueId: string }>();

  const [background, setBackground] = useState<string | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [venue, setVenue] = useState<any>(null);
  const [backgroundImageUrlInput, setBackgroundImageUrlInput] = useState<string>("");
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
      setBackgroundImageUrlInput(data.backgroundImageUrl || "");
      if (data.backgroundImageUrl) setBackground(data.backgroundImageUrl);
    } catch (err) {
      console.error(err);
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
          const rows = full.rowNumber ?? 1;
          const columns = full.columnNumber ?? 1;

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
            rows,
            columns,
          };

          let seats: Seat[] = [];

          if (full.isControlled) {
            const backendSeats = await getSeatsForSector(full.sectorId);
            if (backendSeats && backendSeats.length > 0) seats = backendSeats;
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
      console.error(err);
    }
  };

  const onBackgroundImageUrlChange = async () => {
    if (!venueId || !venue) return;
    const backgroundImageUrl = backgroundImageUrlInput;
    setBackground(backgroundImageUrl);
    try {
      await updateVenue(venueId, {
        name: venue.name,
        totalCapacity: venue.totalCapacity,
        venueTypeId: venue.venueType.venueTypeId,
        address: venue.address,
        mapUrl: venue.mapUrl,
        backgroundImageUrl,
      });
      setVenue({ ...venue, backgroundImageUrl });
    } catch (err) {
      console.error(err);
    }
  };

  const createWithShape = async (type: Shape["type"]) => {
    if (!venueId) return;
    const posX = 80;
    const posY = 80;
    const width = 120;
    const height = 120;

    const payload = {
      name: `Sector ${type}`,
      isControlled: true,
      seatCount: 100,
      capacity: 100,
      rowNumber: 10,
      columnNumber: 10,
      shape: {
        type,
        width,
        height,
        x: posX,
        y: posY,
        rotation: 0,
        padding: 10,
        opacity: 100,
        colour: "#22c55e",
        rows: 10,
        columns: 10,
      },
    };

    try {
      const created = await createSector(venueId, payload);
      setSectors((p) => [...p, created]);
      setSelectedId(created.sectorId);
    } catch (err) {
      console.error(err);
    }
  };

  const buildUpdatePayload = (s: Sector) => ({
    name: s.name,
    isControlled: s.isControlled,
    seatCount: s.seatCount,
    capacity: s.capacity,
    rowNumber: Math.max(1, s.shape.rows ?? 1),
    columnNumber: Math.max(1, s.shape.columns ?? 1),
    shape: {
      type: s.shape.type,
      width: s.shape.width,
      height: s.shape.height,
      x: s.shape.x,
      y: s.shape.y,
      rotation: s.shape.rotation,
      padding: s.shape.padding,
      opacity: s.shape.opacity,
      colour: s.shape.colour,
      rows: Math.max(1, s.shape.rows ?? 1),
      columns: Math.max(1, s.shape.columns ?? 1),
    },
  });


  const replaceLocal = (updated: Sector) =>
    setSectors((prev) =>
      prev.map((s) => (s.sectorId === updated.sectorId ? updated : s))
    );

  const handleCommitToDb = async (sector: Sector) => {
    const payload = buildUpdatePayload(sector);
    try {
      const res = await updateSector(sector.sectorId, payload);
      replaceLocal({ ...sector, ...res });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeatHoverEnter = (seat: Seat) => setHoveredSeat(seat);
  const handleSeatHoverLeave = () => setHoveredSeat(null);

  return (
    <Layout>
  <div className="flex flex-col bg-neutral-950 text-white h-full">

    {/* WORKSPACE */}
    <div className="flex flex-1 overflow-hidden">

      {/* CANVAS SECTION */}
      <div className="flex-1 flex justify-center items-center p-6">

        <div className="relative border border-neutral-800 rounded-xl shadow-lg bg-neutral-900">
          {venueId && (
            <VenueCanvas
              background={background}
              sectors={sectors}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onTransformLive={replaceLocal}
              onTransformCommit={handleCommitToDb}
              onMoveLive={replaceLocal}
              onMoveCommit={handleCommitToDb}
              onSeatHoverEnter={handleSeatHoverEnter}
              onSeatHoverLeave={handleSeatHoverLeave}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            />
          )}

          <button
            onClick={() => window.location.reload()}
            className="absolute top-3 right-3 bg-neutral-800/80 px-3 py-1 rounded-md border border-neutral-700 hover:bg-neutral-700 transition"
          >
            Reset Zoom
          </button>
        </div>

        {hoveredSeat && (
          <div className="absolute top-24 left-8 bg-neutral-900/90 text-white px-3 py-1 rounded shadow-lg border border-neutral-700">
            Fila {hoveredSeat.rowNumber}, Col {hoveredSeat.columnNumber}
          </div>
        )}
      </div>

      {/* SIDEBAR SIEMPRE VISIBLE */}
      <div className="w-[480px] border-l border-neutral-800 bg-neutral-900 shadow-inner overflow-y-auto">

        {selectedId && venueId ? (
          <SectorSidebar
            sector={sectors.find((s) => s.sectorId === selectedId)!}
            onUpdateLocal={replaceLocal}
            onRemoveLocal={(id) => {
              setSectors((p) => p.filter((s) => s.sectorId !== id));
              setSelectedId(null);
            }}
          />
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-neutral-400 px-10 text-center">
            <p className="text-lg opacity-60">Seleccioná un sector para editarlo</p>
            <p className="text-sm mt-2 opacity-40">O creá uno nuevo desde la barra inferior</p>
          </div>
        )}

      </div>

    </div>

    {/* TOOLBAR DE FORMAS (RE DISEÑADA) */}
    {venueId && (
      <div className="h-20 bg-neutral-900 border-t border-neutral-800 flex items-center justify-center gap-6">

        {[
          { type: "rectangle", icon: "▭", label: "Rectángulo" },
          { type: "circle", icon: "○", label: "Círculo" },
          { type: "semicircle", icon: "◐", label: "Semicírculo" },
          { type: "arc", icon: "⌒", label: "Arco" },
        ].map(({ type, icon, label }) => (
          <button
            key={type}
            onClick={() => createWithShape(type)}
            className="flex flex-col items-center justify-center w-16 h-16 
                       rounded-xl border border-neutral-700 bg-neutral-800 
                       hover:bg-blue-600 hover:border-blue-500 transition-all shadow-sm"
            title={label}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-[11px] mt-1">{label}</span>
          </button>
        ))}

      </div>
    )}

  </div>
</Layout>

  );
}
