import { Rect, Circle, Arc, Text } from "react-konva";
import ReaderSeatDots from "./ReaderSeatDots";

export default function ReaderSectorShape({ sector, scale, onSeatClick }: any) {
  const shape = sector.shape;

  const props = {
    x: shape.x,
    y: shape.y,
    rotation: shape.rotation,
    fill: shape.colour,
    opacity: (shape.opacity ?? 100) / 100,
    stroke: "white",
    strokeWidth: 1,
    listening: false
  };

  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;
  const showSeats = scale >= 1.4;

  return (
    <>
      {shape.type === "rectangle" && (
        <Rect {...props} width={shape.width} height={shape.height} />
      )}
      {shape.type === "circle" && <Circle {...props} radius={shape.width / 2} />}
      {shape.type === "semicircle" && (
        <Arc {...props} innerRadius={0} outerRadius={shape.width / 2} angle={180} />
      )}
      {shape.type === "arc" && (
        <Arc {...props} innerRadius={shape.width / 4} outerRadius={shape.width / 2} angle={90} />
      )}

      {!showSeats && (
        <Text x={centerX} y={centerY} text={sector.name} fontSize={14 / scale} fill="white" align="center" offsetX={(sector.name.length * (14 / scale)) / 2} offsetY={7 / scale} />
      )}

      {showSeats && (
        <ReaderSeatDots seats={sector.seats} shape={shape} sector={sector} onSeatClick={onSeatClick} />
      )}
    </>
  );
}
