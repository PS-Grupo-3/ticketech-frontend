import { Rect, Circle, Arc, Transformer, Group, Text } from "react-konva";
import { useEffect, useRef } from "react";
import SeatDots from "./SeatDots";

export default function SectorShape({
  sector,
  isSelected,
  onSelect,
  onTransformLive,
  onTransformCommit,
  onMoveLive,
  onMoveCommit,
  onSeatHoverEnter,
  onSeatHoverLeave,
  onDragStart,
  onDragEnd,
  scale,
}: any) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current.fill(sector.shape.colour ?? "#22c55e");
      shapeRef.current.getLayer().batchDraw();
    }
  }, [sector.shape.colour]);

  const handleDragMove = (e: any) => {
    const x = Math.round(e.target.x());
    const y = Math.round(e.target.y());
    console.debug("[DRAG move]", sector.sectorId, x, y);
    if (onDragStart) onDragStart();
    onMoveLive({ ...sector, posX: x, posY: y, shape: { ...sector.shape, x, y } });
  };

  const handleDragEnd = (e: any) => {
    const x = Math.round(e.target.x());
    const y = Math.round(e.target.y());
    console.debug("[DRAG end]", sector.sectorId, x, y);
    onMoveCommit({ ...sector, posX: x, posY: y, shape: { ...sector.shape, x, y } });
    if (onDragEnd) onDragEnd();
  };

  const handleTransform = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const width = Math.round(Math.max(20, node.width() * scaleX));
    const height = Math.round(Math.max(20, node.height() * scaleY));
    const x = Math.round(node.x());
    const y = Math.round(node.y());
    const rotation = Math.round(node.rotation());
    node.scaleX(1);
    node.scaleY(1);

    console.debug("[TRANSFORM live]", sector.sectorId, width, height);
    onTransformLive({ ...sector, posX: x, posY: y, width, height, shape: { ...sector.shape, width, height, x, y, rotation } });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const width = Math.round(Math.max(20, node.width() * scaleX));
    const height = Math.round(Math.max(20, node.height() * scaleY));
    const x = Math.round(node.x());
    const y = Math.round(node.y());
    const rotation = Math.round(node.rotation());
    node.scaleX(1);
    node.scaleY(1);

    console.debug("[TRANSFORM end]", sector.sectorId, width, height);
    onTransformCommit({ ...sector, posX: x, posY: y, width, height, shape: { ...sector.shape, width, height, x, y, rotation } });
  };

  const props = {
    ref: shapeRef,
    x: sector.posX,
    y: sector.posY,
    draggable: true,
    rotation: sector.shape.rotation ?? 0,
    fill: sector.shape.colour ?? "#22c55e",
    opacity: (sector.shape.opacity ?? 100) / 100,
    stroke: "white",
    strokeWidth: 1.2,
    onClick: onSelect,
    onTap: onSelect,
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
    onTransform: handleTransform,
    onTransformEnd: handleTransformEnd,
  };

const getCenter = () => {
  const x = sector.posX;
  const y = sector.posY;
  const width = sector.shape.width;
  const height = sector.shape.height;
  const rotation = (sector.shape.rotation ?? 0) * (Math.PI / 180);

  if (sector.shape.type === "rectangle") {
  const innerRadius = width / 4;
  const outerRadius = width / 2;
  const cx = x;
  const cy = y;
  
  const startAngle = 0; 
  const endAngle = Math.PI / 2;
  const midAngle = (startAngle + endAngle) / 2;

  const midRadius = (innerRadius + outerRadius) / 2;

  let textX = cx + midRadius * Math.cos(midAngle) + width/4;
  let textY = cy + height / 2;

  const dx = textX - cx;
  const dy = textY - cy;
  const rotatedX = cx + dx * Math.cos(rotation) - dy * Math.sin(rotation);
  const rotatedY = cy + dx * Math.sin(rotation) + dy * Math.cos(rotation);

  return { x: rotatedX, y: rotatedY, cx, cy };
} else if (sector.shape.type === "circle") {
    return { x: x, y: y };
  } else  if (sector.shape.type === "semicircle") {
    const outerRadius = width / 2;
    const cx = x;
    const cy = y;

    // radio medio
    const midRadius = outerRadius / 2;
    // ángulo medio (mitad del arco de 180°)
    const midAngle = Math.PI / 2;

    let textX = cx + midRadius * Math.cos(midAngle);
    let textY = cy + midRadius * Math.sin(midAngle);

    // aplicar rotación
    const dx = textX - cx;
    const dy = textY - cy;
    const rotatedX = cx + dx * Math.cos(rotation) - dy * Math.sin(rotation);
    const rotatedY = cy + dx * Math.sin(rotation) + dy * Math.cos(rotation);

    return { x: rotatedX, y: rotatedY, cx, cy };
  } else if (sector.shape.type === "arc") {
    const innerRadius = width / 4;
    const outerRadius = width / 2;
    const cx = x; // centro geométrico del arco
    const cy = y;
    const midRadius = (innerRadius + outerRadius) / 2;
    const midAngle = Math.PI / 4; // mitad del arco de 90°

    // punto medio sin rotación
    let textX = cx + midRadius * Math.cos(midAngle);
    let textY = cy + midRadius * Math.sin(midAngle);

    // aplicar rotación del sector al texto
    const dx = textX - cx;
    const dy = textY - cy;
    const rotatedX = cx + dx * Math.cos(rotation) - dy * Math.sin(rotation);
    const rotatedY = cy + dx * Math.sin(rotation) + dy * Math.cos(rotation);

    return { x: rotatedX, y: rotatedY, cx, cy };
  }

  return { x: x + width / 2, y: y + height / 2 };
};

  const center = getCenter();

  return (
    <>
      {sector.shape.type === "rectangle" && <Rect {...props} width={sector.shape.width} height={sector.shape.height} />}
      {sector.shape.type === "circle" && <Circle {...props} radius={sector.shape.width / 2} />}
      {sector.shape.type === "semicircle" && <Arc {...props} innerRadius={0} outerRadius={sector.shape.width / 2} angle={180} />}
      {sector.shape.type === "arc" && <Arc {...props} innerRadius={sector.shape.width / 4} outerRadius={sector.shape.width / 2} angle={90} />}
      {scale <= 1 && (
        <Text
          x={center.x}
          y={center.y}
          text={sector.name || "Sector"}
          fontSize={Math.max(12, 16 / scale)} // Adjust font size based on scale
          fill="white"
          align="center"
          verticalAlign="middle"
          rotation={sector.shape.rotation ?? 0}
          offsetX={(sector.name || "Sector").length * (Math.max(12, 16 / scale) / 4)} // Center horizontally
          offsetY={Math.max(12, 16 / scale) / 2} // Center vertically
        />
      )}
      {sector.seats && sector.seats.length > 0 && sector.isControlled && scale > 1.5 && <SeatDots seats={sector.seats} shape={sector.shape} onHoverEnter={onSeatHoverEnter} onHoverLeave={onSeatHoverLeave} />}
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}
