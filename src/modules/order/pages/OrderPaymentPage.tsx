import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../shared/components/Layout";
import { getOrder, payOrder } from "../api/orderApi";
import { getApiClient } from "../../../core/apiClient";
import { decodeToken } from "../components/DecodeToken";

type PaymentType = {
  id: number;
  name: string;
};

export default function OrderPaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [snapshot, setSnapshot] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const info = decodeToken(token);
      setUserData(info);
    }

    getApiClient("order")
      .get("/PaymentType")
      .then((res) => setPaymentTypes(res.data))
      .catch(() => setPaymentTypes([]));
  }, []);

  useEffect(() => {
    if (!orderId) return;

    const load = async () => {
      const data = await getOrder(orderId);
      setOrder(data);

      const raw = localStorage.getItem(`order_snapshot_${orderId}`);
      if (raw) {
        try {
          setSnapshot(JSON.parse(raw));
        } catch {
          setSnapshot([]);
        }
      } else {
        setSnapshot([]);
      }

      setLoading(false);
    };

    load();
  }, [orderId]);

  const handlePay = async () => {
    if (!orderId || !selectedPayment) return;

    setPaying(true);

    await payOrder(orderId, {
      currency: order.currency || "ARS",
      paymentType: selectedPayment,
    });

    navigate(`/tickets?order=${orderId}`);
  };

  if (loading) return <Layout>Cargando orden...</Layout>;

  return (
    <Layout>
      <div className="min-h-screen bg-white text-black flex justify-center py-12 px-6">

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">

          <section className="flex flex-col gap-6">

            <header>
              <h1 className="text-4xl font-bold">Pago de la Orden</h1>
              <p className="text-slate-700 mt-2 text-lg">
                Revisá tu compra antes de continuar.
              </p>
            </header>

            <div className="rounded-2xl border border-slate-300 p-6 shadow-sm bg-slate-50">
              <h2 className="text-2xl font-semibold mb-4">Datos del Comprador</h2>

              <div className="grid grid-cols-2 gap-y-3 text-base">
                <p className="font-medium text-black">Nombre</p>
                <p className="text-right text-black">
                  {userData?.Username} {userData?.UserLastName}
                </p>

                <p className="font-medium text-black">Teléfono</p>
                <p className="text-right text-black">{userData?.UserPhone}</p>
              </div>
            </div>


            <div className="rounded-2xl border border-slate-300 p-6 shadow-sm bg-slate-50">
              <h2 className="text-2xl font-semibold mb-4">Resumen</h2>

              <div className="grid grid-cols-2 gap-y-3 text-base">
                <p className="font-medium text-black">Total</p>
                <p className="text-right font-bold text-black">
                  ${order.totalAmount} {order.currency}
                </p>

                <p className="font-medium text-black">Entradas</p>
                <p className="text-right text-black">{snapshot.length}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-300 p-6 shadow-sm bg-white">
              <h2 className="text-2xl font-semibold mb-4">Detalle de Entradas</h2>

              <div className="space-y-4">
                {snapshot.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <div>
                      <p className="font-semibold text-black">Entrada {idx + 1}</p>

                      <p className="text-sm text-slate-700 text-black">
                        Sector: {item.sectorName}
                      </p>

                      <p className="text-sm text-slate-700 text-black">
                        Lugar: Fila {item.row} · Asiento {item.column}
                      </p>
                    </div>

                    <p className="text-lg font-bold text-black">${item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-8">
            <div className="rounded-2xl border border-slate-300 p-6 shadow-sm bg-white">
              <h2 className="text-2xl font-semibold mb-4">Método de pago</h2>

              <div className="space-y-3">
                {paymentTypes.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition
                      ${selectedPayment === p.id
                        ? "border-green-600 bg-green-50"
                        : "border-slate-300 hover:bg-slate-100"
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={p.id}
                      checked={selectedPayment === p.id}
                      onChange={() => setSelectedPayment(p.id)}
                      className="mr-3"
                    />
                    <span className="font-medium text-lg">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={paying || !selectedPayment}
              className={`w-full py-4 rounded-xl text-white text-xl font-semibold transition
                ${paying || !selectedPayment
                  ? "bg-green-300"
                  : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {paying ? "Procesando pago..." : "Pagar ahora"}
            </button>
          </section>

        </div>
      </div>
    </Layout>
  );
}
