import { Circle } from "react-konva";

function getShapeCenter(shape: any) {
  return { cx: shape.x, cy: shape.y };
}

function applyRotation(x: number, y: number, shape: any) {
  const angle = (shape.rotation || 0) * (Math.PI / 180);
  const { cx, cy } = getShapeCenter(shape);

  const dx = x - cx;
  const dy = y - cy;

  return {
    x: cx + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: cy + dx * Math.sin(angle) + dy * Math.cos(angle),
  };
}

export default function ReaderSeatDots({
  seats,
  shape,
  sector,
  selectedSeatId,
  onSeatClick,
  onSeatHover,
  onSeatLeave,
}: any) {
  if (!seats || seats.length === 0) return null;

  const maxRow = Math.max(...seats.map((s: any) => s.row));
  const maxCol = Math.max(...seats.map((s: any) => s.column));

  const padding = shape.padding ?? 10;
  const width = shape.width ?? 100;
  const height = shape.height ?? 100;

  const { cx, cy } = getShapeCenter(shape);

  return seats
    .filter((s: any) => s.available)
    .map((s: any, i: number) => {
      let x = 0,
        y = 0;

      if (shape.type === "rectangle") {
        const topLeftX = shape.x + padding;
        const topLeftY = shape.y + padding;
        const availableWidth = width - 2 * padding;
        const availableHeight = height - 2 * padding;
        const spacingX = maxCol > 1 ? availableWidth / (maxCol - 1) : 0;
        const spacingY = maxRow > 1 ? availableHeight / (maxRow - 1) : 0;
        x = topLeftX + (s.column - 1) * spacingX;
        y = topLeftY + (s.row - 1) * spacingY;
      }

      else if (shape.type === "circle") {
        const maxRadius = Math.min(width, height) / 2 - padding;
        const radius = (maxRadius / maxRow) * s.row;
        const seatsInRow = maxCol;
        const angle = (2 * Math.PI * (s.column - 1)) / seatsInRow;
        x = cx + radius * Math.cos(angle);
        y = cy + radius * Math.sin(angle);
      }

      else if (shape.type === "semicircle") {
        const maxRadius = Math.min(width / 2, height) - padding;
        const radius = (maxRadius / maxRow) * s.row;

        const startAngle = Math.PI;
        const endAngle = 0;
        const t = maxCol > 1 ? (s.column - 1) / (maxCol - 1) : 0;
        const angle = startAngle + (endAngle - startAngle) * t;

        x = cx + radius * Math.cos(angle);
        y = cy + radius * Math.sin(angle) + 10;
      }

      else if (shape.type === "arc") {
        const outerRadius = shape.width / 2 + padding;
        const innerRadius = shape.width / 4 - padding;

        const paddingRadius = 30;
        const paddingAngleDeg = 6;
        const paddingAngle = (paddingAngleDeg * Math.PI) / 180;

        const usableOuter = outerRadius - paddingRadius;
        const usableInner = innerRadius + paddingRadius;
        const radius =
          usableInner +
          ((usableOuter - usableInner) / (maxRow - 1)) * (s.row - 1);

        const startAngle = Math.PI / 2 - paddingAngle;
        const endAngle = 0 + paddingAngle;

        const t = maxCol > 1 ? (s.column - 1) / (maxCol - 1) : 0;
        const angle = startAngle + (endAngle - startAngle) * t;

        x = cx + radius * Math.cos(angle);
        y = cy + radius * Math.sin(angle);
      }

      if (shape.rotation && shape.rotation !== 0) {
        const rotated = applyRotation(x, y, shape);
        x = rotated.x;
        y = rotated.y;
      }

      const isSelected = selectedSeatId === s.eventSeatId;

      return (
        <Circle
          key={i}
          x={x}
          y={y}
          radius={isSelected ? 6 : 4}
          fill={isSelected ? "#1e40af" : "white"}
          stroke={isSelected ? "#93c5fd" : "white"}
          strokeWidth={isSelected ? 3 : 1}
          opacity={0.9}
          listening={true}
          onClick={() => onSeatClick(s, sector)}
          onMouseEnter={(evt) => onSeatHover(s, evt, sector)}
          onMouseLeave={onSeatLeave}
        />
      );
    });
}
