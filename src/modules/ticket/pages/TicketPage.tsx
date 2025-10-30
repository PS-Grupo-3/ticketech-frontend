import { useQuery } from "@tanstack/react-query";
import { getTicketStatuses } from "../api/ticketApi";

export default function TicketPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["ticketStatuses"],
        queryFn: getTicketStatuses,
    });

    if (isLoading) return <p className="p-4">Cargando estados de ticket...</p>;
    if (error) return <p className="p-4 text-red-500">Error: {(error as Error).message}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">TicketService — Estados de Tickets</h1>
            <ul className="space-y-2">
                {data?.map((t: any) => (
                    <li key={t.statusId} className="border p-2 rounded">
                        <strong>{t.name}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}
