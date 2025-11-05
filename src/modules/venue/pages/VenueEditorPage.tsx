import { useEffect, useState } from "react";
import VenueCanvas from "../components/VenueCanvas";
import SectorSidebar from "../components/SectorSidebar";
import { getSectorsForVenue, createSector, updateSector, getVenueById, updateVenue } from "../api/sectorApi";

const CANVAS_WIDTH = 900;

// PONER ID DEL VENUE DE TU BD
const VENUE_ID = "7fcd3fe6-504c-4f34-affa-6ef9f9031645";

export default function VenueEditorPage() {
  const [background, setBackground] = useState<string | null>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [venue, setVenue] = useState<any>(null);
  const [backgroundImageUrlInput, setBackgroundImageUrlInput] = useState<string>("");

  useEffect(() => {
    loadVenue();
    loadSectors();
  }, []);

  const loadVenue = async () => {
    console.log("[LOAD] Loading venue", VENUE_ID);
    try {
      const data = await getVenueById(VENUE_ID);
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
    console.log("[LOAD] Loading sectors for venue", VENUE_ID);
    try {
      const data = await getSectorsForVenue(VENUE_ID);
      setSectors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[LOAD] Failed:", err);
    }
  };

  const onBackgroundImageUrlChange = async () => {
    if (!venue) return;
    const backgroundImageUrl = backgroundImageUrlInput;
    setBackground(backgroundImageUrl);
    try {
      await updateVenue(VENUE_ID, { name: venue.name, totalCapacity: venue.totalCapacity, venueTypeId: venue.venueType.venueTypeId, address: venue.address, mapUrl: venue.mapUrl, backgroundImageUrl });
      setVenue({ ...venue, backgroundImageUrl });
    } catch (err) {
      console.error("[SAVE] Background Image URL failed:", err);
    }
  };

  const createWithShape = async (type: string) => {
    const posX = 80, posY = 80, width = 120, height = 120;
    const payload = {
      name: `Sector ${type}`,
      isControlled: true,
      seatCount: 100,
      capacity: 100,
      posX,
      posY,
      width,
      height,
      shape: { type, width, height, x: posX, y: posY, rotation: 0, padding: 0, opacity: 100, colour: "#22c55e" },
    };
    try {
      const created = await createSector(VENUE_ID, payload);
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
    width: Math.max(1, s.width ?? s.shape?.width ?? 100),
    height: Math.max(1, s.height ?? s.shape?.height ?? 100),
    shape: {
      type: s.shape?.type ?? "rectangle",
      width: Math.max(1, s.shape?.width ?? s.width ?? 100),
      height: Math.max(1, s.shape?.height ?? s.height ?? 100),
      x: Math.max(0, s.shape?.x ?? s.posX ?? 0),
      y: Math.max(0, s.shape?.y ?? s.posY ?? 0),
      rotation: s.shape?.rotation ?? 0,
      padding: s.shape?.padding ?? 0,
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

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col gap-3 p-4" style={{ width: CANVAS_WIDTH + 32 }}>
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
          <VenueCanvas
            background={background}
            sectors={sectors}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onTransformLive={replaceLocal}
            onTransformCommit={handleCommitToDb}
            onMoveLive={replaceLocal}
            onMoveCommit={handleCommitToDb}
          />
        </div>
        {selectedId && (
          <SectorSidebar
            sector={sectors.find(s => s.sectorId === selectedId)}
            onUpdateLocal={replaceLocal}
            onRemoveLocal={(id: string) => {
              setSectors(prev => prev.filter(s => s.sectorId !== id));
              if (selectedId === id) setSelectedId(null);
            }}
          />
        )}
      </div>
      <div className="h-20 border-t border-gray-700 bg-gray-800 flex items-center justify-center">
        {["rectangle", "circle", "semicircle", "arc"].map(t => (
          <button key={t} onClick={() => createWithShape(t)} className="bg-gray-700 px-4 py-2 rounded hover:bg-blue-600">
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
