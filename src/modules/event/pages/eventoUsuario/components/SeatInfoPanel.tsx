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
  const disabled = !selectedSeat || !selectedSector;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm space-y-3">
      <h2 className="text-sm text-black font-semibold text-slate-900">
        Detalle del ticket
      </h2>

      <div className="space-y-1 text-xs text-slate-600">
        <p className="text-black">
          <span className="font-semibold text-black">Sector:</span>{" "}
          {selectedSector ? selectedSector.name : "Ninguno"}
        </p>
        <p className="text-black">
          <span className="font-semibold text-black">Lugar:</span>{" "}
          {selectedSeat
            ? `Fila ${selectedSeat.row} · Asiento ${selectedSeat.column}`
            : "Ninguno"}
        </p>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wide text-black">
          Precio
        </span>
        <span className="text-2xl font-bold text-emerald-600">
          {selectedSeat ? `$${selectedSeat.price}` : "—"}
        </span>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition
          ${
            disabled
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          }`}
      >
        Agregar al carrito
      </button>
    </div>
  );
}
