import { useEffect, useState } from "react";
import { updateSeatStatus } from "../../../api/eventApi";

type CartItem = {
  eventId: string;
  eventSeatId: string;
  eventSectorId: string;
  price: number;
  row: number;
  column: number;
  sectorName: string;
};

export function useCart(eventId: string | undefined) {
  const CART_KEY = eventId ? `cart_${eventId}` : null;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const sanitize = (raw: any): CartItem[] => {
    if (!Array.isArray(raw)) return [];

    return raw
      .filter((x) =>
        x &&
        typeof x.eventSeatId === "string" &&
        typeof x.eventSectorId === "string" &&
        typeof x.sectorName === "string" &&
        typeof x.price === "number" &&
        typeof x.row === "number" &&
        typeof x.column === "number"
      )
      .slice(0, 5);
  };


  useEffect(() => {
    if (!eventId || !CART_KEY) return;

    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const clean = sanitize(parsed);
        setCart(clean);
      } catch {
        setCart([]);
      }
    }
    setLoaded(true);
  }, [eventId]);


  useEffect(() => {
    if (!loaded || !CART_KEY) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, loaded, CART_KEY]);


  const addSeat = async (eventData: any, seat: any, sector: any) => {
    if (!eventId || !seat || !sector) return { ok: false, reason: "invalid" };

    if (cart.length >= 5) {
      return { ok: false, reason: "limit" };
    }

    if (!seat.eventSeatId) {
      console.error("Seat inválido, missing eventSeatId", seat);
      return { ok: false, reason: "invalid-seat" };
    }
    
    await updateSeatStatus(eventId, seat.eventSeatId, { available: false });

    const item: CartItem = {
      eventId,
      eventSeatId: seat.eventSeatId,
      eventSectorId: sector.eventSectorId,
      price: seat.price,
      row: seat.row,
      column: seat.column,
      sectorName: sector.name,
    };

    setCart((prev) => [...prev, item]);
    return { ok: true };
  };


  const removeSeat = async (item: CartItem) => {
    if (!eventId) return;

    try {
      await updateSeatStatus(eventId, item.eventSeatId, { available: true });
    } catch {}

    setCart((prev) => prev.filter((x) => x.eventSeatId !== item.eventSeatId));
  };

  const clearAndRelease = async () => {
    if (!eventId) return;

    for (const item of cart) {
      try {
        await updateSeatStatus(eventId, item.eventSeatId, { available: true });
      } catch {}
    }

    setCart([]);
    if (CART_KEY) localStorage.removeItem(CART_KEY);
  };

  return { cart, addSeat, removeSeat, clearAndRelease };
}
