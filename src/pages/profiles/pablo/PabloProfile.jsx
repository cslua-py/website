import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { LICENSE, SOURCE_URL } from "../../../config.js";
import { UBUNTU_LOGO } from "./ubuntu-logo.js";
import { EXTENSIONS } from "./extensions.js";
import tuxWave from "./tux.svg";
import catBomb from "./cat-bomb.svg";
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

// The 16 terminal colors (Nord-like, to match the Graphite theme).
const ANSI_NAMES = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
const ANSI_NORMAL = ["#3c3c3c", "#bf616a", "#a3be8c", "#ebcb8b", "#81a1c1", "#b48ead", "#88c0d0", "#e5e9f0"];
const ANSI_BRIGHT = ["#4c566a", "#d08770", "#b5d19c", "#f0d399", "#8fb3d6", "#c8a0c0", "#8fd3d6", "#eceff4"];
const ANSI_GROUPS = [
  { label: "normal", colors: ANSI_NORMAL, offset: 0 },
  { label: "bright", colors: ANSI_BRIGHT, offset: 8 },
];

const WORKSPACES = [
  { id: 1, name: "inicio", firstWindow: "term" },
  { id: 2, name: "setup", firstWindow: "links" },
];

const WINDOW_TITLES = {
  term: `${USER}@${HOST}: ~`,
  about: "Acerca de",
  palette: "Paleta de colores",
  links: `${USER}@${HOST}: ~/links`,
  hardware: "Hardware",
  peripherals: "Periféricos",
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

function Win({ id, focus, onHover, children }) {
  const title = WINDOW_TITLES[id];
  return (
    <section
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

// A window listing label/value rows, e.g. hardware and peripherals.
function KeyValueWin({ id, rows, ...win }) {
  return (
    <Win id={id} {...win}>
      <dl className="pablo-rows" style={keyColumn(rows)}>
        {rows.map(([key, value]) => (
          <div key={key}>
            <dt className="pablo-key">{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </Win>
  );
}

const MAX_HISTORY = 200;
const MAX_LINE = 300;

// Starship prompt in the home directory: user@host in ~, then lambda and the command line.
// `output` is what the command printed. `children` goes after the command (the blinking cursor of the last prompt, for instance).
function Starship({ command = "", output = null, children }) {
  return (
    <div className="pablo-starship">
      <p>
        <span className="pablo-green">╭─</span> <span className="pablo-yellow">{USER}@{HOST}</span> in{" "}
        <span className="pablo-purple">~</span> took 0s
      </p>
      <p>
        <span className="pablo-green">╰ λ</span> <span className="pablo-typed">{command}</span>
        {children}
      </p>
      {output && <pre className="pablo-output">{output}</pre>}
    </div>
  );
}

function Swatches() {
  return (
    <div className="pablo-palette-groups">
      {ANSI_GROUPS.map(({ label, colors, offset }) => (
        <div key={label}>
          <p className="pablo-comment">{label} ({offset}-{offset + 7})</p>
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

// Easter eggs, triggered by commands typed in the terminal: a bare `cowsay` brings Tux, who waves,
// and a fork bomb brings an exploding cat. Both are SVG drawings (the waving is animated in the SVG).
function EggDialog({ egg, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const isTux = egg === "tux";
  return (
    <div className="pablo-tux-backdrop" onClick={onClose}>
      <div
        className="pablo-tux"
        role="dialog"
        aria-label={isTux ? "Tux" : "Fork bomb"}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pablo-headerbar">
          <span className="pablo-headerbar-title">{isTux ? "tux@1985: ~" : "bash: fork: Resource temporarily unavailable"}</span>
          <button type="button" className="pablo-tux-close" aria-label="Cerrar" onClick={onClose}>✕</button>
        </div>
        <div className="pablo-tux-body">
          {isTux ? (
            <>
              <img className="pablo-egg-art" src={tuxWave} alt="Tux waving" />
              <p>Hi! I&apos;m Tux, you found my hideout!</p>
            </>
          ) : (
            <>
              <img className="pablo-egg-art pablo-bomb-art" src={catBomb} alt="An exploding cat" />
              <p>You made a fork bomb!</p>
              <p className="pablo-comment">{":(){ :|:& };:"} copied itself until the poor cat blew up.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const COW = String.raw`        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||`;
const COW_WIDTH = 40;

// Word-wraps `text` to `width` columns, breaking words that are longer than a line.
function wrap(text, width) {
  const lines = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    let rest = word;
    while (rest.length > width) {
      if (current) lines.push(current);
      lines.push(rest.slice(0, width));
      rest = rest.slice(width);
      current = "";
    }
    if (current && current.length + 1 + rest.length > width) {
      lines.push(current);
      current = rest;
    } else {
      current = current ? `${current} ${rest}` : rest;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// What `cowsay "text"` prints: the speech bubble, then the cow.
function cowsay(text) {
  const lines = wrap(text, COW_WIDTH);
  const width = Math.max(...lines.map((line) => line.length));
  const pad = (line) => line.padEnd(width);
  const body =
    lines.length === 1
      ? [`< ${pad(lines[0])} >`]
      : lines.map((line, i) => {
          const [left, right] = i === 0 ? ["/", "\\"] : i === lines.length - 1 ? ["\\", "/"] : ["|", "|"];
          return `${left} ${pad(line)} ${right}`;
        });
  return [` ${"_".repeat(width + 2)}`, ...body, ` ${"-".repeat(width + 2)}`, COW].join("\n");
}

// What a command line does: nothing, print something, or open an easter egg. A bare `cowsay`
// brings Tux and the fork bomb (matched ignoring spaces) brings an exploding cat.
function run(line) {
  const command = line.trim();
  if (command.replace(/\s+/g, "") === ":(){:|:&};:") return { egg: "bomb" };
  const cow = command.match(/^cowsay(?:\s+(.*))?$/);
  if (!cow) return {};
  const args = (cow[1] ?? "").trim();
  const text = args.replace(/^(["'])(.*)\1$/, "$2").trim();
  // A bare `cowsay` (nothing to say) brings Tux instead.
  return text ? { output: cowsay(text) } : { egg: "tux" };
}

export default function PabloProfile({ member }) {
  const [workspace, setWorkspace] = useState(1);
  const [focus, setFocus] = useState("term");
  const [egg, setEgg] = useState(null);
  const [history, setHistory] = useState([]);
  const [draft, setDraft] = useState("");
  const terminalEnd = useRef(null);
  // Position in the command history while walking it with the arrows (null = the line being typed).
  const recall = useRef(null);
  const saved = useRef("");
  const now = useClock();
  const typing = workspace === 1 && focus === "term" && !egg;

  const links = Object.entries(member.links).filter(([, url]) => url);
  const hardware = rowsOf(member.hardware);
  const peripherals = rowsOf(member.peripherals);

  const goTo = (id) => {
    const target = WORKSPACES.find((ws) => ws.id === id);
    if (!target) return;
    setWorkspace(target.id);
    setFocus(target.firstWindow);
  };

  // Left/right arrows switch workspace, like swiping between desktops.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.isComposing) return;
      if (event.key === "ArrowLeft" && workspace > 1) {
        event.preventDefault();
        goTo(workspace - 1);
      } else if (event.key === "ArrowRight" && workspace < WORKSPACES.length) {
        event.preventDefault();
        goTo(workspace + 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Typing in the terminal: characters just appear, nothing is executed (only the easter egg commands do something).
  // Up/down walk through the earlier commands, Shift+C copies and Shift+V pastes.
  useEffect(() => {
    if (!typing) return undefined;
    const typeText = (text) => {
      recall.current = null;
      setDraft((d) => (d + text.replace(/[\r\n]+/g, " ")).slice(0, MAX_LINE));
    };
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
      const target = event.target;
      // Let Enter/Space activate a focused link or button.
      if (target instanceof HTMLElement && target.closest("a, button") && (event.key === "Enter" || event.key === " ")) {
        return;
      }
      const commands = history.map((entry) => entry.command).filter((line) => line.trim());
      if (event.shiftKey && event.key === "C") {
        event.preventDefault();
        // Copy the selected text if there is any, otherwise the line being typed.
        const text = window.getSelection()?.toString() || draft;
        if (text) navigator.clipboard?.writeText(text).catch(() => {});
      } else if (event.shiftKey && event.key === "V") {
        event.preventDefault();
        navigator.clipboard?.readText().then(typeText).catch(() => {});
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (commands.length === 0) return;
        if (recall.current === null) {
          saved.current = draft;
          recall.current = commands.length - 1;
        } else {
          recall.current = Math.max(0, recall.current - 1);
        }
        setDraft(commands[recall.current]);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (recall.current === null) return;
        if (recall.current + 1 >= commands.length) {
          recall.current = null;
          setDraft(saved.current);
        } else {
          recall.current += 1;
          setDraft(commands[recall.current]);
        }
      } else if (event.key === "Backspace") {
        event.preventDefault();
        recall.current = null;
        setDraft((d) => d.slice(0, -1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        recall.current = null;
        {
          const { egg: found = null, output = null } = run(draft);
          setEgg(found);
          setHistory((h) => [...h, { command: draft, output }].slice(-MAX_HISTORY));
        }
        setDraft("");
      } else if (event.key.length === 1) {
        event.preventDefault();
        typeText(event.key);
      }
    };
    const onPaste = (event) => {
      event.preventDefault();
      typeText(event.clipboardData?.getData("text") ?? "");
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("paste", onPaste);
    };
  }, [typing, draft, history]);

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
          <span className="pablo-ws-tabs">
            {WORKSPACES.map((ws) => (
              <button
                key={ws.id}
                type="button"
                className="pablo-ws-btn"
                aria-pressed={workspace === ws.id}
                onClick={() => goTo(ws.id)}
              >
                {ws.id} {ws.name}
              </button>
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
          <Win id="term" focus={focus} onHover={setFocus}>
            <div className="pablo-term-main">
              <Starship command="fastfetch" />
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
              {history.map((entry, i) => (
                <Starship key={i} command={entry.command} output={entry.output} />
              ))}
              <Starship command={draft}>
                <span className={`pablo-cursor${typing ? "" : " pablo-cursor-hollow"}`} aria-hidden="true" />
              </Starship>
              <span ref={terminalEnd} />
            </div>
          </Win>

          <Win id="about" focus={focus} onHover={setFocus}>
            <article className="pablo-about-text">
              <h2>{member.name}</h2>
              {member.role && <p>{member.role} del CSLUA</p>}
              {member.semester && member.degree && (
                <p>Alumno del {member.semester} semestre de {member.degree}.</p>
              )}
              <h3>Qué es esto</h3>
              <p>
                Así se ve mi escritorio de todos los días: Ubuntu con GNOME, el tema Graphite en tonos nord y una terminal con Starship. Lo que ves es mi entorno real, copiado de mi propia máquina, con ropa de los años 80.
              </p>
              <h3>Mi setup</h3>
              <p>
                Uso Ubuntu junto con Windows 11, sobre una ASUS TUF Dash F15. Los datos de la terminal son una captura de mi fastfetch.
              </p>
            </article>
          </Win>

          <Win id="palette" focus={focus} onHover={setFocus}>
            <Swatches />
          </Win>
        </div>
      )}

      {workspace === 2 && (
        <div className={`pablo-ws pablo-ws-2${hardware.length > 0 && peripherals.length > 0 ? " pablo-ws-2-split" : ""}`}>
          <Win id="links" focus={focus} onHover={setFocus}>
            <div className="pablo-term-main">
              <Starship command="ls -l ~/links" />
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
            </div>
          </Win>

          <Win id="extensions" focus={focus} onHover={setFocus}>
            <Extensions />
          </Win>

          {hardware.length > 0 && (
            <KeyValueWin id="hardware" rows={hardware} focus={focus} onHover={setFocus} />
          )}

          {peripherals.length > 0 && (
            <KeyValueWin id="peripherals" rows={peripherals} focus={focus} onHover={setFocus} />
          )}
        </div>
      )}

      <footer className="pablo-status">
        <span className="pablo-mode">{workspace}/{WORKSPACES.length}</span>
        <span className="pablo-status-right">
          <span>←/→: workspace</span>
          <span>↑/↓: historial</span>
          <span>Shift+C/V: copiar/pegar</span>
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

      {egg && <EggDialog egg={egg} onClose={() => setEgg(null)} />}
    </div>
  );
}
