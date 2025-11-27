import { useSearchParams } from "react-router-dom";
import OrderDetailsRender from "../../order/pages/OrderDetail";
import Layout from "../../../shared/components/Layout";

export default function TicketsPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order");

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-black">
        <div className="text-center bg-white shadow-xl border border-slate-300 px-10 py-8 rounded-2xl">
          <h1 className="text-3xl font-bold mb-3">Orden no encontrada</h1>
          <p className="text-slate-600">No se pudo leer el parámetro "order".</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
    <div className=" flex justify-center">
      <div className="w-full max-w-5xl">
        <OrderDetailsRender orderId={orderId} />
      </div>
    </div>
    </Layout>
  );
}
