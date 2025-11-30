import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 text-neutral-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Ticketech
            </h3>
            <p className="text-sm leading-relaxed">
              Gestión y venta de entradas. <br />
              Simple, rápido y seguro.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-green-500 transition-colors">Inicio</Link>
              </li>
      
              {user && (
                <li>
                  <Link to="/order/my-orders" className="hover:text-blue-500 transition-colors">Mis Compras</Link>
                </li>
              )}
              
              {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
                 <li>
                   <Link to="/dashboard" className="hover:text-blue-500 transition-colors">Panel de Administración</Link>
                 </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-green-600" />
                <span>info@ticketech.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-green-600" />
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 text-center text-xs">
          <p>
            &copy; {currentYear} TICKETECH.
          </p>
        </div>
      </div>
    </footer>
  );
}