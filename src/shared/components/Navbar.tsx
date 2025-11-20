import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Search, User, Menu } from "lucide-react";

type NavbarProps = {
  onUserClick: () => void;
  onSearch?: (query: string) => void;   // solo se usa en "/"
};

export default function Navbar({ onUserClick, onSearch }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const canSearch = location.pathname === "/"; // solo home habilita búsqueda

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  const toggleSearch = () => {
    if (!canSearch) return;
    setSearchOpen(!searchOpen);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canSearch) return;
    onSearch?.(e.target.value);
  };

  return (
    <header className="w-full bg-neutral-900 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo + Links */}
        <div className="flex items-center gap-10">
          <NavLink to="/" className="flex items-center gap-3">
           {/* <img src="/vite.svg" className="w-8 h-8" /> */}
            <span className="text-xl font-semibold">Ticketech</span>
          </NavLink>

          <nav className="hidden md:flex gap-8 text-sm">
            <NavLink to="/" className="hover:text-gray-300">Inicio</NavLink>
            <NavLink to="/event/create" className="hover:text-gray-300">Eventos</NavLink>
            <NavLink to="/dashboard" className="hover:text-gray-300">Dashboard</NavLink>
          </nav>
        </div>

        {/* Search + User */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center bg-neutral-800 px-3 py-1.5 rounded-lg transition-all
              ${searchOpen ? "w-64" : "w-10"} 
              ${!canSearch ? "opacity-40 pointer-events-none" : ""}
            `}
          >
            <Search
              size={20}
              className="cursor-pointer"
              onClick={toggleSearch}
            />

            {searchOpen && (
              <input
                ref={inputRef}
                type="text"
                placeholder={canSearch ? "Buscar eventos..." : "Deshabilitado"}
                onChange={handleSearch}
                className="bg-transparent ml-2 flex-1 outline-none text-sm"
              />
            )}
          </div>

          <button onClick={onUserClick} className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
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
