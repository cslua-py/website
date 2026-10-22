import { Routes, Route } from "react-router";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Team from "./pages/Team.jsx";
import Member from "./pages/Member.jsx";
import Join from "./pages/Join.jsx";
import Bylaws from "./pages/Bylaws.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="team" element={<Team />} />
        <Route path="team/:slug" element={<Member />} />
        <Route path="join" element={<Join />} />
        <Route path="bylaws" element={<Bylaws />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
