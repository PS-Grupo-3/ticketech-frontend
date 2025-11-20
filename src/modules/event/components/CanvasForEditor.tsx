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

        {sectors.map(sector => (
          <Group
            key={sector.eventSectorId}
            onClick={() => onSelect(sector.eventSectorId)}
            listening={true}
          >
            <ReaderSectorShape sector={sector} scale={1} />

            {sector.eventSectorId === selectedId && (
              <Rect
                x={sector.shape.x}
                y={sector.shape.y}
                width={sector.shape.width}
                height={sector.shape.height}
                stroke="#3b82f6"
                strokeWidth={4}
              />
            )}
          </Group>
        ))}
      </Layer>
    </Stage>
  );
}
