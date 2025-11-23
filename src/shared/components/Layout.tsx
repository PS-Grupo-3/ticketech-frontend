import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoginSidebar from "../../modules/auth/pages/LoginSB";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      console.log("JWT decodificado:", decoded);

      setUser({
        name: decoded.Username + " " + decoded.UserLastName, 
        userId: decoded.userId,
        role: decoded.userRole,
        token
      });

    } catch {
      setUser(null);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <Navbar
        onUserClick={() => setSidebarOpen(true)}
        user={user}
      />

      <LoginSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
