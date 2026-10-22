import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
