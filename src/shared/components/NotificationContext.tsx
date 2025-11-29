import { createContext, useContext, useState, type ReactNode } from "react";

type NotificationType = {
  message: string;
  show: (msg: string) => void;
};

const NotificationCtx = createContext<NotificationType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");

  const show = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <NotificationCtx.Provider value={{ message, show }}>
      {children}

      {message && (
        <div
          className="
            fixed inset-0
            flex items-center justify-center
            bg-black/60
            backdrop-blur-sm
            z-50
          "
        >
          <div
            className="
              bg-neutral-900
              text-neutral-100
              border border-neutral-700
              rounded-2xl
              shadow-2xl
              px-8 py-5
              text-center
              text-lg
              font-medium
              animate-fadeIn
              max-w-md
            "
          >
            {message}
          </div>
        </div>
      )}
    </NotificationCtx.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationCtx);
  if (!ctx) throw new Error("useNotification debe usarse dentro de NotificationProvider");
  return ctx;
}
