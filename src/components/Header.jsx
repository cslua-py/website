import { useState } from "react";
import { Link, NavLink } from "react-router";
import logo from "../assets/logo.svg";
import { NAV } from "../config.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="wrap header-bar">
        <Link className="brand" to="/" aria-label="CSLUA, inicio" onClick={() => setOpen(false)}>
          <img src={logo} alt="" width="40" height="40" />
          <span>CSLUA</span>
        </Link>
        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          Menú
        </button>
        <nav id="menu" className={`menu${open ? " open" : ""}`} aria-label="Principal">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
