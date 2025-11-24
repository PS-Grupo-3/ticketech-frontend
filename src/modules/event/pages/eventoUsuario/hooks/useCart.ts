import { useEffect, useState } from "react";
import {
  updateSeatStatus,
  reserveFreeSector,
  releaseFreeSector,
} from "../../../api/eventApi";

type CartItem = {
  eventId: string;
  eventSeatId: string | null;   // controlado → GUID real, libre → null
  eventSectorId: string;
  price: number;
  row: number | null;
  column: number | null;
  sectorName: string;
  isFree: boolean;              // TRUE = sector sin asientos
};

export function useCart(eventId: string | undefined) {
  const CART_KEY = eventId ? `cart_${eventId}` : null;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const sanitize = (raw: any): CartItem[] => {
    if (!Array.isArray(raw)) return [];
    return raw.slice(0, 5);
  };

  useEffect(() => {
    if (!eventId || !CART_KEY) return;

    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setCart(sanitize(JSON.parse(raw)));
    } catch {
      setCart([]);
    }
    setLoaded(true);
  }, [eventId]);

  useEffect(() => {
    if (!loaded || !CART_KEY) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, loaded, CART_KEY]);

  
  const addSeat = async (_eventData: any, seat: any, sector: any) => {
    if (!eventId || !sector) return { ok: false, reason: "invalid" };
    if (cart.length >= 5) return { ok: false, reason: "limit" };


    if (!sector.isControlled) {
      if (sector.capacity <= 0) return { ok: false, reason: "no-capacity" };

      await reserveFreeSector(sector.eventSectorId);

      const item: CartItem = {
        eventId,
        eventSeatId: null,            
        eventSectorId: sector.eventSectorId,
        price: sector.price,
        row: null,
        column: null,
        sectorName: sector.name,
        isFree: true,
      };

      setCart((prev) => [...prev, item]);
      return { ok: true };
    }

    // CONTROLADO
    if (!seat?.eventSeatId) return { ok: false, reason: "invalid-seat" };

    await updateSeatStatus(eventId, seat.eventSeatId, { available: false });

    const item: CartItem = {
      eventId,
      eventSeatId: seat.eventSeatId,   // GUID real
      eventSectorId: sector.eventSectorId,
      price: seat.price,
      row: seat.row,
      column: seat.column,
      sectorName: sector.name,
      isFree: false,
    };

    setCart((prev) => [...prev, item]);
    return { ok: true };
  };

  
  const removeSeat = async (item: CartItem) => {
    if (!eventId) return;

    try {
      if (item.isFree) {
        await releaseFreeSector(item.eventSectorId);
      } else {
        await updateSeatStatus(eventId, item.eventSeatId!, { available: true });
      }
    } catch {}

    setCart((prev) => prev.filter((x) => x !== item));
  };

  
  const clearAndRelease = async () => {
    if (!eventId) return;

    for (const item of cart) {
      try {
        if (item.isFree) {
          await releaseFreeSector(item.eventSectorId); // una por ítem
        } else {
          await updateSeatStatus(eventId, item.eventSeatId!, { available: true });
        }
      } catch {}
    }

    setCart([]);
    if (CART_KEY) localStorage.removeItem(CART_KEY);
  };

  
    const clearCartOnly = () => {
    if (!CART_KEY) return;
    setCart([]);
    localStorage.removeItem(CART_KEY);
  };

  return { cart, addSeat, removeSeat, clearAndRelease, clearCartOnly };
}



