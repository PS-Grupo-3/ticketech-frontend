import { Link } from "react-router-dom";

export default function HomePage() {
    const sections = [
        {
            name: "EventService",
            path: "/event",
            color: "from-blue-500 to-blue-700",
            desc: "Gestiona categorías y eventos",
            icon: "🎟️",
        },
        {
            name: "VenueService",
            path: "/venue/editor",
            color: "from-green-500 to-green-700",
            desc: "Administra lugares y sectores",
            icon: "🏟️",
        },
        {
            name: "TicketService",
            path: "/ticket",
            color: "from-orange-500 to-orange-700",
            desc: "Estados y control de tickets",
            icon: "🎫",
        },
        {
            name: "OrderService",
            path: "/order",
            color: "from-purple-500 to-purple-700",
            desc: "Procesa órdenes y pagos",
            icon: "💳",
        },
        {
            name: "AuthService",
            path: "/auth",
            color: "from-gray-500 to-gray-700",
            desc: "Usuarios y autenticación",
            icon: "🔐",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Ticketech Dashboard
                </h1>
                <p className="text-neutral-400 mt-2">Frontend de integración entre microservicios</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl px-4">
                {sections.map((s) => (
                    <Link
                        key={s.name}
                        to={s.path}
                        className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${s.color} shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1`}
                    >
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                            <div className="text-5xl">{s.icon}</div>
                            <h2 className="text-xl font-semibold">{s.name}</h2>
                            <p className="text-sm text-neutral-200">{s.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <footer className="mt-12 text-neutral-600 text-sm">
                Ticketech © {new Date().getFullYear()} — Pruebas de conexión entre microservicios
            </footer>
        </div>
    );
}
