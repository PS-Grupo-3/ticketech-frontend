import { useQuery } from "@tanstack/react-query";
import { getVenueTypes } from "../api/venueApi";

export default function VenuePage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["venueTypes"],
        queryFn: getVenueTypes,
    });

    if (isLoading) return <p className="p-4">Cargando tipos de Venue...</p>;
    if (error) return <p className="p-4 text-red-500">Error: {(error as Error).message}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">VenueService — Tipos de Venue</h1>
            <ul className="space-y-2">
                {data?.map((type: any) => (
                    <li key={type.venueTypeId} className="border p-2 rounded">
                        <strong>{type.name}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}
