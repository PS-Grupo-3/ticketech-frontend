export default function TimerBar({ timeLeft }: { timeLeft: number }) {
  if (timeLeft <= 0) return null;

  const total = 40; // ETIQUETA: CAMBIO TIMER
  const percent = (timeLeft / total) * 100;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
        <span>Tiempo para completar la compra</span>
        <span className={timeLeft <= 10 ? "text-red-500" : "text-emerald-600"}>
          {timeLeft}s
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            timeLeft <= 10 ? "bg-red-500" : "bg-emerald-500"
          }`}
          style={{
            width: `${percent}%`,
            transition: "width 0.4s linear",
          }}
        />
      </div>
    </div>
  );
}
