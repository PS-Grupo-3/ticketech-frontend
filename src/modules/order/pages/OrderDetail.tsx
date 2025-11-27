import { getOrdersDetails } from "../api/getOrderDetails";
import { useState, useEffect } from "react";
import { decodeToken } from "../components/DecodeToken";
import { getEventById } from "../../event/api/eventApi";

// --------------------- TIPOS ----------------------

interface TicketDetail {
  detailId: string;
  eventSeatId?: string | null;
  unitPrice: number;
  quantity: number;
  eventSectorId: string;
}

interface OrderDetail {
  orderId: string;
  eventId: string;
  details: TicketDetail[];
  totalAmount: number;
  paymentType: { id: number; name: string };
  transaction: string;
}

interface EventDetail {
  name: string;
  category: string;
  categoryType: string;
  time: string;
  address: string;
  thumbnailUrl: string;
}

interface UserInfo {
  Username: string;
  UserLastName: string;
  UserPhone: string;
  UserEmail: string;
}

export default function OrderDetailsRender({ orderId }: { orderId: string }) {

  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [eventSelected, setEventSelected] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [snapshot, setSnapshot] = useState<any[]>([]);

  // ------------------- USER DATA --------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const info = decodeToken(token);
      setUserData(info);
    } catch {}
  }, []);

  // ------------------- SNAPSHOT --------------------
  useEffect(() => {
    const raw = localStorage.getItem(`order_snapshot_${orderId}`);
    if (!raw) return;

    try {
      setSnapshot(JSON.parse(raw));
    } catch {
      setSnapshot([]);
    }
  }, [orderId]);

  // ------------------- LOAD ORDER -------------------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOrdersDetails(orderId);
        setOrderDetail(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderId]);

  // ------------------- LOAD EVENT -------------------
  useEffect(() => {
    if (!orderDetail?.eventId) return;

    const loadEvent = async () => {
      const ev = await getEventById(orderDetail.eventId);
      setEventSelected(ev);
    };

    loadEvent();
  }, [orderDetail]);

  // ------------------- RENDER -------------------
  if (loading)
    return (
      <div className="w-full py-20 text-center text-lg font-medium">
        Cargando...
      </div>
    );

  if (!orderDetail)
    return (
      <div className="w-full py-20 text-center text-lg font-medium">
        Orden no encontrada
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black flex justify-center py-14 px-6">
      <div className="w-full max-w-6xl flex flex-col gap-12">

        {/* EVENT HEADER */}
        <div className="rounded-2xl border border-slate-300 shadow-sm bg-white overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            <div className="h-72 md:h-full overflow-hidden">
              {eventSelected?.thumbnailUrl ? (
                <img
                  src={eventSelected.thumbnailUrl}
                  alt={eventSelected.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  Imagen no disponible
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col justify-center gap-2">
              <p className="text-slate-700 text-sm">
                Orden #{orderDetail.orderId.toUpperCase()}
              </p>

              <h1 className="text-3xl font-bold">{eventSelected?.name}</h1>

              <p className="text-slate-700">{eventSelected?.address}</p>

              <span className="text-slate-700">
                Fecha: {eventSelected ? new Date(eventSelected.time).toLocaleDateString("es-AR") : ""}
              </span>

              <span className="text-slate-700">
                Horario: {eventSelected ? new Date(eventSelected.time).toLocaleTimeString("es-AR") : ""}
              </span>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* DETALLE DE TICKETS */}
          <section className="rounded-2xl border border-slate-300 p-6 shadow-sm bg-white">
            <h2 className="text-2xl font-semibold mb-4">Entradas</h2>

            <div className="space-y-4">
              {snapshot.map((snapItem, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between"
                >
                  <div>
                    <p className="font-semibold text-black">Entrada {idx + 1}</p>

                    <p className="text-sm text-slate-700">
                      {snapItem.sectorName || "Sector General"}
                    </p>

                    <p className="text-sm text-slate-700">
                      {snapItem.eventSeatId
                        ? `Fila ${snapItem.row} · Asiento ${snapItem.column}`
                        : "Admisión General"}
                    </p>
                  </div>

                  <p className="text-lg font-bold text-black">
                    ${snapItem.price || orderDetail.details[0]?.unitPrice || 0}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* RESUMEN Y USUARIO */}
          <section className="flex flex-col gap-8">

            <div className="rounded-2xl border border-slate-300 p-6 shadow-sm bg-slate-50">
              <h2 className="text-2xl font-semibold mb-4">Resumen</h2>

              <div className="grid grid-cols-2 gap-y-3 text-base">
                <p className="font-medium text-black">Total</p>
                <p className="text-right font-bold text-black">
                  ${orderDetail.totalAmount}
                </p>

                <p className="font-medium text-black">Método de pago</p>
                <p className="text-right text-black">
                  {orderDetail.paymentType.name}
                </p>

                <p className="font-medium text-black">Transacción</p>
                <p className="text-right text-black">{orderDetail.transaction}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-300 p-6 shadow-sm bg-white">
              <h2 className="text-2xl font-semibold mb-4">Datos del Comprador</h2>

              <div className="grid grid-cols-2 gap-y-3 text-base">
                <p className="font-medium text-black">Nombre</p>
                <p className="text-right text-black">
                  {userData?.Username} {userData?.UserLastName}
                </p>

                <p className="font-medium text-black">Teléfono</p>
                <p className="text-right text-black">{userData?.UserPhone}</p>

                <p className="font-medium text-black">Email</p>
                <p className="text-right text-black">{userData?.UserEmail}</p>
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}
