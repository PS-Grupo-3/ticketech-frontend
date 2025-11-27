import { Rect, Circle, Arc, Text } from "react-konva";
import ReaderSeatDots from "./ReaderSeatDots";

function getCenter(shape: any) {
  const x = shape.x;
  const y = shape.y;
  const width = shape.width;
  const height = shape.height;
  const rotation = (shape.rotation ?? 0) * (Math.PI / 180);

  if (shape.type === "rectangle") {
    const cx = x;
    const cy = y;
    const textX = cx + width / 2;
    const textY = cy + height / 2;
    const dx = textX - cx;
    const dy = textY - cy;

    return {
      x: cx + dx * Math.cos(rotation) - dy * Math.sin(rotation),
      y: cy + dx * Math.sin(rotation) + dy * Math.cos(rotation),
    };
  }

  if (shape.type === "circle") {
    return { x, y };
  }

  if (shape.type === "semicircle") {
    const outerRadius = width / 2;
    const cx = x;
    const cy = y;
    const midRadius = outerRadius / 2;
    const midAngle = Math.PI / 2;

    const textX = cx + midRadius * Math.cos(midAngle);
    const textY = cy + midRadius * Math.sin(midAngle);
    const dx = textX - cx;
    const dy = textY - cy;

    return {
      x: cx + dx * Math.cos(rotation) - dy * Math.sin(rotation),
      y: cy + dx * Math.sin(rotation) + dy * Math.cos(rotation),
    };
  }

  if (shape.type === "arc") {
    const innerRadius = width / 4;
    const outerRadius = width / 2;
    const cx = x;
    const cy = y;
    const midRadius = (innerRadius + outerRadius) / 2;
    const midAngle = Math.PI / 4;
    const textX = cx + midRadius * Math.cos(midAngle);
    const textY = cy + midRadius * Math.sin(midAngle);
    const dx = textX - cx;
    const dy = textY - cy;

    return {
      x: cx + dx * Math.cos(rotation) - dy * Math.sin(rotation),
      y: cy + dx * Math.sin(rotation) + dy * Math.cos(rotation),
    };
  }

  return {
    x: x + width / 2,
    y: y + height / 2,
  };
}

export default function ReaderSectorShape({
  sector,
  scale,
  selectedSeatId,
  onSeatClick,
  onSeatHover,
  onSeatLeave
}: any) {
  const shape = sector.shape;

  const props = {
    x: shape.x,
    y: shape.y,
    rotation: shape.rotation,
    fill: shape.colour,
    opacity: (shape.opacity ?? 100) / 100,
    stroke: "white",
    strokeWidth: 1,
    listening: true,
    onClick: () => onSeatClick(null, sector),   // <-- CLICK UNIVERSAL
  };

  const center = getCenter(shape);
  const showSeats = scale >= 1.4;

  const fontSize = 14 / scale;
  const textLines = sector.isControlled
    ? [sector.name]
    : [sector.name, `${sector.capacity} disponibles`];

  const maxLineLength = Math.max(...textLines.map((l) => l.length));
  const offsetX = (maxLineLength * fontSize * 0.22) / 1.0;
  const offsetY = (textLines.length * fontSize) / 2;

  return (
    <>
      {shape.type === "rectangle" && (
        <Rect {...props} width={shape.width} height={shape.height} />
      )}

      {shape.type === "circle" && (
        <Circle {...props} radius={shape.width / 2} />
      )}

      {shape.type === "semicircle" && (
        <Arc
          {...props}
          innerRadius={0}
          outerRadius={shape.width / 2}
          angle={180}
        />
      )}

      {shape.type === "arc" && (
        <Arc
          {...props}
          innerRadius={shape.width / 4}
          outerRadius={shape.width / 2}
          angle={90}
        />
      )}

      {!showSeats && (
        <Text
          x={center.x}
          y={center.y}
          text={textLines.join("\n")}
          fontSize={fontSize}
          fill="white"
          align="center"
          verticalAlign="middle"
          offsetX={offsetX}
          offsetY={offsetY}
          rotation={shape.rotation}
        />
      )}

      {showSeats && (
        <ReaderSeatDots
          seats={sector.seats}
          shape={shape}
          sector={sector}
          onSeatClick={onSeatClick}
          onSeatHover={onSeatHover}
          onSeatLeave={onSeatLeave}
          selectedSeatId={selectedSeatId}
        />
      )}

    </>
  );
}
