import { Link } from "react-router";
import logo from "../assets/logo.svg";
import usePageTitle from "../components/usePageTitle.js";

const SHORTCUTS = [
  ["/about", "Quiénes somos", "Nuestra misión, objetivos y cómo nos organizamos."],
  ["/team", "Equipo", "Coordinadores y colaboradores del club, y las distros y herramientas que usan."],
  ["/join", "Afiliarse", "Requisitos y categorías para ser parte del club."],
  ["/bylaws", "Reglamento", "El reglamento interno aprobado por el Consejo Superior."],
  ["/contact", "Contacto", "Escribinos para dudas, ideas o colaboraciones."],
];

export default function Home() {
  usePageTitle();

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">Universidad Americana · Asunción, Paraguay</p>
            <h1>
              Club de <span className="mark">Software Libre</span>
            </h1>
            <p className="lead">
              Un espacio de estudiantes para estudiantes de todas las carreras: aprendemos,
              compartimos y construimos con tecnologías libres.
            </p>
            <div className="cta">
              <Link className="btn" to="/join">Quiero afiliarme</Link>
              <Link className="btn btn-outline" to="/about">Conocé el club</Link>
            </div>
          </div>
          <img className="hero-logo" src={logo} alt="Logo del CSLUA: un tucán" />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <ul className="cards cards-4">
            {SHORTCUTS.map(([to, title, text]) => (
              <li key={to}>
                <h4>
                  <Link className="card-link" to={to}>{title}</Link>
                </h4>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
