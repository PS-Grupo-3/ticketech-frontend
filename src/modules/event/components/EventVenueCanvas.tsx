import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useEffect, useRef, useState } from "react";
import ReaderSectorShape from "./ReaderSectorShape";
import EventCamera from "./EventCamera";

const WIDTH = 900;
const HEIGHT = 600;

export default function EventVenueCanvas({ background, sectors, selectedSeatId, onSeatClick }: any) {

  const stageRef = useRef<any>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!background) return setImage(null);
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = background;
  }, [background]);

  useEffect(() => {
    if (!stageRef.current) return;
    const cam = new EventCamera(stageRef.current);
    cam.enable((s) => setScale(s));
  }, []);

  return (
    <Stage ref={stageRef} width={WIDTH} height={HEIGHT} className="border bg-gray-900 rounded">
      <Layer>
        {image && <KonvaImage image={image} width={WIDTH} height={HEIGHT} opacity={0.4} />}
        {sectors
            ?.filter((s: any) => s.available)     
            .map((sector: any) => (
          <ReaderSectorShape
            key={sector.eventSectorId}
            sector={sector}
            scale={scale}
            selectedSeatId={selectedSeatId}
            onSeatClick={onSeatClick}
          />
        ))}
      </Layer>
    </Stage>
  );
}
