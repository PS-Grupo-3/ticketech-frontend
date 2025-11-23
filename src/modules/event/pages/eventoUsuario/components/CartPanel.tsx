interface CartPanelProps {
  cart: any[];
  total: number;
  onCheckout: () => void;
  onRemoveItem: (item: any) => void;
}

export default function CartPanel({
  cart,
  total,
  onCheckout,
  onRemoveItem,
}: CartPanelProps) {
  const disabled = cart.length === 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Carrito</h2>
        <span className="text-[13px] text-black">
          {cart.length}/5 asientos
        </span>
      </div>

      <div className="max-h-44 overflow-y-auto rounded-lg bg-slate-50 px-3 py-2 space-y-2">
        {cart.length === 0 && (
          <p className="text-xs text-black">Carrito vacío</p>
        )}

        {cart.map((item, index) => (
          <div
            key={item.eventSeatId ?? index}
            className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-b-0"
          >
            <div className="text-xs text-black space-y-0.5">
              <p className="text-black">
                <span className="font-semibold text-black">Sector:</span>{" "}
                {item.sectorName}
              </p>
              <p className="text-black">
                <span className="font-semibold text-black">Lugar:</span> Fila{" "}
                {item.row} · Asiento {item.column}
              </p>
              <p className="font-semibold text-emerald-600">${item.price}</p>
            </div>

            <button
              type="button"
              onClick={() => onRemoveItem(item)}
              className="text-[15px] text-red-500 hover:text-red-600 font-semibold"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 font-medium">Total</span>
        <span className="text-lg font-bold text-emerald-600">
          ${total || 0}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={disabled}
        className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition
          ${
            disabled
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
          }`}
      >
        Comprar entradas
      </button>
    </div>
  );
}
