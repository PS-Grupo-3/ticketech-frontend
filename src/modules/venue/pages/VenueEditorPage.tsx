import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VenueCanvas from "../components/VenueCanvas";
import SectorSidebar from "../components/SectorSidebar";
import { getSectorsForVenue, createSector, updateSector, getVenueById, updateVenue, getSeatsForSector, getSectorById } from "../api/sectorApi";
import { generateRectangleSeats, generateCircleSeats, generateSemicircleSeats, generateArcSeats } from "../lib/seatGenerator";

const CANVAS_WIDTH = 900;

export default function VenueEditorPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const [background, setBackground] = useState<string | null>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [venue, setVenue] = useState<any>(null);
  const [backgroundImageUrlInput, setBackgroundImageUrlInput] = useState<string>("");
  const [hoveredSeat, setHoveredSeat] = useState<any>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (venueId) {
      loadVenue();
      loadSectors();
    }
  }, [venueId]);

  const loadVenue = async () => {
    if (!venueId) return;
    console.log("[LOAD] Loading venue", venueId);
    try {
      const data = await getVenueById(venueId);
      setVenue(data);
      setBackgroundImageUrlInput(data.backgroundImageUrl || "");
      if (data.backgroundImageUrl) {
        setBackground(data.backgroundImageUrl);
      }
    } catch (err) {
      console.error("[LOAD] Venue failed:", err);
    }
  };

  const loadSectors = async () => {
    if (!venueId) return;
    console.log("[LOAD] Loading sectors for venue", venueId);
    try {
      const data = await getSectorsForVenue(venueId);
      const sectorsData = Array.isArray(data) ? data : [];

      // Fetch full details for each sector to get rowNumber and columnNumber
      const sectorsWithDetails = await Promise.all(
        sectorsData.map(async (sector: any) => {
          try {
            const fullSector = await getSectorById(sector.sectorId);
            return {
              ...fullSector,
              rows: fullSector.rowNumber || 1,
              cols: fullSector.columnNumber || 1,
            };
          } catch (err) {
            console.error(`[LOAD] Failed to load full details for sector ${sector.sectorId}:`, err);
            return sector;
          }
        })
      );

      // Load seats for controlled sectors
      const sectorsWithSeats = await Promise.all(
        sectorsWithDetails.map(async (sector: any) => {
          // Map backend fields to frontend fields
          const mappedSector = {
            ...sector,
            rows: sector.rowNumber || 1,
            cols: sector.columnNumber || 1,
          };
          if (sector.isControlled) {
            try {
              const seats = await getSeatsForSector(sector.sectorId);
              // If no seats from backend, generate locally based on shape
              if (!seats || seats.length === 0) {
                const width = mappedSector.shape?.width || mappedSector.width || 100;
                const height = mappedSector.shape?.height || mappedSector.height || 100;
                const rows = mappedSector.rows;
                const cols = mappedSector.cols;
                let generatedSeats = [];
                switch (mappedSector.shape?.type) {
                  case "rectangle":
                    generatedSeats = generateRectangleSeats(width, height, rows, cols);
                    break;
                  case "circle":
                    generatedSeats = generateCircleSeats(width, height, rows, cols);
                    break;
                  case "semicircle":
                    generatedSeats = generateSemicircleSeats(width, height, rows, cols);
                    break;
                  case "arc":
                    generatedSeats = generateArcSeats(width, height, rows, cols);
                    break;
                  default:
                    generatedSeats = generateRectangleSeats(width, height, rows, cols);
                }
                // Convert to backend format with rowNumber and columnNumber
                const seatsWithNumbers = generatedSeats.map((seat, index) => ({
                  seatId: `temp-${index}`,
                  posX: seat.x,
                  posY: seat.y,
                  rowNumber: Math.floor(index / cols) + 1,
                  columnNumber: (index % cols) + 1,
                }));
                return { ...mappedSector, seats: seatsWithNumbers };
              }
              return { ...mappedSector, seats };
            } catch (err) {
              console.error(`[LOAD] Failed to load seats for sector ${sector.sectorId}:`, err);
              return mappedSector;
            }
          }
          return mappedSector;
        })
      );

      setSectors(sectorsWithSeats);
    } catch (err) {
      console.error("[LOAD] Failed:", err);
    }
  };

  const onBackgroundImageUrlChange = async () => {
    if (!venue || !venueId) return;
    const backgroundImageUrl = backgroundImageUrlInput;
    setBackground(backgroundImageUrl);
    try {
      await updateVenue(venueId, { name: venue.name, totalCapacity: venue.totalCapacity, venueTypeId: venue.venueType.venueTypeId, address: venue.address, mapUrl: venue.mapUrl, backgroundImageUrl });
      setVenue({ ...venue, backgroundImageUrl });
    } catch (err) {
      console.error("[SAVE] Background Image URL failed:", err);
    }
  };

  const createWithShape = async (type: string) => {
    if (!venueId) return;
    const posX = 80, posY = 80, width = 120, height = 120;
    const payload = {
      name: `Sector ${type}`,
      isControlled: true,
      seatCount: 100,
      capacity: 100,
      rowNumber: 10,
      columnNumber: 10,
      posX,
      posY,
      width,
      height,
      shape: { type, width, height, x: posX, y: posY, rotation: 0, padding: 10, opacity: 100, colour: "#22c55e" },
    };
    try {
      const created = await createSector(venueId, payload);
      setSectors(p => [...p, created]);
      setSelectedId(created.sectorId);
    } catch (err) {
      console.error("[CREATE] Error:", err);
    }
  };

  const buildUpdatePayload = (s: any) => ({
    name: s.name,
    isControlled: s.isControlled ?? false,
    seatCount: s.seatCount ?? 0,
    capacity: s.capacity ?? 0,
    rowNumber: s.rows ?? 1,
    columnNumber: s.cols ?? 1,
    width: Math.max(1, s.width ?? s.shape?.width ?? 100),
    height: Math.max(1, s.height ?? s.shape?.height ?? 100),
    shape: {
      type: s.shape?.type ?? "rectangle",
      width: Math.max(1, s.shape?.width ?? s.width ?? 100),
      height: Math.max(1, s.shape?.height ?? s.height ?? 100),
      x: Math.max(0, s.shape?.x ?? s.posX ?? 0),
      y: Math.max(0, s.shape?.y ?? s.posY ?? 0),
      rotation: s.shape?.rotation ?? 0,
      padding: Math.max(10, s.shape?.padding ?? 10),
      opacity: s.shape?.opacity ?? 100,
      colour: s.shape?.colour ?? "#22c55e",
    },
  });

  const replaceLocal = (updated: any) => setSectors(prev => prev.map(s => s.sectorId === updated.sectorId ? updated : s));

  const handleCommitToDb = async (sector: any) => {
    const payload = buildUpdatePayload(sector);
    console.group("[COMMIT]");
    console.log("sectorId:", sector.sectorId);
    console.log("payload:", JSON.stringify(payload, null, 2));
    console.groupEnd();
    try {
      const res = await updateSector(sector.sectorId, payload);
      setSectors(prev => prev.map(s => s.sectorId === sector.sectorId ? { ...sector, ...res } : s));
    } catch (err) {
      console.error("[COMMIT] Error:", err);
    }
  };

  const handleSeatHoverEnter = (seat: any) => {
    setHoveredSeat(seat);
  };

  const handleSeatHoverLeave = () => {
    setHoveredSeat(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <div className="flex flex-1 overflow-hidden justify-centeres">
        <div className="flex flex-col gap-3 p-4" style={{ width: CANVAS_WIDTH + 32 }}>
          {venueId && (
            <div className="flex gap-2 text-black">
              <input
                type="text"
                placeholder="Enter background image URL"
                value={backgroundImageUrlInput}
                onChange={(e) => setBackgroundImageUrlInput(e.target.value)}
                className="border p-2 rounded flex-1"
              />
              <button
                onClick={onBackgroundImageUrlChange}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Image
              </button>
            </div>
          )}
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
        </div>
        {selectedId && venueId && (
          <SectorSidebar
            sector={sectors.find(s => s.sectorId === selectedId)}
            onUpdateLocal={replaceLocal}
            onRemoveLocal={(id: string) => {
              setSectors(prev => prev.filter(s => s.sectorId !== id));
              if (selectedId === id) setSelectedId(null);
            }}
            isDragging={isDragging}
          />
        )}
        {hoveredSeat && (
          <div className="absolute top-24 left-8 bg-black text-white p-2 rounded shadow-lg">
            Row {hoveredSeat.rowNumber}, Col {hoveredSeat.columnNumber}
          </div>
        )}
      </div>
      {venueId && (
        <div className="h-20 border-t border-gray-700 bg-gray-800 flex items-center justify-center gap-4">
          {[
            { type: "rectangle", icon: "▭", label: "Rectángulo" },
            { type: "circle", icon: "○", label: "Círculo" },
            { type: "semicircle", icon: "◐", label: "Semicírculo" },
            { type: "arc", icon: "⌒", label: "Arco" }
          ].map(({ type, icon, label }) => (
            <button
              key={type}
              onClick={() => createWithShape(type)}
              className="bg-gray-700 px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
              title={label}
            >
              <span className="text-lg">{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
