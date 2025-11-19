import { useEffect, useState } from "react";
import { getVenues } from "../../../venue/api/venueApi";

export default function Step3SelectVenue({ data, onNext, onBack }: any) {
  const [venues, setVenues] = useState<any[]>([]);
  const [local, setLocal] = useState(data);

  useEffect(() => {
    getVenues().then((v: any) => setVenues(v));
  }, []);

  const handleNext = () => onNext(local);

  const selectVenue = (id: string) => {
    setLocal({ ...local, venueId: id });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Seleccionar venue</h2>
      <p className="text-sm text-gray-400">
        Elegí uno de los venues cargados. Esto define dónde se realizará el evento.
      </p>

      {/* GRID DE VENUES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((v: any) => {
          const selected = v.venueId === local.venueId;

          return (
            <div
              key={v.venueId}
              onClick={() => selectVenue(v.venueId)}
              className={`cursor-pointer rounded-xl overflow-hidden border bg-neutral-800 transition-all ${
                selected
                  ? "border-blue-500 shadow-lg shadow-blue-900/40"
                  : "border-neutral-700 hover:border-neutral-500"
              }`}
            >
              {/* IMAGEN DE BACKGROUND */}
              <div className="relative h-40 w-full">
                <img
                  src={v.backgroundImageUrl || v.venueBackgroundImageUrl || ""}
                  className="w-full h-full object-cover opacity-80"
                />

                {/* OVERLAY OSCURO */}
                <div className="absolute inset-0 bg-black/40" />

                {/* NOMBRE DEL VENUE SOBRE LA IMAGEN */}
                <div className="absolute bottom-2 left-2 text-white font-semibold text-lg drop-shadow-md">
                  {v.name}
                </div>
              </div>

              {/* INFO */}
              <div className="p-4 space-y-1">
                <p className="text-gray-400 text-sm">
                  Dirección: {v.address ?? "No especificada"}
                </p>

                <p className="text-gray-400 text-sm">
                  Capacidad: {v.totalCapacity}
                </p>

                {v.venueType && (
                  <p className="text-gray-400 text-sm">
                    Tipo: {v.venueType.name}
                  </p>
                )}

                {selected && (
                  <p className="text-blue-400 text-sm font-semibold pt-1">
                    Seleccionado
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTONES */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm rounded-md border border-neutral-700 text-gray-300 hover:bg-neutral-800"
        >
          Volver
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!local.venueId}
          className={`px-6 py-2 text-sm rounded-md font-semibold ${
            local.venueId
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-neutral-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
