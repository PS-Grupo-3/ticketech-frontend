import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { ArrowLeft } from "lucide-react"; 

import VenueCanvas from "../components/VenueCanvas";
import SectorSidebar from "../components/SectorSidebar";
import Layout from "../../../shared/components/Layout";

import { getVenueById, updateVenue } from "../api/venueApi";
import { 
  getSectorsForVenue, 
  createSector, 
  updateSector, 
  getSeatsForSector, 
  getSectorById 
} from "../api/sectorApi";

import type { Sector, Shape, Seat } from "../components/Types";

const CANVAS_WIDTH = 900;

export default function VenueEditorPage() {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate(); 

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

          const rows =
            full.shape?.rows ??
            full.rowNumber ??
            (full.seats?.length ? Math.max(...full.seats.map((x: any) => x.rowNumber)) : 1);

          const columns =
            full.shape?.columns ??
            full.shape?.cols ??
            full.columnNumber ??
            (full.seats?.length ? Math.max(...full.seats.map((x: any) => x.columnNumber)) : 1);

          let seats: Seat[] = [];
          if (full.isControlled) {
            seats = await getSeatsForSector(full.sectorId);
          }

          return {
            sectorId: full.sectorId,
            name: full.name,
            isControlled: full.isControlled,
            seatCount: full.seatCount,
            capacity: full.capacity,
            seats,
            shape: {          
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
              columns  
            },        
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
      <div className="flex flex-col bg-neutral-950 text-white h-[calc(100vh-64px)]"> 
        <div className="h-14 border-b border-neutral-800 flex items-center px-6 justify-between bg-neutral-900 shrink-0">
            
            <button 
              onClick={() => navigate("/venue")} 
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} /> 
              <span className="font-medium">Volver a Mis Venues</span>
            </button>

            <div className="flex items-center gap-6">
                <h1 className="text-sm font-bold text-white tracking-wide">
                  {venue?.name || "Cargando..."}
                </h1>
                
               
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden">

          <div className="flex-1 flex justify-center items-center p-8 bg-neutral-950 relative overflow-hidden">
            
            <div className="relative border border-neutral-800 rounded-xl shadow-2xl bg-neutral-900">
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
                className="absolute top-4 right-4 bg-neutral-800/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-neutral-600 hover:bg-neutral-700 transition text-xs font-medium text-gray-300 shadow-lg"
              >
                Reset Zoom
              </button>
            </div>

            {hoveredSeat && (
              <div className="absolute top-8 left-8 bg-black/90 text-white px-4 py-2 rounded-lg shadow-xl border border-neutral-700 pointer-events-none z-50">
                <p className="text-xs text-gray-400 uppercase font-bold">Ubicación</p>
                <p className="text-sm font-medium">Fila {hoveredSeat.rowNumber} <span className="mx-1 text-gray-600">|</span> Col {hoveredSeat.columnNumber}</p>
              </div>
            )}
          </div>

          <div className="w-[400px] border-l border-neutral-800 bg-neutral-900 shadow-xl z-10 h-full flex flex-col">
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
              <div className="h-full flex flex-col justify-center items-center text-neutral-500 px-10 text-center select-none">
                <div className="mb-4 p-4 bg-neutral-800 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M3 3h18v18H3z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                </div>
                <p className="text-lg font-medium text-neutral-400">Seleccioná un sector</p>
                <p className="text-sm mt-2 opacity-60">Hacé clic en el mapa para editar propiedades <br/> o agregá uno nuevo desde abajo.</p>
              </div>
            )}
          </div>

        </div>

        {venueId && (
          <div className="h-24 bg-neutral-900 border-t border-neutral-800 flex items-center justify-center gap-6 shrink-0 z-20">
            {[
              { type: "rectangle", icon: "▭", label: "Rectángulo" },
              { type: "circle", icon: "○", label: "Círculo" },
              { type: "semicircle", icon: "◐", label: "Semicírculo" },
              { type: "arc", icon: "⌒", label: "Arco" },
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => createWithShape(type as any)}
                className="flex flex-col items-center justify-center w-16 h-16 
                           rounded-xl border border-neutral-700 bg-neutral-800 
                           hover:bg-blue-600 hover:border-blue-500 hover:text-white
                           active:scale-95
                           transition-all shadow-sm group"
                title={`Agregar ${label}`}
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-[10px] text-neutral-400 group-hover:text-blue-100 font-medium uppercase tracking-wide">{label}</span>
              </button>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}