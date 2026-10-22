import PageHead from "../components/PageHead.jsx";
import usePageTitle from "../components/usePageTitle.js";

const OBJECTIVES = [
  ["Herramientas libres", "Fomentar el uso de herramientas y sistemas de software libre."],
  ["Aprender haciendo", "Talleres, seminarios, conferencias y cursos."],
  ["Intercambio", "Conectar a estudiantes, docentes y profesionales del área tecnológica."],
  ["Proyectos", "Impulsar investigación, innovación y desarrollo tecnológico."],
  ["Competencias técnicas", "Administración de sistemas, redes, programación y seguridad informática."],
  ["Representación", "Participar en eventos de tecnologías abiertas en nombre de la Universidad."],
];

export default function About() {
  usePageTitle("Quiénes somos");

  return (
    <>
      <PageHead title="Quiénes somos">
        Una organización estudiantil sin fines de lucro, adscrita a la Universidad Americana.
      </PageHead>
      <section className="section">
        <div className="wrap">
          <div className="two">
            <p>
              El <strong>Club de Software Libre de la Universidad Americana (CSLUA)</strong> tiene
              como misión motivar el interés por el software libre y crear un espacio dinámico y
              colaborativo donde estudiantes de todas las carreras profundicen sus conocimientos,
              se preparen para desafíos académicos y participen en competencias.
            </p>
            <p>
              Contamos con el respaldo de la Dirección de las carreras de Ingeniería en
              Informática, Análisis de Sistemas e Inteligencia Artificial y Robótica, y con un
              Comité Directivo integrado por un Coordinador General, un Secretario, un Coordinador
              Técnico y un Coordinador de Proyectos.
            </p>
          </div>
          <h2 className="h-sub">Nuestros objetivos</h2>
          <ul className="cards">
            {OBJECTIVES.map(([title, text], i) => (
              <li key={title}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <h4>{title}</h4>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
