import PageHead from "../components/PageHead.jsx";
import usePageTitle from "../components/usePageTitle.js";
import { BYLAWS_URL } from "../config.js";

export default function Bylaws() {
  usePageTitle("Reglamento");

  return (
    <>
      <PageHead title="Reglamento">
        Aprobado por el Consejo Superior Universitario y de aplicación obligatoria para todos los
        miembros del club.
      </PageHead>
      <section className="section">
        <div className="wrap two">
          <p>
            El Reglamento Interno del CSLUA regula la naturaleza, misión, objetivos, estructura,
            membresía, actividades, recursos y disciplina del club.
          </p>
          <div className="panel">
            <p>
              <strong>Resolución CSU N° 032/2026</strong>
              <br />
              Aprobación del Reglamento Interno del CSLUA
              <br />
              <span className="muted">Asunción, 23 de junio de 2026</span>
            </p>
            <a className="btn" href={BYLAWS_URL} target="_blank" rel="noopener noreferrer">
              Leer el reglamento (PDF)
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
