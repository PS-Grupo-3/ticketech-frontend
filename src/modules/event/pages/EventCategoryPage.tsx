import { useQuery } from "@tanstack/react-query";
import { getEventCategories } from "../api/eventApi";

export default function EventCategoryPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["eventCategories"],
        queryFn: getEventCategories,
    });

    if (isLoading) return <p className="p-4">Cargando categorías...</p>;
    if (error) return <p className="p-4 text-red-500">Error: {(error as Error).message}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Ejemplo para obtener las categorías de Evento:</h1>
            <ul className="space-y-2">
                {data?.map((cat: any) => (
                    <li key={cat.categoryId} className="border p-2 rounded">
                        <strong>{cat.name}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}
