import { Link, useParams } from "react-router";
import Avatar from "../components/Avatar.jsx";
import usePageTitle from "../components/usePageTitle.js";
import { getMember } from "../data/team.js";
import NotFound from "./NotFound.jsx";

const FIELDS = [
  ["distro", "Distro"],
  ["desktop", "Escritorio / WM"],
  ["editor", "Editor"],
  ["terminal", "Terminal"],
  ["hardware", "Equipo"],
  ["peripherals", "Periféricos"],
];

const LINK_LABELS = {
  github: "GitHub",
  website: "Sitio web",
  linkedin: "LinkedIn",
  dotfiles: "Dotfiles",
};

export default function Member() {
  const { slug } = useParams();
  const member = getMember(slug);
  usePageTitle(member ? member.name : "Página no encontrada");

  if (!member) return <NotFound />;

  const fields = FIELDS.filter(([key]) => member[key]);
  const links = Object.entries(member.links).filter(([, url]) => url);

  return (
    <div className="member-page" style={member.theme ?? undefined}>
      <div className="page-head">
        <div className="wrap">
          <Link className="back-link" to="/team">← Equipo</Link>
          <div className="member-hero">
            <Avatar member={member} size="xl" />
            <div>
              <h1>{member.name}</h1>
              {member.role && <p className="member-role">{member.role}</p>}
              {member.semester && member.degree && (
                <p className="member-meta">
                  Alumno del {member.semester} semestre de {member.degree}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="panel">
            <h2 className="h-panel">Setup</h2>
            {fields.length > 0 ? (
              <dl className="setup">
                {fields.map(([key, label]) => (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>{member[key]}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="muted">Más detalles próximamente.</p>
            )}
            {links.length > 0 && (
              <ul className="member-links">
                {links.map(([key, url]) => (
                  <li key={key}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {LINK_LABELS[key]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
