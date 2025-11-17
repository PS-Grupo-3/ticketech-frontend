import { format } from "date-fns";

export default function EventCard({
  event
}: {
  event: {
    eventId: string;
    name: string;
    category: string;
    categoryType: string;
    status: string;
    time: string;
    address: string;
    thumbnailUrl?: string | null;
  };
}) {
  const date = new Date(event.time);
  const dateStr = format(date, "dd/MM/yyyy HH:mm");

  const hasThumbnail = event.thumbnailUrl && event.thumbnailUrl.trim() !== "";

  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-lg">
      <div className="h-72 w-full bg-neutral-700 flex items-center justify-center overflow-hidden">
        {hasThumbnail ? (
          <img
            src={event.thumbnailUrl!}
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-gray-300">Imagen no disponible</p>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-400">{dateStr}</p>

        <h3 className="text-xl font-bold mt-2 uppercase">{event.name}</h3>

        <p className="text-sm text-gray-400 mt-1">
          {event.category} · {event.categoryType}
        </p>

        <p className="mt-3 text-sm bg-neutral-900 inline-block px-3 py-1 rounded">
          {event.status}
        </p>
      </div>
    </div>
  );
}
