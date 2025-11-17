import { Circle } from "react-konva";

function getShapeCenter(shape: any) {
  if (shape.type === "rectangle") {
    return { cx: shape.x, cy: shape.y };    
  }
  return { cx: shape.x, cy: shape.y }; // circle, arc, semicircle
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

export default function SeatDots({
  seats,
  shape,
  onHoverEnter,
  onHoverLeave,
}: {
  seats: any[];
  shape?: any;
  onHoverEnter?: (seat: any, e: any) => void;
  onHoverLeave?: () => void;
}) {
  if (!seats || seats.length === 0) return null;

  const maxRow = Math.max(...seats.map((s) => s.rowNumber));
  const maxCol = Math.max(...seats.map((s) => s.columnNumber));

  const padding = shape?.padding ?? 10;
  const width = shape?.width ?? 100;
  const height = shape?.height ?? 100;

  const { cx, cy } = getShapeCenter(shape); // always correct now

  return seats.map((s, i) => {
    let x = 0,
      y = 0;

    if (shape?.type === "rectangle") {
      const topLeftX = shape.x + padding;
      const topLeftY = shape.y + padding;
      const availableWidth = width - 2 * padding;
      const availableHeight = height - 2 * padding;
      const spacingX = maxCol > 1 ? availableWidth / (maxCol - 1) : 0;
      const spacingY = maxRow > 1 ? availableHeight / (maxRow - 1) : 0;
      x = topLeftX + (s.columnNumber - 1) * spacingX;
      y = topLeftY + (s.rowNumber - 1) * spacingY;
    }

    else if (shape?.type === "circle") {
      const maxRadius = Math.min(width, height) / 2 - padding;
      const radius = (maxRadius / maxRow) * s.rowNumber;
      const seatsInRow = maxCol;
      const angle = (2 * Math.PI * (s.columnNumber - 1)) / seatsInRow;
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }

    else if (shape?.type === "semicircle") {
      const maxRadius = Math.min(width / 2, height) - padding;
      const radius = (maxRadius / maxRow) * s.rowNumber;
      const startAngle = Math.PI;
      const endAngle = 0;
      const t = maxCol > 1 ? (s.columnNumber - 1) / (maxCol - 1) : 0;
      const angle = startAngle + (endAngle - startAngle) * t;
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle) + 10; // esos 10 para que no este tan pegado
    }

    else if (shape?.type === "arc") {
      const outerRadius = (shape.width / 2) + padding;
      const innerRadius = (shape.width / 4) - padding;

      const paddingRadius = 30; 
      const paddingAngleDeg = 6; 
      const paddingAngle = (paddingAngleDeg * Math.PI) / 180;

      const usableOuter = outerRadius - paddingRadius;
      const usableInner = innerRadius + paddingRadius;

      const radius = usableInner + ((usableOuter - usableInner) / (maxRow - 1)) * (s.rowNumber - 1);

      const startAngle = Math.PI / 2 - paddingAngle; // 90°
      const endAngle = 0 + paddingAngle;             // 0°

      const t = maxCol > 1 ? (s.columnNumber - 1) / (maxCol - 1) : 0;
      const angle = startAngle + (endAngle - startAngle) * t;

      const cx = shape.x;
      const cy = shape.y;

      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }


    if (shape?.rotation && shape.rotation !== 0) {
      const rotated = applyRotation(x, y, shape);
      x = rotated.x;
      y = rotated.y;
    }

    return (
      <Circle
        key={i}
        x={x}
        y={y}
        radius={4}
        fill="black"
        stroke="white"
        strokeWidth={1}
        opacity={0.9}
        onMouseEnter={(e) => onHoverEnter?.(s, e)}
        onMouseLeave={onHoverLeave}
      />
    );
  });
}
