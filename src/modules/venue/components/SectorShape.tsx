import { Rect, Circle, Arc, Transformer } from "react-konva";
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
}: any) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragMove = (e: any) => {
    const x = Math.round(e.target.x());
    const y = Math.round(e.target.y());
    console.debug("[DRAG move]", sector.sectorId, x, y);
    onMoveLive({ ...sector, posX: x, posY: y, shape: { ...sector.shape, x, y } });
  };

  const handleDragEnd = (e: any) => {
    const x = Math.round(e.target.x());
    const y = Math.round(e.target.y());
    console.debug("[DRAG end]", sector.sectorId, x, y);
    onMoveCommit({ ...sector, posX: x, posY: y, shape: { ...sector.shape, x, y } });
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

  return (
    <>
      {sector.shape.type === "rectangle" && <Rect {...props} width={sector.shape.width} height={sector.shape.height} />}
      {sector.shape.type === "circle" && <Circle {...props} radius={sector.shape.width / 2} />}
      {sector.shape.type === "semicircle" && <Arc {...props} innerRadius={0} outerRadius={sector.shape.width / 2} angle={180} />}
      {sector.shape.type === "arc" && <Arc {...props} innerRadius={sector.shape.width / 3} outerRadius={sector.shape.width / 2} angle={90} />}
      {sector.seats && sector.seats.length > 0 && <SeatDots seats={sector.seats} shape={sector.shape} />}
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}
