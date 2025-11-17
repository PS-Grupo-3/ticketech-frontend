import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import LoginSidebar from "../../auth/pages/LoginSB";

export default function VenueSelectionPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      
      <Navbar onUserClick={() => setSidebarOpen(true)} />
      <LoginSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <h1 className="text-4xl font-extrabold mb-10 text-center">Seleccioná el tipo de Venue</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
          
          <Link
            to="/event/create"
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 p-10 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-lg hover:shadow-xl"
          >
            <span className="text-6xl mb-4">🏟️</span>
            <h2 className="text-2xl font-bold mb-2">Usar Venue Existente</h2>
            <p className="text-neutral-400">Elegí un Venue que ya está cargado en el sistema.</p>
          </Link>

          <Link
            to="/venue/create"
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 p-10 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-lg hover:shadow-xl"
          >
            <span className="text-6xl mb-4">✨</span>
            <h2 className="text-2xl font-bold mb-2">Crear Nuevo Venue</h2>
            <p className="text-neutral-400">Modelá un nuevo Venue desde cero.</p>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
