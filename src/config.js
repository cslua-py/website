export const EMAIL = "clubdesoftwarelibre@gmail.com";

// Official sign-up form (Art. 14 of the bylaws).
// While empty, the join button opens an email to the club instead.
export const JOIN_FORM_URL = "https://forms.gle/4vNJv9Qx4FTQhSeJ7";

// Community group link (WhatsApp/Telegram/Discord). Empty = not shown.
export const COMMUNITY_URL = "https://chat.whatsapp.com/D2v1tBN5niC2f48bzl6TBC";

export const BYLAWS_URL = `${import.meta.env.BASE_URL}docs/cslua-bylaws.pdf`;

export const NAV = [
  { to: "/about", label: "Quiénes somos" },
  { to: "/team", label: "Equipo" },
  { to: "/join", label: "Afiliarse" },
  { to: "/bylaws", label: "Reglamento" },
  { to: "/contact", label: "Contacto" },
];
