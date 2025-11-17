import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useEffect, useRef, useState } from "react";
import CanvasCamera from "./canvas/CanvasCamera";
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
  onDragStart,
  onDragEnd,
  onReadyCamera,
}: any) {
  const stageRef = useRef<any>(null);
  const cameraRef = useRef<CanvasCamera | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);

  // background loader
  useEffect(() => {
    if (!background) {
      setImage(null);
      return;
    }
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = background;
  }, [background]);

  // camera init
  useEffect(() => {
    if (stageRef.current && !cameraRef.current) {
      const cam = new CanvasCamera(stageRef.current);
      cam.enable();
      cameraRef.current = cam;

      if (onReadyCamera) onReadyCamera(cam);

      stageRef.current.on("scaleChange", () => {
        const s = stageRef.current.scaleX();
        setScale(s);
      });
    }
  }, []);

  return (
    <Stage
      ref={stageRef}
      width={WIDTH}
      height={HEIGHT}
      className="border border-gray-600 bg-gray-900 rounded"
    >
      <Layer>
        {image && (
          <KonvaImage
            image={image}
            width={WIDTH}
            height={HEIGHT}
            opacity={0.4}
          />
        )}

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
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            scale={scale}
          />
        ))}
      </Layer>
    </Stage>
  );
}
