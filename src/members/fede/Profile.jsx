import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AUTHOR, LICENSE, SOURCE_URL } from "../../config.js";
import { GARUDA_LOGO } from "./garuda-logo.js";
import selfie from "./selfie.webp";
import "./fede.css";

// What `fastfetch` prints on Fede's laptop (snapshot copied from the real terminal).
const HOST = "garuda-hyprland";
const FETCH = [
  ["OS", "Garuda Linux x86_64"],
  ["Host", "ASUS Vivobook 14 M1407KA_M1407KA (1.0)"],
  ["Kernel", "7.3.0-2-garuda"],
  ["Uptime", "48 mins"],
  ["Packages", "1511 (pacman)[stable]"],
  ["Shell", "fish 4.9.3"],
  ["Resolution", "1920x1200"],
  ["Window Manager", "Hyprland 0.56.2 (Wayland)"],
  ["Terminal", "kitty 0.49.2"],
  ["CPU", "AMD Ryzen AI 7 350 (8+8) @ 5.090GHz"],
  ["GPU", "AMD Radeon 860M Graphics"],
  ["Memory", "2150MiB / 15090MiB"],
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

// The 16 terminal colors, sampled from my (Fede) real terminal (Gruvbox dark). Color 0 equals
// the terminal background, which is why it is invisible in the fastfetch color blocks.
const ANSI_NAMES = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
const ANSI_NORMAL = ["#3e3e38", "#cc241d", "#98971a", "#d79921", "#458588", "#b16286", "#689d6a", "#a89984"];
const ANSI_BRIGHT = ["#928374", "#fb4934", "#b8bb26", "#fabd2f", "#83a598", "#d3869b", "#8ec07c", "#ebdbb2"];
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
  "Esc         salir del modo insert (hacelo primero)",
  "i, Enter    escribir en la terminal",
  "h j k l     moverte entre ventanas",
  "1, 2        cambiar de workspace (el 2 tiene mis links, mi foto y mi setup)",
  "← equipo    volver al equipo (barra de arriba)",
];
const MAX_LINE = 300;

// Hyprland-style directional focus: among the windows lying in that direction, prefer the
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
  term: "fish",
  about: "nvim about.md",
  palette: "nvim colors.lua",
  links: "fish",
  media: "media",
  hardware: "nvim hardware.md",
  peripherals: "nvim peripherals.md",
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
      className={`fede-win fede-${id}`}
      data-focused={focus === id}
      onMouseEnter={() => onHover(id)}
      onFocusCapture={() => onHover(id)}
      aria-label={title}
    >
      <div className="fede-win-body">{children}</div>
    </section>
  );
}

