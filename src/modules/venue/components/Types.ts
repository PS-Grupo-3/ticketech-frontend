export interface Shape {
  type: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  padding: number;
  opacity: number;
  colour: string;
  rows: number;
  columns: number;
}

export interface Seat {
  seatId: string;
  posX: number;
  posY: number;
  rowNumber: number;
  columnNumber: number;
}

export interface Sector {
  sectorId: string;
  name: string;
  isControlled: boolean;
  seatCount: number | null;
  capacity: number | null;
  shape: Shape;
  seats?: Seat[];
}
