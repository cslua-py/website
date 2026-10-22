import { useEffect } from "react";
import { Outlet, useLocation, useMatch } from "react-router";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { getMember } from "../data/team.js";
import { hasCustomProfile } from "../pages/profiles/index.js";

export default function Layout() {
  const { pathname } = useLocation();
  const profileMatch = useMatch("/team/:slug");
  const slug = profileMatch?.params.slug;
  // Custom profile pages bring their own chrome instead of the site menu and footer.
  const immersive = Boolean(getMember(slug)) && hasCustomProfile(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (immersive) {
    return (
      <main id="content">
        <Outlet />
      </main>
    );
  }

  return (
    <>
      <a className="skip" href="#content">Saltar al contenido</a>
      <Header />
      <main id="content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
