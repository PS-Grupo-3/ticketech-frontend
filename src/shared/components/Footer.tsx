import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>Ticketech © {new Date().getFullYear()} — Pruebas de conexión entre microservicios</p>
    </footer>
  );
}
