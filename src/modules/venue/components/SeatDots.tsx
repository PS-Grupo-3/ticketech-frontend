import { Circle, Rect } from "react-konva";

export default function SeatDots({ seats, shape }: { seats: any[]; shape?: any }) {
  console.debug("[SeatDots] Rendering seats:", seats.length, "shape:", shape);

  if (!shape || shape.type !== "rectangle") {
    // Fallback to original behavior for non-rectangles, but offset by shape position
    return seats.map((s, i) => {
      const x = (shape?.x || 0) + s.posX;
      const y = (shape?.y || 0) + s.posY;
      console.debug(`[SeatDots] Non-rectangle seat ${i}: posX=${s.posX}, posY=${s.posY}, offsetX=${shape?.x || 0}, offsetY=${shape?.y || 0}, finalX=${x}, finalY=${y}`);
      return (
        <Circle key={i} x={x} y={y} radius={4} fill="black" opacity={0.9} />
      );
    });
  }

  // For rectangles, calculate grid positions based on rowNumber and columnNumber
  const maxRow = Math.max(...seats.map(s => s.rowNumber));
  const maxCol = Math.max(...seats.map(s => s.columnNumber));
  const padding = shape.padding || 0;
  const availableWidth = shape.width - 2 * padding;
  const availableHeight = shape.height - 2 * padding;

  const spacingX = maxCol > 1 ? availableWidth / (maxCol - 1) : 0;
  const spacingY = maxRow > 1 ? availableHeight / (maxRow - 1) : 0;

  console.debug(`[SeatDots] Rectangle shape: maxRow=${maxRow}, maxCol=${maxCol}, padding=${padding}, availableWidth=${availableWidth}, availableHeight=${availableHeight}, spacingX=${spacingX}, spacingY=${spacingY}, shapeX=${shape.x}, shapeY=${shape.y}`);

  return seats.map((s, i) => {
    const x = (shape.x || 0) + padding + (s.columnNumber - 1) * spacingX;
    const y = (shape.y || 0) + padding + (s.rowNumber - 1) * spacingY;
    console.debug(`[SeatDots] Rectangle seat ${i}: row=${s.rowNumber}, col=${s.columnNumber}, calcX=${padding + (s.columnNumber - 1) * spacingX}, calcY=${padding + (s.rowNumber - 1) * spacingY}, finalX=${x}, finalY=${y}`);
    return (
      <Rect
        key={i}
        x={x - 4}
        y={y - 4}
        width={8}
        height={8}
        fill="black"
        opacity={0.9}
        cornerRadius={2}
      />
    );
  });
}
