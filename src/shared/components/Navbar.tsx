import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Search, User } from "lucide-react";
import "../styles/Navbar.css";

export default function Navbar() {
  const [searchActive, setSearchActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    if (!searchActive) {
      setSearchActive(true);
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      if (document.activeElement !== inputRef.current) {
        setSearchActive(false);
      }
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-logo-links">
        <div className="navbar-logo">
          <img src="/vite.svg" alt="logo" />
          <h1>Ticketech</h1>
        </div>

        <nav className="navbar-links">
          <ul>
            <li><NavLink to="/" end>Inicio</NavLink></li>
            <li><NavLink to="/event">Eventos</NavLink></li>
            <li><NavLink to="/venue">Venues</NavLink></li>
          </ul>
        </nav>
      </div>

      <div className="navbar-user">
        <div className={`search-container ${searchActive ? "active" : ""}`}>
          <Search size={20} className="search-icon" onClick={handleSearchClick} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            className="search-input"
          />
        </div>

        <button className="user-avatar-btn" aria-label="Perfil">
          <img src="/default.png" alt="Usuario" />
        </button>
      </div>
    </header>
  );
}
