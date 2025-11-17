import { Rect, Circle, Arc, Transformer, Text } from "react-konva";
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
  scale
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
    onMoveLive({ ...sector, shape: { ...sector.shape, x, y } });
    onDragStart?.();
  };

  const handleDragEnd = (e: any) => {
    const x = Math.round(e.target.x());
    const y = Math.round(e.target.y());
    onMoveCommit({ ...sector, shape: { ...sector.shape, x, y } });
    onDragEnd?.();
  };

  const handleTransform = () => {
    const n = shapeRef.current;
    const w = Math.round(n.width() * n.scaleX());
    const h = Math.round(n.height() * n.scaleY());
    const x = Math.round(n.x());
    const y = Math.round(n.y());
    const r = Math.round(n.rotation());

    n.scaleX(1);
    n.scaleY(1);

    onTransformLive({
      ...sector,
      shape: { ...sector.shape, width: w, height: h, x, y, rotation: r }
    });
  };

  const handleTransformEnd = () => {
    const n = shapeRef.current;
    const w = Math.round(n.width() * n.scaleX());
    const h = Math.round(n.height() * n.scaleY());
    const x = Math.round(n.x());
    const y = Math.round(n.y());
    const r = Math.round(n.rotation());

    n.scaleX(1);
    n.scaleY(1);

    onTransformCommit({
      ...sector,
      shape: { ...sector.shape, width: w, height: h, x, y, rotation: r }
    });
  };

  const props = {
    ref: shapeRef,
    x: sector.shape.x,
    y: sector.shape.y,
    draggable: true,
    rotation: sector.shape.rotation,
    fill: sector.shape.colour,
    opacity: (sector.shape.opacity ?? 100) / 100,
    stroke: "white",
    strokeWidth: 1,
    onClick: onSelect,
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
    onTransform: handleTransform,
    onTransformEnd: handleTransformEnd
  };

  const getCenter = () => {
    const x = sector.shape.x;
    const y = sector.shape.y;
    const width = sector.shape.width;
    const height = sector.shape.height;
    const rotation = (sector.shape.rotation ?? 0) * (Math.PI / 180);

    if (sector.shape.type === "rectangle") {
      const cx = x;
      const cy = y;
      let textX = cx + width / 2;
      let textY = cy + height / 2;

      const dx = textX - cx;
      const dy = textY - cy;

      return {
        x: cx + dx * Math.cos(rotation) - dy * Math.sin(rotation),
        y: cy + dx * Math.sin(rotation) + dy * Math.cos(rotation)
      };
    }

    if (sector.shape.type === "circle") {
      const cx = x;
      const cy = y;      

      return {
        x: cx,
        y: cy
      };
    }

    if (sector.shape.type === "semicircle") {
      const outerRadius = width / 2;
      const cx = x;
      const cy = y;
      const midRadius = outerRadius / 2;
      const midAngle = Math.PI / 2;

      let textX = cx + midRadius * Math.cos(midAngle);
      let textY = cy + midRadius * Math.sin(midAngle);

      const dx = textX - cx;
      const dy = textY - cy;

      return {
        x: cx + dx * Math.cos(rotation) - dy * Math.sin(rotation),
        y: cy + dx * Math.sin(rotation) + dy * Math.cos(rotation)
      };
    }

    if (sector.shape.type === "arc") {
      const innerRadius = width / 4;
      const outerRadius = width / 2;
      const cx = x;
      const cy = y;

      const midRadius = (innerRadius + outerRadius) / 2;
      const midAngle = Math.PI / 4;

      let textX = cx + midRadius * Math.cos(midAngle);
      let textY = cy + midRadius * Math.sin(midAngle);

      const dx = textX - cx;
      const dy = textY - cy;

      return {
        x: cx + dx * Math.cos(rotation) - dy * Math.sin(rotation),
        y: cy + dx * Math.sin(rotation) + dy * Math.cos(rotation)
      };
    }

    return {
      x: x + width / 2,
      y: y + height / 2
    };
  };

  const center = getCenter();

  return (
    <>
      {sector.shape.type === "rectangle" && (
        <Rect {...props} width={sector.shape.width} height={sector.shape.height} />
      )}

      {sector.shape.type === "circle" && (
        <Circle {...props} radius={sector.shape.width / 2} />
      )}

      {sector.shape.type === "semicircle" && (
        <Arc
          {...props}
          innerRadius={0}
          outerRadius={sector.shape.width / 2}
          angle={180}          
          rotation={sector.shape.rotation}
        />
      )}

      {sector.shape.type === "arc" && (
        <Arc
          {...props}
          innerRadius={sector.shape.width / 4}
          outerRadius={sector.shape.width / 2}
          angle={90}
          rotation={sector.shape.rotation}
        />
      )}

      {scale <= 1 && (
        <Text
          x={center.x}
          y={center.y}
          text={sector.name}
          fontSize={14 / scale}
          fill="white"
          align="center"
          offsetX={sector.name.length * (14 / scale) * 0.22}
          offsetY={(14 / scale) / 2}
          rotation={sector.shape.rotation}
        />
      )}

      {sector.isControlled && sector.seats?.length > 0 && scale > 1.5 && (
        <SeatDots
          seats={sector.seats}
          shape={sector.shape}
          onHoverEnter={onSeatHoverEnter}
          onHoverLeave={onSeatHoverLeave}
        />
      )}

      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}
