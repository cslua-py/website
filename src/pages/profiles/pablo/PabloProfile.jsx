import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { LICENSE, SOURCE_URL } from "../../../config.js";
import { UBUNTU_LOGO } from "./ubuntu-logo.js";
import { EXTENSIONS } from "./extensions.js";
import "./pablo.css";

// What `fastfetch` prints on Pablo's laptop (snapshot copied from the real terminal).
const USER = "ronanraw86";
const HOST = "lamaquinaRambo";
const FETCH = [
  ["OS", "Ubuntu 26.04.1 LTS (Resolute Raccoon) x86_64"],
  ["Kernel", "Linux 7.0.0-38-generic"],
  ["Packages", "1 (appimage), 2111 (dpkg), 37 (flatpak), 19 (snap)"],
  ["Shell", "bash 5.3.9"],
  ["DE/WM", "Mutter (Wayland)"],
  ["Login", "GDM 50.1"],
  ["Theme", "Graphite-teal-Dark-nord"],
  ["Cursor", "DMZ-White [GTK2/3/4]"],
  ["Terminal", "Ptyxis 50.1"],
  ["PC", "ASUS TUF Dash F15 FX516PE_TUF516PE (1.0)"],
  ["CPU", "11th Gen Intel(R) Core(TM) i7-11370H (8) @ 4.80 GHz"],
  ["GPU", "NVIDIA GeForce RTX 3050 Ti Mobile [Discrete]"],
  ["GPU 2", "Intel Iris Xe Graphics @ 1.35 GHz [Integrated]"],
  ["Display", "1920x1080 in 15\", 144 Hz [Built-in]"],
  ["Sound", "Audio Interno Estéreo analógico (70%)"],
];

// `hardware` and `peripherals` in team.js are objects of label -> value (plain text is ignored here).
const rowsOf = (value) => (value && typeof value === "object" ? Object.entries(value) : []);

// Width of the label column in the key/value windows: the longest label plus a gap.
const keyColumn = (rows) => ({ "--key-width": `${Math.max(...rows.map(([key]) => key.length)) + 2}ch` });

const LINK_LABELS = {
  github: "github",
  website: "website",
  linkedin: "linkedin",
  instagram: "instagram",
  dotfiles: "dotfiles",
};

// The 16 terminal colors (Nord-like, to match the Graphite theme). Color 0 equals the
// terminal background, which is why it is invisible in the fastfetch color blocks.
const ANSI_NAMES = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
const ANSI_NORMAL = ["#3c3c3c", "#bf616a", "#a3be8c", "#ebcb8b", "#81a1c1", "#b48ead", "#88c0d0", "#e5e9f0"];
const ANSI_BRIGHT = ["#4c566a", "#d08770", "#b5d19c", "#f0d399", "#8fb3d6", "#c8a0c0", "#8fd3d6", "#eceff4"];
const ANSI_GROUPS = [
  { label: "normal", colors: ANSI_NORMAL, offset: 0 },
  { label: "bright", colors: ANSI_BRIGHT, offset: 8 },
];

const DIRECTIONS = { h: "left", j: "down", k: "up", l: "right" };
const MAX_HISTORY = 200;

// The plain-text file the page "cats" with bat on load. It doubles as the key bindings
// cheat sheet, so the columns are aligned with spaces (the terminal is monospaced).
const HELP_FILE = "help.txt";
const HELP_LINES = [
  "Atajos de este escritorio",
  "",
  "Esc         salir del modo insert (hazlo primero)",
  "i, Enter    escribir en la terminal",
  "h j k l     moverte entre ventanas",
  "1, 2        cambiar de workspace (el 2 tiene mis links, mi foto y mi setup)",
  "← equipo    volver al equipo (barra de arriba)",
];
const MAX_LINE = 300;

