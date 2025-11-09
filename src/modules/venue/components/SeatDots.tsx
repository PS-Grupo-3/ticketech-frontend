import { Circle, Rect } from "react-konva";

export default function SeatDots({ seats, shape, onHoverEnter, onHoverLeave }: { seats: any[]; shape?: any; onHoverEnter?: (seat: any, e: any) => void; onHoverLeave?: () => void }) {
  console.debug("[SeatDots] Rendering seats:", seats.length, "shape:", shape);

  if (!seats || seats.length === 0) return null;

  // Calculate positions based on rowNumber and columnNumber for all shapes
  const maxRow = Math.max(...seats.map(s => s.rowNumber));
  const maxCol = Math.max(...seats.map(s => s.columnNumber));
  const padding = shape?.padding || 10;
  const shapeX = shape?.x || 0;
  const shapeY = shape?.y || 0;
  const width = shape?.width || 100;
  const height = shape?.height || 100;

  console.debug(`[SeatDots] Shape: ${shape?.type}, maxRow=${maxRow}, maxCol=${maxCol}, padding=${padding}, shapeX=${shapeX}, shapeY=${shapeY}, width=${width}, height=${height}`);

  return seats.map((s, i) => {
    let x, y;

    if (shape?.type === "rectangle") {
      // Rectangle: grid layout
      const availableWidth = width - 2 * padding;
      const availableHeight = height - 2 * padding;
      const spacingX = maxCol > 1 ? availableWidth / (maxCol - 1) : 0;
      const spacingY = maxRow > 1 ? availableHeight / (maxRow - 1) : 0;
      x = shapeX + padding + (s.columnNumber - 1) * spacingX;
      y = shapeY + padding + (s.rowNumber - 1) * spacingY;
    } else if (shape?.type === "circle") {
      // Circle: radial layout
      const centerX = width / height;
      const centerY = height / width;
      const maxRadius = Math.min(width, height) / 2 - padding;
      const radius = (maxRadius / maxRow) * s.rowNumber;
      const seatsInRow = Math.floor(maxCol / maxRow) + (s.rowNumber <= maxCol % maxRow ? 1 : 0);
      const angle = (2 * Math.PI * ((s.columnNumber - 1) % seatsInRow)) / seatsInRow;
      x = shapeX + centerX + radius * Math.cos(angle);
      y = shapeY + centerY + radius * Math.sin(angle);
    } else if (shape?.type === "semicircle") {
      // Semicircle: semicircular layout
      const centerX = width / 2;
      const centerY = height - padding;
      const maxRadius = Math.min(width / 2, height) - padding;
      const radius = (maxRadius / maxRow) * s.rowNumber;
      const angle = (Math.PI * (s.columnNumber - 1)) / (maxCol - 1);
      x = shapeX + centerX + radius * Math.cos(angle);
      y = shapeY + centerY - radius * Math.sin(angle);
    } else if (shape?.type === "arc") {
      // Arc: quarter circle layout
      const centerX = width / 2;
      const centerY = height - padding;
      const maxRadius = Math.min(width / 2, height) - padding;
      const radius = (maxRadius / maxRow) * s.rowNumber;
      const angle = (Math.PI / 2 * (s.columnNumber - 1)) / (maxCol - 1);
      x = shapeX + centerX + radius * Math.cos(angle);
      y = shapeY + centerY - radius * Math.sin(angle);
    } else {
      // Fallback: use stored posX/posY offset by shape position
      x = shapeX + (s.posX || 0);
      y = shapeY + (s.posY || 0);
    }

    console.debug(`[SeatDots] Seat ${i}: row=${s.rowNumber}, col=${s.columnNumber}, finalX=${x}, finalY=${y}`);
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
