import { NavLink } from "react-router-dom";
import { User, Menu } from "lucide-react";

type NavbarProps = {
  onUserClick: () => void;
  user?: { name: string };
};

 function fixEncoding(str: string): string {
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}
export default function Navbar({ onUserClick, user }: NavbarProps) {
  return (
    <header className="w-full bg-neutral-900 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo + Links */}
        <div className="flex items-center gap-10">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="text-xl font-semibold">Ticketech</span>
          </NavLink>

          <nav className="hidden md:flex gap-8 text-sm">
            <NavLink to="/" className="hover:text-gray-300">Inicio</NavLink>
          </nav>
        </div>

        {/* User */}
        <div className="flex items-center gap-4">

          {user && (
            <span className="text-sm text-gray-300">
              Hola, {fixEncoding(user.name)}
            </span>
          )}

          <button
            onClick={onUserClick}
            className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center"
          >
            <User size={20} />
          </button>

          <button className="md:hidden">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
