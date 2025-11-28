interface SeatInfoPanelProps {
  selectedSeat: any;
  selectedSector: any;
  onAdd: () => void;
}

export default function SeatInfoPanel({
  selectedSeat,
  selectedSector,
  onAdd,
}: SeatInfoPanelProps) {
  if (!selectedSector) {
    return (
      <div className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 shadow-sm text-xs text-neutral-300">
        Seleccioná un sector.
      </div>
    );
  }

  const isFree = !selectedSector.isControlled;
  const disabled = isFree && selectedSector.capacity <= 0;

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-white">Detalle</h2>

      <div className="space-y-1 text-xs text-neutral-300">
        <p>
          <span className="font-semibold text-white">Sector:</span> {selectedSector.name}
        </p>

        {isFree ? (
          <p>
            <span className="font-semibold text-white">Disponibles:</span>{" "}
            {selectedSector.capacity}
          </p>
        ) : (
          <p>
            <span className="font-semibold text-white">Lugar:</span>{" "}
            {selectedSeat
              ? `Fila ${selectedSeat.row} – Asiento ${selectedSeat.column}`
              : "Ninguno"}
          </p>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wide text-neutral-300">Precio</span>
        <span className="text-2xl font-bold text-emerald-500">
          ${isFree ? selectedSector.price : selectedSeat?.price ?? "—"}
        </span>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition
          ${
            disabled
              ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          }`}
      >
        Agregar al carrito
      </button>
    </div>
  );
}
