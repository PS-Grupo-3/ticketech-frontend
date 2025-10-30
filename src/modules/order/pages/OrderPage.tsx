import { useQuery } from "@tanstack/react-query";
import { getPaymentStatuses } from "../api/orderApi";

export default function OrderPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["paymentStatuses"],
        queryFn: getPaymentStatuses,
    });

    if (isLoading) return <p className="p-4">Cargando métodos de pago...</p>;
    if (error) return <p className="p-4 text-red-500">Error: {(error as Error).message}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">OrderService — Métodos de Pago</h1>
            <ul className="space-y-2">
                {data?.map((status: any) => (
                    <li key={status.id} className="border p-2 rounded">
                        <strong>{status.name}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}
