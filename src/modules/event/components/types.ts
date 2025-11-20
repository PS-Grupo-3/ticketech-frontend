export interface EventSeat {
  eventSeatId: string;
  row: number;
  column: number;
  posX: number;
  posY: number;
  price: number;
  available: boolean;
}

export interface EventSectorShape {
  type: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  padding: number;
  opacity: number;
  colour: string;
}

export interface EventSectorFull {
  eventSectorId: string;
  name: string;
  isControlled: boolean;
  capacity: number;
  price: number;
  shape: EventSectorShape;
  seats: EventSeat[];
  available: boolean;
}

export interface EventFull {
  eventId: string;
  venueId: string;
  name: string;
  bannerImageUrl: string;
  thumbnailUrl: string;
  themeColor: string;
  sectors: EventSectorFull[];
}



export interface EventFullSnapshot {
  eventId: string;
  venueId: string;
  name: string;
  bannerImageUrl: string;
  thumbnailUrl: string;
  themeColor: string;
  venueBackgroundImageUrl?: string;
  sectors: EventSectorFull[];
}