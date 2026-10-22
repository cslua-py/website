import { Link } from "react-router";
import PageHead from "../components/PageHead.jsx";
import usePageTitle from "../components/usePageTitle.js";
import { EMAIL, JOIN_FORM_URL, COMMUNITY_URL } from "../config.js";

const REQUIREMENTS = [
  { id: "student", content: "Ser estudiante activo de la Universidad Americana." },
  { id: "form", content: "Completar el formulario de inscripción oficial del club." },
  {
    id: "bylaws",
    content: (
      <>
        Aceptar y comprometerte a cumplir el{" "}
        <Link className="inline-link" to="/bylaws">reglamento</Link>.
      </>
    ),
  },
];

const subject = encodeURIComponent("Quiero afiliarme al CSLUA");
const joinHref = JOIN_FORM_URL || `mailto:${EMAIL}?subject=${subject}`;

export default function Join() {
  usePageTitle("Afiliarse");

  return (
    <>
      <PageHead title="Afiliarse al club">
        Pueden ser miembros todos los estudiantes activos de la Universidad Americana que tengan
        interés en promover el software libre.
      </PageHead>
      <section className="section">
        <div className="wrap two">
          <div className="panel">
            <h2 className="h-panel">Requisitos</h2>
            <ol className="steps">
              {REQUIREMENTS.map((r) => (
                <li key={r.id}>{r.content}</li>
              ))}
            </ol>
            <div className="cta">
              <a
                className="btn"
                href={joinHref}
                {...(JOIN_FORM_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {JOIN_FORM_URL ? "Completar formulario" : "Solicitar afiliación"}
              </a>
              {COMMUNITY_URL && (
                <a className="btn btn-outline" href={COMMUNITY_URL} target="_blank" rel="noopener noreferrer">
                  Unirme al grupo
                </a>
              )}
            </div>
          </div>
          <div className="panel">
            <h2 className="h-panel">Categorías de miembros</h2>
            <dl className="defs">
              <dt>Activos</dt>
              <dd>Estudiantes que participan regularmente en las actividades del club.</dd>
              <dt>Fundadores</dt>
              <dd>Estudiantes que participaron en la creación del club.</dd>
              <dt>Colaboradores</dt>
              <dd>Docentes, egresados o profesionales que apoyan las actividades.</dd>
              <dt>Honorarios</dt>
              <dd>Personas designadas por sus méritos o contribuciones destacadas.</dd>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
