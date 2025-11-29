import { Stage, Layer, Image as KonvaImage, Rect, Group } from "react-konva";
import { useEffect, useRef, useState } from "react";
import ReaderSectorShape from "./ReaderSectorShape";
import type { EventSectorFull } from "./types";

interface Props {
  background: string | null;
  sectors: EventSectorFull[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function SectorMiniMap({ background, sectors, selectedId, onSelect }: Props) {
  const WIDTH = 900;
  const HEIGHT = 600;

  const stageRef = useRef<any>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (!background) return setImage(null);
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = background;
  }, [background]);

  return (
    <Stage
      width={WIDTH}
      height={HEIGHT}
      ref={stageRef}
      className="bg-neutral-900 rounded border border-neutral-700"
    >
      <Layer>
        {image && <KonvaImage image={image} width={WIDTH} height={HEIGHT} opacity={0.25} />}

        {sectors.map((sector) => {
          const displaySector = {
            ...sector,
            shape: {
              ...sector.shape,
              colour: sector.available ? "#22c55e" : "#404040",
              opacity: sector.available ? sector.shape.opacity : 40
            }
          };

          const isSelected = sector.eventSectorId === selectedId;
          const isHovered = sector.eventSectorId === hoveredId;
          const showBorder = isSelected || isHovered;

          return (
            <Group
              key={sector.eventSectorId}
              onClick={() => onSelect(sector.eventSectorId)}
              listening={true}

              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "pointer";
                setHoveredId(sector.eventSectorId);
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "default";
                setHoveredId(null); 
              }}
            >
              <ReaderSectorShape sector={displaySector} scale={1} />


              
            </Group>
          );
        })}
      </Layer>
    </Stage>
  );
}