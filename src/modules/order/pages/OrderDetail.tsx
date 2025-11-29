import { getOrdersDetails } from "../api/getOrderDetails";
import { useState, useEffect } from "react";
import { decodeToken } from "../components/DecodeToken";
import { getEventById } from "../../event/api/eventApi";
import { useNavigate } from "react-router-dom";




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
 function fixEncoding(str: string): string {
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}

export default function OrderDetailsRender({ orderId }: { orderId: string }) {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [eventSelected, setEventSelected] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [snapshot, setSnapshot] = useState<any[]>([]);

  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const info = decodeToken(token);
      setUserData(info);
    } catch {}
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(`order_snapshot_${orderId}`);
    if (!raw) return;

    try {
      setSnapshot(JSON.parse(raw));
    } catch {
      setSnapshot([]);
    }
  }, [orderId]);

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

  useEffect(() => {
    if (!orderDetail?.eventId) return;

    const loadEvent = async () => {
      const ev = await getEventById(orderDetail.eventId);
      setEventSelected(ev);
    };

    loadEvent();
  }, [orderDetail]);

  if (loading)
    return (
      <div className="w-full py-20 text-center text-lg font-medium text-white bg-neutral-900">
        Cargando...
      </div>
    );

  if (!orderDetail)
    return (
      <div className="w-full py-20 text-center text-lg font-medium text-white bg-neutral-900">
        Orden no encontrada
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex justify-center py-14 px-6">
      <div className="w-full max-w-6xl flex flex-col gap-12">
        <button
        onClick={() => navigate("/")}
        className="self-start px-5 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-medium transition"
      >
        ← Volver a la página principal
      </button>

        {/* EVENT HEADER */}
        <div className="rounded-2xl border border-neutral-700 shadow-sm bg-neutral-800 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            <div className="h-72 md:h-full overflow-hidden">
              {eventSelected?.thumbnailUrl ? (
                <img
                  src={eventSelected.thumbnailUrl}
                  alt={eventSelected.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-500">
                  Imagen no disponible
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col justify-center gap-2">
              <p className="text-neutral-400 text-sm">
                Orden #{orderDetail.orderId.toUpperCase()}
              </p>

              <h1 className="text-3xl font-bold text-white">{eventSelected?.name}</h1>

              <p className="text-neutral-300">{eventSelected?.address}</p>

              <span className="text-neutral-300">
                Fecha:{" "}
                {eventSelected
                  ? new Date(eventSelected.time).toLocaleDateString("es-AR")
                  : ""}
              </span>

              <span className="text-neutral-300">
                Horario:{" "}
                {eventSelected
                  ? new Date(eventSelected.time).toLocaleTimeString("es-AR")
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* DETALLE DE TICKETS */}
          <section className="rounded-2xl border border-neutral-700 p-6 shadow-sm bg-neutral-800">
            <h2 className="text-2xl font-semibold mb-4 text-white">Entradas</h2>

            <div className="space-y-4">
              {snapshot.map((snapItem, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-neutral-700 bg-neutral-800 flex justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">Entrada {idx + 1}</p>

                    <p className="text-sm text-neutral-400">
                      {snapItem.sectorName || "Sector General"}
                    </p>

                    <p className="text-sm text-neutral-400">
                      {snapItem.eventSeatId
                        ? `Fila ${snapItem.row} · Asiento ${snapItem.column}`
                        : "Admisión General"}
                    </p>
                  </div>

                  <p className="text-lg font-bold text-white">
                    ${snapItem.price || orderDetail.details[0]?.unitPrice || 0}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* RESUMEN Y USUARIO */}
          <section className="flex flex-col gap-8">

            <div className="rounded-2xl border border-neutral-700 p-6 shadow-sm bg-neutral-800">
              <h2 className="text-2xl font-semibold mb-4 text-white">Resumen</h2>

              <div className="grid grid-cols-2 gap-y-3 text-base">
                <p className="font-medium text-neutral-300">Total</p>
                <p className="text-right font-bold text-white">
                  ${orderDetail.totalAmount}
                </p>

                <p className="font-medium text-neutral-300">Método de pago</p>
                <p className="text-right text-white">
                  {orderDetail.paymentType.name}
                </p>

                <p className="font-medium text-neutral-300">Transacción</p>
                <p className="text-right text-white">{orderDetail.transaction}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-700 p-6 shadow-sm bg-neutral-800">
              <h2 className="text-2xl font-semibold mb-4 text-white">Datos del Comprador</h2>

              <div className="grid grid-cols-2 gap-y-3 text-base">
                <p className="font-medium text-neutral-300">Nombre</p>
                <p className="text-right text-white">
                  {fixEncoding(userData?.Username+" "+userData?.UserLastName)}
                </p>

                <p className="font-medium text-neutral-300">Teléfono</p>
                <p className="text-right text-white">{userData?.UserPhone}</p>

                <p className="font-medium text-neutral-300">Email</p>
                <p className="text-right text-white">{userData?.UserEmail}</p>
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}
