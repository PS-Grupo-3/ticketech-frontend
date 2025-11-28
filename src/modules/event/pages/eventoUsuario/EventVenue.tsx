import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../../shared/components/Layout";
import EventVenueCanvas from "../../components/EventVenueCanvas";
import backgroundImage from "../../../../../public/banners/eventBanner.jpg";
import { getEventFull } from "../../api/eventApi";
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
  const [eventData, setEventData] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [selectedSector, setSelectedSector] = useState<any>(null);

  const navigate = useNavigate();


  const { cart, addSeat, removeSeat, clearAndRelease, clearCartOnly } = useCart(eventId);

  const { timeLeft, resetTimer, stopTimer } = useCartTimer(
    eventId,
    async () => {      
      await clearAndRelease();
    }
  );
  
  useEffect(() => {
    if (!eventId) return;

    const load = () => {
      getEventFull(eventId).then((d) => {
        setEventData(d);

        if (selectedSeat) {
          const stillExists = d.sectors
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
  }, [eventId, selectedSeat]);

  const { show } = useNotification();
    
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

  
  const handleRemoveItem = async (item: any) => {
    const isLast = cart.length === 1;
    await removeSeat(item);
    if (isLast) {
      stopTimer();
    }
  };

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
                console.log("CLICK SECTOR:", sector);
                console.log("CONTROLADO:", sector.isControlled);
                console.log("CAPACITY:", sector.capacity);

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

