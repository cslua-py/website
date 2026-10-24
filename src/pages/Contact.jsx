import PageHead from "../components/PageHead.jsx";
import usePageTitle from "../components/usePageTitle.js";
import { EMAIL, INSTAGRAM_URL } from "../config.js";

export default function Contact() {
  usePageTitle("Contacto");

  return (
    <>
      <PageHead title="Contacto">
        Si tenés alguna duda o querés colaborar con nosotros, escribinos a nuestro correo electrónico:
      </PageHead>
      <section className="section">
        <div className="wrap">
          <div className="cta">
            <a className="btn" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            {INSTAGRAM_URL && (
              <a className="btn btn-outline" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
