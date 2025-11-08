import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useState, useEffect } from "react";
import SectorShape from "./SectorShape";

const WIDTH = 900;
const HEIGHT = 600;

export default function VenueCanvas({
  background,
  sectors,
  selectedId,
  onSelect,
  onTransformLive,
  onTransformCommit,
  onMoveLive,
  onMoveCommit,
  onSeatHoverEnter,
  onSeatHoverLeave,
}: any) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!background) return;
    const img = new Image();
    img.src = background;
    img.onload = () => setImage(img);
  }, [background]);

  return (
    <Stage width={WIDTH} height={HEIGHT} className="border border-gray-600 bg-gray-900 rounded">
      <Layer>
        {image && <KonvaImage image={image} width={WIDTH} height={HEIGHT} opacity={0.4} />}
        {sectors.map((sector: any) => (
          <SectorShape
            key={sector.sectorId}
            sector={sector}
            isSelected={sector.sectorId === selectedId}
            onSelect={() => onSelect(sector.sectorId)}
            onTransformLive={onTransformLive}
            onTransformCommit={onTransformCommit}
            onMoveLive={onMoveLive}
            onMoveCommit={onMoveCommit}
            onSeatHoverEnter={onSeatHoverEnter}
            onSeatHoverLeave={onSeatHoverLeave}
          />
        ))}
      </Layer>
    </Stage>
  );
}