// An nvim buffer listing label/value rows, e.g. the hardware and peripherals windows.
function KeyValueWin({ id, heading, file, rows, ...win }) {
  return (
    <Win id={id} title={WINDOW_TITLES[id]} {...win}>
      <ol className="fede-lines" style={keyColumn(rows)}>
        <li><span className="fede-h">{`# ${heading}`}</span></li>
        <li />
        {rows.map(([key, value]) => (
          <li key={key}><span className="fede-key">{key}</span><span>{value}</span></li>
        ))}
        <li />
      </ol>
      <p className="fede-statusline">
        <span className="fede-mode">NORMAL</span> {file}
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
      <span className="fede-cmd-name">{name}</span>
      {args.map((arg, i) => (
        <span key={i}>
          {" "}
          {/^(~|\.{0,2}\/|[\w-]+\.\w+$)/.test(arg) ? <span className="fede-cmd-path">{arg}</span> : arg}
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
    <div className="fede-starship">
      <p>
        <span className="fede-green">╭─</span> <span className="fede-yellow">fede@{HOST}</span> in{" "}
        <span className="fede-purple">~</span>
      </p>
      <p>
        <span className="fede-green">╰ λ</span>{" "}
        <span className="fede-typed">
          {highlight ? <HighlightedCommand command={command} /> : command}
        </span>
        {cursor && <span className={`fede-cursor fede-cursor-${cursor}`} aria-hidden="true" />}
      </p>
    </div>
  );
}

// bat's "full" style: grid rules, a File header, and a line-number gutter. A .txt file gets
// no syntax highlighting, so lines are rendered as plain text.
function Bat({ file, lines }) {
  return (
    <div className="fede-bat">
      <div className="fede-bat-row fede-bat-header">
        <span className="fede-bat-num" />
        <span className="fede-bat-text">File: {file}</span>
      </div>
      {lines.map((line, i) => (
        <div className="fede-bat-row" key={i}>
          <span className="fede-bat-num">{i + 1}</span>
          <span className="fede-bat-text">{line}</span>
        </div>
      ))}
    </div>
  );
}

function Swatches() {
  return (
    <div className="fede-palette-groups">
      {ANSI_GROUPS.map(({ label, colors, offset }) => (
        <div key={label}>
          <p className="fede-comment">-- {label} ({offset}-{offset + 7})</p>
          <ul className="fede-swatches" aria-label={`Colores ${label}`}>
            {colors.map((hex, i) => (
              <li key={hex}>
                <span className="fede-swatch" style={{ background: hex }} aria-hidden="true" />
                <span className="fede-swatch-name">{ANSI_NAMES[i]}</span>
                <span className="fede-swatch-hex">{hex}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function FedeProfile({ member }) {
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
  const waybarDate = now.toLocaleDateString("es-PY", { weekday: "short", day: "2-digit", month: "short" });

  return (
    <div className="fede">
      <header className="fede-bar">
        <nav className="fede-bar-left" aria-label="Workspaces">
          <Link className="fede-back" to="/team">← equipo</Link>
          {WORKSPACES.map((ws) => (
            <button
              key={ws.id}
              type="button"
              className="fede-ws-btn"
              aria-pressed={workspace === ws.id}
              onClick={() => goTo(ws.id)}
            >
              {ws.id} {ws.name}
            </button>
          ))}
        </nav>
        <p className="fede-bar-title">{WINDOW_TITLES[focus]}</p>
        <p className="fede-bar-right">
          <span className="fede-mod">hyprland</span>
          <span className="fede-mod">{waybarDate}</span>
          <span className="fede-mod fede-clock">{clock}</span>
        </p>
      </header>

      {workspace === 1 && (
        <div className="fede-ws fede-ws-1">
          <Win id="term" title={WINDOW_TITLES.term} focus={focus} onHover={hover} register={register}>
            <div className="fede-term-main">
              <Starship command="fastfetch" highlight />
              <div className="fede-fetch">
                <pre className="fede-logo" aria-hidden="true">{GARUDA_LOGO}</pre>
                <div className="fede-info">
                  <p className="fede-fetch-head">
                    <span className="fede-green">fede</span>@<span className="fede-green">{HOST}</span>
                  </p>
                  <p className="fede-rule" aria-hidden="true">--------------------</p>
                  <dl>
                    {FETCH.map(([key, value]) => (
                      <div key={key}>
                        <dt>{key}:</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="fede-ansi" aria-hidden="true">
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
            <ol className="fede-lines">
              <li><span className="fede-h">{`# ${member.name}`}</span></li>
              <li />
              {member.role && <li>{member.role} del CSLUA</li>}
              {member.semester && member.degree && (
                <li>Alumno del {member.semester} semestre de {member.degree}.</li>
              )}
              <li />
              <li><span className="fede-h">## Qué es esto</span></li>
              <li>
                Lo que estás viendo es, grosso modo, como yo uso mi computadora todos los días. Parte de la personalidad de uno se plasma en su entorno donde pasa la mayor parte del tiempo, y eso habla más de uno mismo de lo que se podría pensar en un primer momento. Una buena porción de la motivación viene dada por un entorno lindo, agradable y cómodo, y este es el mío.
              </li>
              <li />
              <li><span className="fede-h">## Por qué el club</span></li>
              <li>
                Llegado cierto punto noté una contradicción importante: gran parte de la informática tal y como la conocemos se basa en proyectos o herramientas libres; sin embargo, a nivel académico prácticamente no se hace mención de ellas, y no había ningún motivo aparente por el cual hacerlas de lado. El CSLUA cubre (o intenta cubrir) ese hueco.
              </li>
              <li />
            </ol>
            <p className="fede-statusline">
              <span className="fede-mode">NORMAL</span> about.md
            </p>
          </Win>

          <Win id="palette" title={WINDOW_TITLES.palette} focus={focus} onHover={hover} register={register}>
            <Swatches />
            <p className="fede-statusline">
              <span className="fede-mode">NORMAL</span> colors.lua
            </p>
          </Win>
        </div>
      )}

      {workspace === 2 && (
        <div className={`fede-ws fede-ws-2${hardware.length > 0 && peripherals.length > 0 ? " fede-ws-2-split" : ""}`}>
          <Win id="links" title={WINDOW_TITLES.links} focus={focus} onHover={hover} register={register}>
            <div className="fede-term-main">
              <Starship command="ls -l ~/links" highlight />
              {links.length > 0 ? (
                <ul className="fede-ls">
                  {links.map(([key, url]) => (
                    <li key={key}>
                      <span className="fede-perm">lrwxrwxrwx</span>{" "}
                      <a href={url} target="_blank" rel="noopener noreferrer">{LINK_LABELS[key]}</a>
                      <span className="fede-arrow"> → {url.replace(/^https?:\/\/(www\.)?/, "")}</span>
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
            <div className="fede-term-main fede-media-main">
              <Starship command="kitten icat selfie.png" highlight />
              <img className="fede-media-img" src={selfie} alt="Foto de Fede Barrios" />
              <Starship command="" cursor="hollow" />
            </div>
          </Win>

          {hardware.length > 0 && (
            <KeyValueWin id="hardware" heading="Hardware" file="hardware.md" rows={hardware} focus={focus} onHover={hover} register={register} />
          )}

          {peripherals.length > 0 && (
            <KeyValueWin id="peripherals" heading="Periféricos" file="peripherals.md" rows={peripherals} focus={focus} onHover={hover} register={register} />
          )}
        </div>
      )}

      <footer className="fede-status">
        <span className="fede-mode">{workspace}</span>
        <span>fede.jsx</span>
        {typing && <span className="fede-insert">-- INSERT --</span>}
        <span className="fede-status-right">
          <span>{typing ? "esc: salir" : focus === "term" ? "i: escribir" : "hjkl: mover"}</span>
          <span>1-{WORKSPACES.length}: workspace</span>
          <a href={LICENSE.url} target="_blank" rel="noopener noreferrer">{LICENSE.name}</a>
          {SOURCE_URL && (
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">código fuente</a>
          )}
          <a href={AUTHOR.url} target="_blank" rel="noopener noreferrer">{AUTHOR.name}</a>
        </span>
      </footer>
    </div>
  );
}
