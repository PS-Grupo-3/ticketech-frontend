import { Link } from "react-router-dom";
import "../../styles/HomePage.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LoginSidebar from "../../../modules/auth/pages/LoginSB";
import { useState } from "react";

export default function Dashboard() {
  const sections = [
    { name: "EventService", path: "/event", color: "bg-blue", desc: "Gestiona categorías y eventos", icon: "🎟️" },
    { name: "VenueService", path: "/venue", color: "bg-green", desc: "Administra lugares y sectores", icon: "🏟️" },
    { name: "TicketService", path: "/ticket", color: "bg-orange", desc: "Estados y control de tickets", icon: "🎫" },
    { name: "OrderService", path: "/order", color: "bg-purple", desc: "Procesa órdenes y pagos", icon: "💳" },
    { name: "AuthService", path: "/auth", color: "bg-gray", desc: "Usuarios y autenticación", icon: "🔐" },
  ];
  
  const [sidebarOpen, setSidebarOpen]=useState(false);



  return (
    <div className="homepage">
      <Navbar onUserClick={()=>setSidebarOpen(true)}/>
      <LoginSidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)}/>

      <div className="homepage-header">
        <h1 className="homepage-title">Ticketech Dashboard</h1>
        <p className="homepage-subtitle">Frontend de integración entre microservicios</p>
      </div>

      <div className="sections-grid">
        {sections.map((s) => (
          <Link key={s.name} to={s.path} className={`section-card ${s.color}`}>
            <div className="section-bg"></div>
            <div className="section-content">
              <div className="section-icon">{s.icon}</div>
              <h2>{s.name}</h2>
              <p className="section-desc">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
}
