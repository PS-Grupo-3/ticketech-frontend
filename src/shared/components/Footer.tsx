import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>Ticketech © {new Date().getFullYear()} — Todos los derechos reservados</p>
    </footer>
  );
}
