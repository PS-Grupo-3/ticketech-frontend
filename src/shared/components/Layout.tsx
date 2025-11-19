import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoginSidebar from "../../modules/auth/pages/LoginSB";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <Navbar onUserClick={() => setSidebarOpen(true)} />

      <LoginSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
