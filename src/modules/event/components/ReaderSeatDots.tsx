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
    y: cy + dx * Math.sin(angle) + dy * Math.cos(angle)
  };
}

export default function ReaderSeatDots({ seats, shape, sector, onSeatClick }: any) {
  if (!seats || seats.length === 0) return null;

  const maxRow = Math.max(...seats.map((s: any) => s.row));
  const maxCol = Math.max(...seats.map((s: any) => s.column));

  const padding = shape.padding ?? 10;
  const width = shape.width;
  const height = shape.height;


  return seats
    .filter((s: any) => s.available) // oculta seats no disponibles
    .map((s: any, i: number) => {
      let x = 0;
      let y = 0;

      if (shape.type === "rectangle") {
        const left = shape.x + padding;
        const top = shape.y + padding;

        const spacingX = maxCol > 1 ? (width - padding * 2) / (maxCol - 1) : 0;
        const spacingY = maxRow > 1 ? (height - padding * 2) / (maxRow - 1) : 0;

        x = left + (s.column - 1) * spacingX;
        y = top + (s.row - 1) * spacingY;
      }

      if (shape.rotation) {
        const r = applyRotation(x, y, shape);
        x = r.x;
        y = r.y;
      }

      return (
        <Circle key={i} x={x} y={y} radius={4} fill={"white"} stroke="white" opacity={0.9} listening={true} onClick={() => onSeatClick(s, sector)} />
      );
    });
}
