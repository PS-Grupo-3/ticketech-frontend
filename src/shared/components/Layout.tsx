import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({
  children,
  onUserClick
}: {
  children: React.ReactNode;
  onUserClick: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <Navbar onUserClick={onUserClick} />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
