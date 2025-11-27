import { getOrdersDetails } from "../api/getOrderDetails";
import { useState, useEffect } from "react";
import { decodeToken } from "../components/DecodeToken";
import { getEventById } from "../../event/api/eventApi";

interface Props {
  orderId: string;
}

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
  time: Date;
  address: string;
  bannerImageUrl: string;
}

interface UserInfo {
  Username: string;
  UserLastName: string;
  UserPhone: string;
  UserEmail:string;
}

export default function OrderDetailsRender({ orderId }: Props) {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [eventSelected, setEventSelected] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [snapshot, setSnapshot] = useState<any[]>([]);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const info = decodeToken(token);
        setUserData(info);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(`order_snapshot_${orderId}`);
    if (raw) {
      try {
        setSnapshot(JSON.parse(raw));
      } catch {
        setSnapshot([]);
      }
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

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;
  if (!orderDetail) return <div style={{ padding: 20 }}>Orden no encontrada</div>;

  return (
    <div className="OrderDetails">
      <div className="OrderInfoContainer">

        <div className="EventImg">
          {eventSelected?.bannerImageUrl ? (
            <img src={eventSelected.bannerImageUrl} alt={eventSelected.name} />
          ) : (
            "Imagen no disponible"
          )}

          <div className="ImgText">
            <span>
              <p>#{orderDetail.orderId.toUpperCase()}</p>
            </span>
            <span>
              <h1>{eventSelected?.name}</h1>
            </span>
            <span>{eventSelected?.address}</span>
            <span>Fecha: {new Date(eventSelected?.time!).toLocaleDateString("es-AR")}</span>
            <span>Horario: {new Date(eventSelected?.time!).toLocaleTimeString("es-AR")}</span>
          </div>
        </div>

        <div className="InfoOrder">
          {orderDetail.details.map((ticket, idx) => {
            const snapMatch = snapshot.find((s) => s.eventSeatId === ticket.eventSeatId);

            return (
              <div className="infotickets" key={idx}>
                <span>
                  {snapMatch
                    ? snapMatch.sectorName
                    : `Sector ID: ${ticket.eventSectorId}`}
                </span>

                <span>
                  {snapMatch
                    ? `Fila ${snapMatch.row} · Asiento ${snapMatch.column}`
                    : ticket.eventSeatId
                      ? `Asiento ID ${ticket.eventSeatId}`
                      : ""}
                </span>

                <span>{ticket.quantity} x ${ticket.unitPrice}</span>
              </div>
            );
          })}

          <div className="PriceInfo">
            <div className="PriceInfoLine">
              <span>Total:</span>
              <span>${orderDetail.totalAmount}</span>
            </div>

            <div className="PriceInfoLine">
              <span>Método de pago:</span>
              <span>{orderDetail.paymentType.name}</span>
            </div>

            <div className="PriceInfoLine">
              <span>Transacción:</span>
              <span>{orderDetail.transaction}</span>
            </div>
          </div>

          <div className="UserInfo">
            <div className="UserInfoLine">
              <span>Nombre:</span>
              <span>{userData?.Username} {userData?.UserLastName}</span>
            </div>
            <div className="UserInfoLine">
              <span>Teléfono:</span>
              <span>{userData?.UserPhone}</span>
            </div>
              <div className="UserInfoLine">
              <span>Email:</span>
              <span>{userData?.UserEmail}</span>
            </div>
              
          </div>

        </div>
      </div>
    </div>
  );
}