// GNOME-style (keyboard) directional focus: among the windows lying in that direction, prefer the
// ones that overlap along the other axis, then the closest one.
function pickNeighbor(rects, currentId, direction) {
  const cur = rects[currentId];
  if (!cur) return null;
  const horizontal = direction === "left" || direction === "right";
  const center = (r) => ({ x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 });
  const from = center(cur);
  let best = null;
  for (const [id, rect] of Object.entries(rects)) {
    if (id === currentId) continue;
    const to = center(rect);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const along = { right: dx, left: -dx, down: dy, up: -dy }[direction];
    if (along <= 0) continue;
    const overlap = horizontal
      ? Math.min(cur.bottom, rect.bottom) - Math.max(cur.top, rect.top)
      : Math.min(cur.right, rect.right) - Math.max(cur.left, rect.left);
    const score = [overlap > 0 ? 0 : 1, along + Math.abs(horizontal ? dy : dx)];
    if (!best || score[0] < best.score[0] || (score[0] === best.score[0] && score[1] < best.score[1])) {
      best = { id, score };
    }
  }
  return best ? best.id : null;
}

const WORKSPACES = [
  { id: 1, name: "~", firstWindow: "term" },
  { id: 2, name: "setup", firstWindow: "links" },
];

const WINDOW_TITLES = {
  term: "ronanraw86@lamaquinaRambo: ~",
  about: "about.md",
  palette: "colors.lua",
  links: "ronanraw86@lamaquinaRambo: ~/links",
  media: "rambo.webp",
  hardware: "hardware.md",
  peripherals: "peripherals.md",
  extensions: "Gestor de extensiones",
};

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Win({ id, title, focus, onHover, register, children }) {
  return (
    <section
      ref={(el) => register(id, el)}
      className={`pablo-win pablo-${id}`}
      data-focused={focus === id}
      onMouseEnter={() => onHover(id)}
      onFocusCapture={() => onHover(id)}
      aria-label={title}
    >
      <div className="pablo-headerbar">
        <span className="pablo-headerbar-title">{title}</span>
        <span className="pablo-headerbar-buttons" aria-hidden="true">
          <span>–</span>
          <span>▢</span>
          <span>✕</span>
        </span>
      </div>
      <div className="pablo-win-body">{children}</div>
    </section>
  );
}

// An nvim buffer listing label/value rows, e.g. the hardware and peripherals windows.
function KeyValueWin({ id, heading, file, rows, ...win }) {
  return (
    <Win id={id} title={WINDOW_TITLES[id]} {...win}>
      <ol className="pablo-lines" style={keyColumn(rows)}>
        <li><span className="pablo-h">{`# ${heading}`}</span></li>
        <li />
        {rows.map(([key, value]) => (
          <li key={key}><span className="pablo-key">{key}</span><span>{value}</span></li>
        ))}
        <li />
      </ol>
      <p className="pablo-statusline">
        <span className="pablo-mode">NORMAL</span> {file}
      </p>
    </Win>
  );
}

// fish-style highlighting for a command that was already run: valid command in pink,
// file paths underlined.
function HighlightedCommand({ command }) {
  const [name, ...args] = command.split(" ");
  return (
    <>
      <span className="pablo-cmd-name">{name}</span>
      {args.map((arg, i) => (
        <span key={i}>
          {" "}
          {/^(~|\.{0,2}\/|[\w-]+\.\w+$)/.test(arg) ? <span className="pablo-cmd-path">{arg}</span> : arg}
        </span>
      ))}
    </>
  );
}

// Starship prompt in the home directory: user@host in ~, then lambda and the command line.
// `cursor` is "solid" while typing, "hollow" when the terminal is not receiving keys, and
// omitted for lines that were already run (`highlight` colors those like fish does).
function Starship({ command, cursor, highlight = false }) {
  return (
    <div className="pablo-starship">
      <p>
        <span className="pablo-green">╭─</span> <span className="pablo-yellow">{USER}@{HOST}</span> in{" "}
        <span className="pablo-purple">~</span> took 0s
      </p>
      <p>
        <span className="pablo-green">╰ λ</span>{" "}
        <span className="pablo-typed">
          {highlight ? <HighlightedCommand command={command} /> : command}
        </span>
        {cursor && <span className={`pablo-cursor pablo-cursor-${cursor}`} aria-hidden="true" />}
      </p>
    </div>
  );
}

