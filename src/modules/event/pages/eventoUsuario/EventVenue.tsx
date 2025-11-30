import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../../shared/components/Layout";
import EventVenueCanvas from "../../components/EventVenueCanvas";
import backgroundImage from "../../../../../public/banners/eventBanner.jpg";
import { getEventFull, getEventById } from "../../api/eventApi";
import { decodeToken } from "../../../order/components/DecodeToken";
import { createOrder } from "../../../order/api/orderApi";

import { useCart } from "./hooks/useCart";
import { useCartTimer } from "./hooks/useCartTimer";

import TimerBar from "./components/TimerBar";
import SeatInfoPanel from "./components/SeatInfoPanel";
import CartPanel from "./components/CartPanel";
import { useNotification } from "../../../../shared/components/NotificationContext";

export default function EventVenuePage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { show } = useNotification();

  const [eventData, setEventData] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [selectedSector, setSelectedSector] = useState<any>(null);

  const { cart, addSeat, removeSeat, clearAndRelease, clearCartOnly } =
    useCart(eventId);

  const { timeLeft, resetTimer, stopTimer } = useCartTimer(
    eventId,
    async () => {
      await clearAndRelease();
    }
  );

  // -----------------------------------------------
  // VALIDACIÓN + CARGA USANDO DOUBLE REQUEST
  // -----------------------------------------------
  useEffect(() => {
    if (!eventId) return;

    const load = () => {
      Promise.all([
        getEventFull(eventId),
        getEventById(eventId) // ← este endpoint sí tiene "time"
      ]).then(([full, basic]) => {
        const eventDate = new Date(basic.time);
        const eventPassed = eventDate.getTime() < Date.now();

        if (eventPassed) {
          show("Este evento ya finalizó. No podés comprar entradas.");
          navigate(`/event/${eventId}`);
          return;
        }

        setEventData(full);

        if (selectedSeat) {
          const stillExists = full.sectors
            .flatMap((s: any) => s.seats)
            .some(
              (x: any) =>
                x.eventSeatId === selectedSeat.eventSeatId && x.available
            );

          if (!stillExists) {
            setSelectedSeat(null);
            setSelectedSector(null);
          }
        }
      });
    };

    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [eventId, selectedSeat, navigate, show]);

  // -----------------------------------------------
  // AGREGAR ASIENTOS
  // -----------------------------------------------
  const handleAdd = async () => {
    const result = await addSeat(eventData, selectedSeat, selectedSector);

    if (!result.ok) {
      if (result.reason === "limit") show("Máximo 5 items.");
      if (result.reason === "no-capacity") show("No quedan lugares.");
      return;
    }

    resetTimer();
    setSelectedSeat(null);
    setSelectedSector(null);
  };

  // -----------------------------------------------
  // REMOVER ASIENTOS
  // -----------------------------------------------
  const handleRemoveItem = async (item: any) => {
    const isLast = cart.length === 1;
    await removeSeat(item);
    if (isLast) stopTimer();
  };

  // -----------------------------------------------
  // CHECKOUT
  // -----------------------------------------------
  const handleCheckout = async () => {
    if (!cart.length || !eventId || !eventData) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = decodeToken(token);
    if (!payload) return;

    const seats = cart
      .filter((i) => !i.isFree)
      .map((item) => ({
        eventSeatId: item.eventSeatId,
        eventSectorId: item.eventSectorId,
        eventId,
        price: item.price,
      }));

    const sectors = cart
      .filter((i) => i.isFree)
      .map((item) => ({
        eventSectorId: item.eventSectorId,
        eventId,
        quantity: 1,
        unitPrice: item.price,
      }));

    const orderPayload = {
      userId: payload.userId,
      event: eventId,
      venue: eventData.venueId,
      seats: seats.length ? seats : null,
      sectors: sectors.length ? sectors : null,
    };

    try {
      const order = await createOrder(orderPayload);

      localStorage.setItem(
        `order_snapshot_${order.orderId}`,
        JSON.stringify(cart)
      );

      clearCartOnly();
      stopTimer();
      navigate(`/order/${order.orderId}/pay`);
    } catch (err) {
      console.error("Error creando orden", err);
    }
  };

  // -----------------------------------------------
  // UI
  // -----------------------------------------------
  if (!eventData) {
    return <Layout>Cargando...</Layout>;
  }

  return (
    <Layout>
      <div
        className="relative min-h-screen py-10"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />

        <div className="relative z-10 max-w-[1350px] mx-auto px-4 flex gap-6">

          <div className="flex-1 rounded-2xl bg-slate-900/70 p-2 shadow-xl">
            <EventVenueCanvas
              background={eventData.venueBackgroundImageUrl}
              sectors={eventData.sectors}
              selectedSeatId={selectedSeat?.eventSeatId || null}
              onSeatClick={(seat: any, sector: any) => {
                setSelectedSector(sector);
                setSelectedSeat(sector.isControlled ? seat : null);
              }}
            />
          </div>

          <aside className="w-[380px] rounded-2xl bg-neutral-800/95 backdrop-blur shadow-2xl border border-neutral-700 px-5 py-4 flex flex-col gap-4">
            <TimerBar timeLeft={timeLeft} />

            <SeatInfoPanel
              selectedSeat={selectedSeat}
              selectedSector={selectedSector}
              onAdd={handleAdd}
            />

            <CartPanel
              cart={cart}
              total={cart.reduce((acc, s) => acc + s.price, 0)}
              onCheckout={handleCheckout}
              onRemoveItem={handleRemoveItem}
            />
          </aside>

        </div>
      </div>
    </Layout>
  );
}

function clearCartOnly() {
  throw new Error("Function not implemented.");
}
