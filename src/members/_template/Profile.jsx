import ProfileLinks from "../../components/ProfileLinks.jsx";
import "./profile.css";

// Your own profile page. Make it yours: it replaces the site's menu and footer, so
// everything on screen is up to you. Keep <ProfileLinks />: it holds the link back to /team
// and the license and source code links that the AGPL requires.
//
// `member` has everything from your member.js, plus `slug` and `photo` (a URL, or null).
// Prefix every CSS class with your slug (they are global), as `__SLUG__` is below.
export default function Profile({ member }) {
  return (
    <div className="__SLUG__">
      <h1>{member.name}</h1>
      {member.photo && <img className="__SLUG__-photo" src={member.photo} alt={`Imagen de perfil de ${member.name}`} />}
      <p>Esta es mi página. Todavía la estoy armando.</p>
      <ProfileLinks className="__SLUG__-links" />
    </div>
  );
}