// bat's "full" style: grid rules, a File header, and a line-number gutter. A .txt file gets
// no syntax highlighting, so lines are rendered as plain text.
function Bat({ file, lines }) {
  return (
    <div className="pablo-bat">
      <div className="pablo-bat-row pablo-bat-header">
        <span className="pablo-bat-num" />
        <span className="pablo-bat-text">File: {file}</span>
      </div>
      {lines.map((line, i) => (
        <div className="pablo-bat-row" key={i}>
          <span className="pablo-bat-num">{i + 1}</span>
          <span className="pablo-bat-text">{line}</span>
        </div>
      ))}
    </div>
  );
}

// The GNOME Extension Manager window. The switches are only visual (state lives in the page).
function Extensions() {
  const [enabled, setEnabled] = useState(() => Object.fromEntries(EXTENSIONS.map((ext) => [ext.uuid, ext.on])));
  const toggle = (uuid) => setEnabled((current) => ({ ...current, [uuid]: !current[uuid] }));
  return (
    <div className="pablo-ext">
      <p className="pablo-ext-tabs" aria-hidden="true">
        <span className="pablo-ext-tab" data-active="true">Instaladas</span>
        <span className="pablo-ext-tab">Explorar</span>
      </p>
      <h2 className="pablo-ext-title">Extensiones instaladas por el usuario</h2>
      <ul className="pablo-ext-list">
        {EXTENSIONS.map((ext) => (
          <li key={ext.uuid} className="pablo-ext-row">
            <span className="pablo-ext-info">
              <span className="pablo-ext-name">{ext.name}</span>
              <span className="pablo-ext-uuid">{ext.uuid}</span>
            </span>
            {ext.settings && <span className="pablo-ext-gear" aria-hidden="true">⚙</span>}
            <button
              type="button"
              role="switch"
              className="pablo-switch"
              aria-checked={enabled[ext.uuid]}
              aria-label={ext.name}
              onClick={() => toggle(ext.uuid)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Swatches() {
  return (
    <div className="pablo-palette-groups">
      {ANSI_GROUPS.map(({ label, colors, offset }) => (
        <div key={label}>
          <p className="pablo-comment">-- {label} ({offset}-{offset + 7})</p>
          <ul className="pablo-swatches" aria-label={`Colores ${label}`}>
            {colors.map((hex, i) => (
              <li key={hex}>
                <span className="pablo-swatch" style={{ background: hex }} aria-hidden="true" />
                <span className="pablo-swatch-name">{ANSI_NAMES[i]}</span>
                <span className="pablo-swatch-hex">{hex}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function PabloProfile({ member }) {
  const [workspace, setWorkspace] = useState(1);
  const [focus, setFocus] = useState("term");
  // Vim-like: "insert" sends keys to the terminal, "normal" lets hjkl move between windows.
  const [mode, setMode] = useState("insert");
  const [history, setHistory] = useState([]);
  const [draft, setDraft] = useState("");
  const windows = useRef({});
  const terminalEnd = useRef(null);
  const now = useClock();

  const links = Object.entries(member.links).filter(([, url]) => url);
  const hardware = rowsOf(member.hardware);
  const peripherals = rowsOf(member.peripherals);
  const typing = workspace === 1 && focus === "term" && mode === "insert";

  const register = (id, el) => {
    windows.current[id] = el;
  };

  // Mouse focus follows the pointer; entering the terminal this way lets you type right away.
  const hover = (id) => {
    setFocus(id);
    if (id === "term") setMode("insert");
  };

  const goTo = (id) => {
    const target = WORKSPACES.find((ws) => ws.id === id);
    if (!target) return;
    setWorkspace(target.id);
    setFocus(target.firstWindow);
    setMode(target.firstWindow === "term" ? "insert" : "normal");
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
      const target = event.target;
      // Let Enter/Space activate a focused link or button.
      if (
        target instanceof HTMLElement &&
        target.closest("a, button") &&
        (event.key === "Enter" || event.key === " ")
      ) {
        return;
      }

      // Typing in the terminal: characters just appear, nothing is executed.
      if (typing) {
        if (event.key === "Escape") {
          setMode("normal");
        } else if (event.key === "Backspace") {
          event.preventDefault();
          setDraft((d) => d.slice(0, -1));
        } else if (event.key === "Enter") {
          event.preventDefault();
          setHistory((h) => [...h, draft].slice(-MAX_HISTORY));
          setDraft("");
        } else if (event.key.length === 1) {
          event.preventDefault();
          setDraft((d) => (d.length < MAX_LINE ? d + event.key : d));
        }
        return;
      }

      if (focus === "term" && (event.key === "i" || event.key === "Enter")) {
        event.preventDefault();
        setMode("insert");
        return;
      }

      const direction = DIRECTIONS[event.key];
      if (direction) {
        event.preventDefault();
        const rects = {};
        for (const [id, el] of Object.entries(windows.current)) {
          if (el) rects[id] = el.getBoundingClientRect();
        }
        const next = pickNeighbor(rects, focus, direction);
        if (next) {
          setFocus(next);
          if (next === "term") setMode("normal");
        }
        return;
      }

      const ws = WORKSPACES.find((w) => String(w.id) === event.key);
      if (ws) goTo(ws.id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    if (history.length === 0 && draft === "") return;
    terminalEnd.current?.scrollIntoView({ block: "nearest" });
  }, [history, draft]);

  const clock = now.toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit", hour12: false });
  const panelDate = now.toLocaleDateString("es-PY", { weekday: "short", day: "2-digit", month: "short" });

  return (
    <div className="pablo">
      <header className="pablo-bar">
        <nav className="pablo-bar-left" aria-label="Workspaces">
          <Link className="pablo-activities" to="/team">← Equipo</Link>
          <span className="pablo-ws-dots">
            {WORKSPACES.map((ws) => (
              <button
                key={ws.id}
                type="button"
                className="pablo-ws-btn"
                aria-pressed={workspace === ws.id}
                aria-label={`Workspace ${ws.id}: ${ws.name}`}
                title={`${ws.id} ${ws.name}`}
                onClick={() => goTo(ws.id)}
              />
            ))}
          </span>
        </nav>
        <p className="pablo-bar-clock">
          <span>{panelDate}</span> <span className="pablo-clock">{clock}</span>
        </p>
        <p className="pablo-bar-right" aria-hidden="true">
          <span>{WINDOW_TITLES[focus]}</span>
          <span className="pablo-sys">◖ ♪ ⏻</span>
        </p>
      </header>

      {workspace === 1 && (
        <div className="pablo-ws pablo-ws-1">
          <Win id="term" title={WINDOW_TITLES.term} focus={focus} onHover={hover} register={register}>
            <div className="pablo-term-main">
              <Starship command="fastfetch" highlight />
              <div className="pablo-fetch">
                <pre className="pablo-logo" aria-hidden="true">{UBUNTU_LOGO}</pre>
                <div className="pablo-info">
                  <p className="pablo-fetch-head">
                    <span className="pablo-green">{USER}</span>@<span className="pablo-green">{HOST}</span>
                  </p>
                  <p className="pablo-rule" aria-hidden="true">--------------------</p>
                  <dl>
                    {FETCH.map(([key, value]) => (
                      <div key={key}>
                        <dt>{key}:</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="pablo-ansi" aria-hidden="true">
                    {[ANSI_NORMAL, ANSI_BRIGHT].map((row, i) => (
                      <ul key={i}>
                        {row.map((color) => (
                          <li key={color} style={{ background: color }} />
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
              <Starship command={`bat ${HELP_FILE}`} highlight />
              <Bat file={HELP_FILE} lines={HELP_LINES} />
              {history.map((line, i) => (
                <Starship key={i} command={line} />
              ))}
              <Starship command={draft} cursor={typing ? "solid" : "hollow"} />
              <span ref={terminalEnd} />
            </div>
          </Win>

          <Win id="about" title={WINDOW_TITLES.about} focus={focus} onHover={hover} register={register}>
            <ol className="pablo-lines">
              <li><span className="pablo-h">{`# ${member.name}`}</span></li>
              <li />
              {member.role && <li>{member.role} del CSLUA</li>}
              {member.semester && member.degree && (
                <li>Alumno del {member.semester} semestre de {member.degree}.</li>
              )}
              <li />
              <li><span className="pablo-h">## Qué es esto</span></li>
              <li>
                Así se ve mi escritorio de todos los días: Ubuntu con GNOME, el tema Graphite en tonos nord y una terminal con Starship. Lo que ves es mi entorno real, copiado de mi propia máquina.
              </li>
              <li />
              <li><span className="pablo-h">## Mi setup</span></li>
              <li>
                Uso Ubuntu junto con Windows 11, sobre una ASUS TUF Dash F15. Los datos de la terminal son una captura de mi fastfetch.
              </li>
              <li />
            </ol>
            <p className="pablo-statusline">
              <span className="pablo-mode">NORMAL</span> about.md
            </p>
          </Win>

          <Win id="palette" title={WINDOW_TITLES.palette} focus={focus} onHover={hover} register={register}>
            <Swatches />
            <p className="pablo-statusline">
              <span className="pablo-mode">NORMAL</span> colors.lua
            </p>
          </Win>
        </div>
      )}

      {workspace === 2 && (
        <div className={`pablo-ws pablo-ws-2${hardware.length > 0 && peripherals.length > 0 ? " pablo-ws-2-split" : ""}`}>
          <Win id="links" title={WINDOW_TITLES.links} focus={focus} onHover={hover} register={register}>
            <div className="pablo-term-main">
              <Starship command="ls -l ~/links" highlight />
              {links.length > 0 ? (
                <ul className="pablo-ls">
                  {links.map(([key, url]) => (
                    <li key={key}>
                      <span className="pablo-perm">lrwxrwxrwx</span>{" "}
                      <a href={url} target="_blank" rel="noopener noreferrer">{LINK_LABELS[key]}</a>
                      <span className="pablo-arrow"> → {url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>total 0</p>
              )}
              <Starship command="" cursor="hollow" />
            </div>
          </Win>

          <Win id="media" title={WINDOW_TITLES.media} focus={focus} onHover={hover} register={register}>
            <div className="pablo-term-main pablo-media-main">
              <Starship command="kitten icat rambo.webp" highlight />
              <img className="pablo-media-img" src={`${import.meta.env.BASE_URL}team/rambo.webp`} alt="Foto de perfil de Pablo Ayala (Rambo)" />
              <Starship command="" cursor="hollow" />
            </div>
          </Win>

          <Win id="extensions" title={WINDOW_TITLES.extensions} focus={focus} onHover={hover} register={register}>
            <Extensions />
          </Win>

          {hardware.length > 0 && (
            <KeyValueWin id="hardware" heading="Hardware" file="hardware.md" rows={hardware} focus={focus} onHover={hover} register={register} />
          )}

          {peripherals.length > 0 && (
            <KeyValueWin id="peripherals" heading="Periféricos" file="peripherals.md" rows={peripherals} focus={focus} onHover={hover} register={register} />
          )}
        </div>
      )}

      <footer className="pablo-status">
        <span className="pablo-mode">{workspace}</span>
        <span>pablo.jsx</span>
        {typing && <span className="pablo-insert">-- INSERT --</span>}
        <span className="pablo-status-right">
          <span>{typing ? "esc: salir" : focus === "term" ? "i: escribir" : "hjkl: mover"}</span>
          <span>1-{WORKSPACES.length}: workspace</span>
          <a href={LICENSE.url} target="_blank" rel="noopener noreferrer">{LICENSE.name}</a>
          {SOURCE_URL && (
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">código fuente</a>
          )}
          {member.links.github ? (
            <a href={member.links.github} target="_blank" rel="noopener noreferrer">{member.name}</a>
          ) : (
            <span>{member.name}</span>
          )}
        </span>
      </footer>
    </div>
  );
}
