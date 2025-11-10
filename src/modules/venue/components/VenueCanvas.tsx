import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useState, useEffect, useRef } from "react";
import SectorShape from "./SectorShape";

const WIDTH = 900;
const HEIGHT = 600;

function VenueCanvas({
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
}: any) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const stageRef = useRef<any>(null);

  useEffect(() => {
    setImage(null); // Clear previous image
    if (!background) return;
    const img = new Image();
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null); // Clear on error
    img.src = background;
  }, [background]);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const clampedScale = Math.max(0.5, Math.min(3, newScale)); // Limit zoom between 0.5 and 3

    setScale(clampedScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  const handleMouseDown = (e: any) => {
    if (e.evt.button === 1) { // Middle button
      e.evt.preventDefault();
      setIsPanning(true);
      setLastPos({ x: e.evt.clientX, y: e.evt.clientY });
    }
  };

  const handleMouseMove = (e: any) => {
    if (isPanning) {
      const deltaX = e.evt.clientX - lastPos.x;
      const deltaY = e.evt.clientY - lastPos.y;
      const newPos = { x: position.x + deltaX, y: position.y + deltaY };
      setPosition(newPos);
      setLastPos({ x: e.evt.clientX, y: e.evt.clientY });
      stageRef.current.position(newPos);
      stageRef.current.batchDraw();
    }
  };

  const handleMouseUp = (e: any) => {
    if (e.evt.button === 1) { // Middle button
      setIsPanning(false);
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    stageRef.current.scale({ x: 1, y: 1 });
    stageRef.current.position({ x: 0, y: 0 });
    stageRef.current.batchDraw();
  };

  return (
    <Stage
      ref={stageRef}
      width={WIDTH}
      height={HEIGHT}
      scaleX={scale}
      scaleY={scale}
      x={position.x}
      y={position.y}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="border border-gray-600 bg-gray-900 rounded"
    >
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
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            scale={scale}
          />
        ))}
      </Layer>
    </Stage>
  );
}

export default VenueCanvas;
