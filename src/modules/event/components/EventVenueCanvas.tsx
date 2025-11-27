import { Stage, Layer, Image as KonvaImage, Group, Rect, Text } from "react-konva";
import { useEffect, useRef, useState } from "react";
import ReaderSectorShape from "./ReaderSectorShape";
import EventCamera from "./EventCamera";

const WIDTH = 900;
const HEIGHT = 600;

export default function EventVenueCanvas({ background, sectors, selectedSeatId, onSeatClick }: any) {

  const stageRef = useRef<any>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);

  const [tooltip, setTooltip] = useState<any>(null);

  const handleSeatHover = (seat: any, evt: any, sector: any) => {
    const stage = evt.target.getStage();
    if (!stage) return;

    // Posición REAL del mouse, compensada por zoom y pan
    const p = stage.getRelativePointerPosition();
    if (!p) return;

    setTooltip({
      x: p.x,
      y: p.y,
      seat,
      sector
    });
  };

  const handleSeatLeave = () => setTooltip(null);

  useEffect(() => {
    if (!background) return setImage(null);
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = background;
  }, [background]);

  useEffect(() => {
    if (!stageRef.current) return;
    const cam = new EventCamera(stageRef.current);
    cam.enable((s) => setScale(s));
  }, []);

  return (
    <Stage
      ref={stageRef}
      width={WIDTH}
      height={HEIGHT}
      className="border bg-gray-900 rounded"
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

        {sectors
          ?.filter((s: any) => s.available)
          .map((sector: any) => (
            <ReaderSectorShape
              key={sector.eventSectorId}
              sector={sector}
              scale={scale}
              selectedSeatId={selectedSeatId}
              onSeatClick={onSeatClick}
              onSeatHover={handleSeatHover}
              onSeatLeave={handleSeatLeave}
            />
          ))}
      </Layer>

      {tooltip && (
        <Layer listening={false}>          
          <Group x={tooltip.x} y={tooltip.y - 60}>
            <Rect
              width={130}
              height={50}
              fill="#ffffff"
              opacity={1}
              cornerRadius={6}
              stroke="white"
              strokeWidth={1}
            />
            <Text
              x={8}
              y={6}
              fontSize={12}
              fill="black"
              text={
                `Sector: ${tooltip.sector.name}\n` +
                `Fila: ${tooltip.seat.row} | Asiento: ${tooltip.seat.column}\n` +
                `Precio: $${tooltip.sector.price}`
              }
            />
          </Group>
        </Layer>
      )}

    </Stage>
  );
}
