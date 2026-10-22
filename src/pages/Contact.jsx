import PageHead from "../components/PageHead.jsx";
import usePageTitle from "../components/usePageTitle.js";
import { EMAIL } from "../config.js";

export default function Contact() {
  usePageTitle("Contacto");

  return (
    <>
      <PageHead title="Contacto">
        Si tenés alguna duda o querés colaborar con nosotros, escribinos a nuestro correo electrónico:
      </PageHead>
      <section className="section">
        <div className="wrap">
          <a className="btn" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </section>
    </>
  );
}
