import { Link } from "react-router";
import PageHead from "../components/PageHead.jsx";
import usePageTitle from "../components/usePageTitle.js";

export default function NotFound() {
  usePageTitle("Página no encontrada");

  return (
    <>
      <PageHead title="Página no encontrada">Esa dirección no existe en el sitio.</PageHead>
      <section className="section">
        <div className="wrap">
          <Link className="btn" to="/">Volver al inicio</Link>
        </div>
      </section>
    </>
  );
}
