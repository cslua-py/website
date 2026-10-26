import { AUTHOR, LICENSE, SOURCE_URL } from "../config.js";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-bar">
        <div>
          <p>© {new Date().getFullYear()} Club de Software Libre de la Universidad Americana (CSLUA).</p>
          <p>Organización estudiantil sin fines de lucro.</p>
        </div>
        <div className="footer-meta">
          <p>
            Sitio creado por{" "}
            <a href={AUTHOR.url} target="_blank" rel="noopener noreferrer">{AUTHOR.name}</a>
          </p>
          <p>
            Software libre bajo{" "}
            <a href={LICENSE.url} target="_blank" rel="noopener noreferrer">{LICENSE.name}</a>
            {SOURCE_URL && (
              <>
                {" · "}
                <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">Código fuente</a>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
