// Club members shown on /team. Coordinators come first, in the order of Art. 8 of
// the bylaws, then collaborators.
//
// - `group` is "coordinators" or "collaborators" and decides the /team section.
// - `slug` is the URL segment: /team/<slug>.
// - `role` is the committee position; collaborators have none (`null`), the
//   "Colaboradores" section already says what they are.
// - `degree` and `semester` are shown under the role as
//   "Alumno del <semester> semestre de <degree>".
// - `null` means "not provided yet": the profile hides that field.
// - To add a photo, drop the image in public/team/ and set `photo` to its file name.
// - `links` accepts any of: github, website, linkedin, dotfiles (full URLs).
// - `theme` (optional) overrides the site's CSS variables on that member's profile
//   page only. Available variables: --ink, --ink-soft, --amber, --amber-deep,
//   --on-amber, --paper, --paper-alt, --card, --line.
//   Profile pages use the sans-serif font; the rest of the site is serif.
export const TEAM = [
  {
    slug: "fede",
    group: "coordinators",
    name: "Fede Barrios",
    role: "Coordinador General",
    photo: null,
    degree: "Ingeniería en Informática",
    semester: "noveno",
    distro: "Garuda Linux",
    desktop: "Hyprland",
    editor: null,
    terminal: null,
    hardware: null,
    peripherals: null,
    links: {
      github: null,
      website: "https://fedebarriosd.com",
      linkedin: null,
      dotfiles: null,
    },
    // Gruvbox dark
    theme: {
      "--ink": "#ebdbb2",
      "--ink-soft": "#a89984",
      "--amber": "#fabd2f",
      "--amber-deep": "#fe8019",
      "--on-amber": "#282828",
      "--paper": "#282828",
      "--paper-alt": "#32302f",
      "--card": "#3c3836",
      "--line": "#504945",
    },
  },
  {
    slug: "benjamin",
    group: "coordinators",
    name: "Benjamín Esteche",
    role: "Secretario",
    photo: null,
    degree: null,
    semester: null,
    distro: "Fedora",
    desktop: null,
    editor: null,
    terminal: null,
    hardware: null,
    peripherals: null,
    links: { github: null, website: null, linkedin: null, dotfiles: null },
    theme: null,
  },
  {
    slug: "pablo",
    group: "coordinators",
    name: "Pablo Ayala",
    role: "Coordinador Técnico",
    photo: null,
    degree: "Ingeniería en Informática",
    semester: "noveno",
    distro: "Ubuntu",
    desktop: null,
    editor: null,
    terminal: null,
    hardware: null,
    peripherals: null,
    links: { github: null, website: null, linkedin: null, dotfiles: null },
    theme: null,
  },
  {
    slug: "ruben",
    group: "coordinators",
    name: "Rubén Báez",
    role: "Coordinador de Proyectos",
    photo: null,
    degree: null,
    semester: null,
    distro: null,
    desktop: null,
    editor: null,
    terminal: null,
    hardware: null,
    peripherals: null,
    links: { github: null, website: null, linkedin: null, dotfiles: null },
    theme: null,
  },
  {
    slug: "jacky",
    group: "collaborators",
    name: "Jacky Sosa",
    role: null,
    photo: null,
    degree: null,
    semester: null,
    distro: null,
    desktop: null,
    editor: null,
    terminal: null,
    hardware: null,
    peripherals: null,
    links: { github: null, website: null, linkedin: null, dotfiles: null },
    theme: null,
  },
];

export const GROUPS = [
  { id: "coordinators", title: "Coordinadores" },
  { id: "collaborators", title: "Colaboradores" },
];

export const getMember = (slug) => TEAM.find((member) => member.slug === slug);
