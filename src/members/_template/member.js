// Your card on /team and your standard profile page. Guide: CONTRIBUTING.md.
//
// Only `name` and `group` are required. Delete or leave as null whatever you don't want
// to show: empty fields are simply hidden. A photo is optional: drop a square image next
// to this file named photo.jpg (or .png, .webp, .svg), under 300 kB.
export default {
  name: "Tu nombre completo",
  group: "collaborators", // "coordinators" is assigned by the club's committee

  // Shown as "Alumno del <semester> semestre de <degree>"; set both or neither.
  degree: null, // "Ingeniería en Informática"
  semester: null, // "tercer"

  distro: null,
  desktop: null, // desktop environment or window manager
  editor: null,
  terminal: null,

  // Plain text, or an object of label -> value (quote labels that contain spaces).
  hardware: null, // { Laptop: "Lenovo ThinkPad T14", "Memoria RAM": "16 GB" }
  peripherals: null, // { Teclado: "...", Mouse: "..." }

  // Full URLs starting with https://, or null.
  links: {
    github: null,
    website: null,
    linkedin: null,
    instagram: null,
    dotfiles: null,
  },

  // Optional colors for the standard profile page only (it is ignored if you build your own
  // Profile.jsx). Allowed variables: --ink, --ink-soft, --amber, --amber-deep, --on-amber,
  // --paper, --paper-alt, --card, --line, --edge. Values: #hex, rgb() or hsl().
  theme: null, // { "--paper": "#1e1e2e", "--ink": "#cdd6f4", "--card": "#313244" }
};
