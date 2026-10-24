export const EMAIL = "clubdesoftwarelibre@gmail.com";

// Official sign-up form (Art. 14 of the bylaws).
// While empty, the join button opens an email to the club instead.
export const JOIN_FORM_URL = "https://forms.gle/4vNJv9Qx4FTQhSeJ7";

// Community group link (WhatsApp/Telegram/Discord). Empty = not shown.
export const COMMUNITY_URL = "https://chat.whatsapp.com/D2v1tBN5niC2f48bzl6TBC";

// Source code repository. The AGPL (section 13) requires offering the source to users
// who interact with the site over a network, so the footer links here.
export const SOURCE_URL = "https://github.com/CSLUA-py/website";

// Instagram URL. Empty = not shown.
export const INSTAGRAM_URL = "https://www.instagram.com/csluaoficial/";

export const LICENSE = {
  name: "AGPL-3.0",
  url: `${SOURCE_URL}/blob/main/LICENSE`,
};

export const AUTHOR = {
  name: "Fede Barrios",
  url: "https://fedebarriosd.com",
};

export const BYLAWS_URL = `${import.meta.env.BASE_URL}docs/cslua-bylaws.pdf`;

export const NAV = [
  { to: "/about", label: "Quiénes somos" },
  { to: "/team", label: "Equipo" },
  { to: "/join", label: "Afiliarse" },
  { to: "/bylaws", label: "Reglamento" },
  { to: "/contact", label: "Contacto" },
];
