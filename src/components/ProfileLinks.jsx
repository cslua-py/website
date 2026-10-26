import { Link } from "react-router";
import { LICENSE, SOURCE_URL } from "../config.js";

// Links every custom profile page must keep (a way back to /team, and the license and
// source code the AGPL requires us to offer). It inherits the colors of the page.
export default function ProfileLinks({ className }) {
  return (
    <nav className={className} aria-label="Sitio">
      <Link to="/team">← Equipo</Link>
      {" · "}
      <a href={LICENSE.url} target="_blank" rel="noopener noreferrer">{LICENSE.name}</a>
      {SOURCE_URL && (
        <>
          {" · "}
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">Código fuente</a>
        </>
      )}
    </nav>
  );
}
