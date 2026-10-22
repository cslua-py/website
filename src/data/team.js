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
// - To add a photo or avatar (JPG, PNG, WebP or SVG), drop it in public/team/ and set
//   `photo` to its file name.
// - `links` accepts any of: github, website, linkedin, instagram, dotfiles (full URLs).
// - Custom profile pages (own component + stylesheet) are registered in
//   src/pages/profiles/index.js; everyone else gets DefaultProfile.
// - `theme` (optional, DefaultProfile only) overrides the site's CSS variables on that member's profile
//   page only. Available variables: --ink, --ink-soft, --amber, --amber-deep,
//   --on-amber, --paper, --paper-alt, --card, --line.
//   Profile pages use the sans-serif font; the rest of the site is serif.
export const TEAM = [
  {
    slug: "fede",
    group: "coordinators",
    name: "Fede Barrios",
    role: "Coordinador General",
    photo: "fede.svg",
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
      instagram: null,
      dotfiles: null,
    },
    theme: null,
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
    links: { github: null, website: null, linkedin: null, instagram: null, dotfiles: null },
    theme: null,
  },
  {
    slug: "pablo",
    group: "coordinators",
    name: "Pablo Ayala",
    role: "Coordinador Técnico",
    photo: "pablo.jpg",
    degree: "Ingeniería en Informática",
    semester: "noveno",
    distro: "Ubuntu + Windows 11",
    desktop: "GNOME",
    editor: null,
    terminal: null,
    hardware: "Intel Core i7 (11.ª gen), 24 GB de RAM, RTX 3050 Ti",
    peripherals: null,
    links: {
      github: "https://github.com/Edgar-Ayala",
      website: null,
      linkedin: "https://www.linkedin.com/in/edgar-pablo-ayala-lerea",
      instagram: "https://www.instagram.com/pablo_ayala001/",
      dotfiles: null,
    },
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
    links: { github: null, website: null, linkedin: null, instagram: null, dotfiles: null },
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
    links: { github: null, website: null, linkedin: null, instagram: null, dotfiles: null },
    theme: null,
  },
];

export const GROUPS = [
  { id: "coordinators", title: "Coordinadores" },
  { id: "collaborators", title: "Colaboradores" },
];

export const getMember = (slug) => TEAM.find((member) => member.slug === slug);
