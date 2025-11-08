import { Circle } from "react-konva";

export default function SeatDots({ seats }: { seats: any[] }) {
  return seats.map((s, i) => (
    <Circle key={i} x={s.posX} y={s.posY} radius={4} fill="black" opacity={0.9} />
  ));
}
