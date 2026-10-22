export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-bar">
        <p>© {new Date().getFullYear()} Club de Software Libre de la Universidad Americana (CSLUA).</p>
        <p>Organización estudiantil sin fines de lucro.</p>
      </div>
    </footer>
  );
}
