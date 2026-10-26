// Shape of a team member and the rules their data must follow.
//
// Pure JavaScript with no Vite features, so both the site (src/data/team.js) and the
// Node scripts (scripts/check-members.js) can import it. If the members ever move to a
// database, this is the schema to translate into a Mongoose model.

export const GROUPS = [
  { id: "coordinators", title: "Coordinadores" },
  { id: "collaborators", title: "Colaboradores" },
];

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const PHOTO_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"];
export const MAX_PHOTO_BYTES = 300 * 1024;
export const PLACEHOLDER_NAME = "Tu nombre completo";

const TEXT_FIELDS = ["degree", "semester", "distro", "desktop", "editor", "terminal"];
const KEY_VALUE_FIELDS = ["hardware", "peripherals"];
export const LINK_KEYS = ["github", "website", "linkedin", "instagram", "dotfiles"];
export const THEME_VARS = [
  "--ink",
  "--ink-soft",
  "--amber",
  "--amber-deep",
  "--on-amber",
  "--paper",
  "--paper-alt",
  "--card",
  "--line",
  "--edge",
];
export const MEMBER_FIELDS = [
  "name",
  "group",
  "role",
  "order",
  ...TEXT_FIELDS,
  ...KEY_VALUE_FIELDS,
  "links",
  "theme",
];

const COLOR_PATTERN = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([^;{}]*\))$/i;

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isText = (value) => typeof value === "string" && value.trim() !== "";
const isMissing = (value) => value === undefined || value === null;

// The folder name (src/members/<slug>/) is the slug, so it cannot disagree with the URL.
export const memberSlugFromPath = (path) => path.split("/").at(-2);

// Returns a list of human-readable problems (empty when the member is valid).
export function validateMember(slug, data) {
  const errors = [];
  const bad = (message) => errors.push(message);

  if (!SLUG_PATTERN.test(slug)) {
    bad(`El nombre de la carpeta "${slug}" debe ir en minúsculas, con letras, números y guiones (ej: ana-gomez).`);
  }
  if (!isObject(data)) {
    return [...errors, "member.js debe exportar un objeto con `export default { ... }`."];
  }

  for (const key of Object.keys(data)) {
    if (!MEMBER_FIELDS.includes(key)) {
      bad(`Campo desconocido "${key}". Los válidos son: ${MEMBER_FIELDS.join(", ")}.`);
    }
  }

  if (!isText(data.name)) bad("`name` es obligatorio.");
  else if (data.name === PLACEHOLDER_NAME) bad("`name` todavía tiene el texto de ejemplo.");

  const groupIds = GROUPS.map((group) => group.id);
  if (!groupIds.includes(data.group)) {
    bad(`\`group\` debe ser uno de: ${groupIds.map((id) => `"${id}"`).join(", ")}.`);
  } else if (data.group === "coordinators" && !isText(data.role)) {
    bad("Los coordinadores necesitan `role` (ej: \"Secretario\").");
  } else if (data.group === "collaborators" && !isMissing(data.role)) {
    bad("Los colaboradores no llevan `role`: quitalo o ponelo en null.");
  }

  if (!isMissing(data.order) && typeof data.order !== "number") bad("`order` debe ser un número.");

  for (const key of TEXT_FIELDS) {
    if (!isMissing(data[key]) && !isText(data[key])) bad(`\`${key}\` debe ser un texto (o null).`);
  }
  if (isText(data.semester) !== isText(data.degree)) {
    bad("`semester` y `degree` van juntos: se muestran como \"Alumno del <semester> semestre de <degree>\".");
  }

  for (const key of KEY_VALUE_FIELDS) {
    const value = data[key];
    if (isMissing(value) || isText(value)) continue;
    const valid = isObject(value) && Object.values(value).every(isText);
    if (!valid) bad(`\`${key}\` debe ser un texto o un objeto { Etiqueta: "valor" } sin valores vacíos.`);
  }

  if (!isMissing(data.links)) {
    if (!isObject(data.links)) {
      bad("`links` debe ser un objeto.");
    } else {
      for (const [key, url] of Object.entries(data.links)) {
        if (!LINK_KEYS.includes(key)) bad(`Enlace desconocido "${key}". Los válidos son: ${LINK_KEYS.join(", ")}.`);
        else if (!isMissing(url) && !(isText(url) && url.startsWith("https://"))) {
          bad(`El enlace "${key}" debe ser null o una URL completa que empiece con https://`);
        }
      }
    }
  }

  if (!isMissing(data.theme)) {
    if (!isObject(data.theme)) {
      bad("`theme` debe ser un objeto o null.");
    } else {
      for (const [key, color] of Object.entries(data.theme)) {
        if (!THEME_VARS.includes(key)) bad(`Variable de tema desconocida "${key}". Las válidas son: ${THEME_VARS.join(", ")}.`);
        else if (!(isText(color) && COLOR_PATTERN.test(color.trim()))) {
          bad(`El color de "${key}" debe ser #hex, rgb() o hsl().`);
        }
      }
    }
  }

  return errors;
}

// Fills in the optional fields so the rest of the site always sees the same shape.
export function normalizeMember(slug, data, photo) {
  const member = { slug, photo: photo ?? null, order: data.order ?? null, role: data.role ?? null };
  for (const key of [...TEXT_FIELDS, ...KEY_VALUE_FIELDS, "theme"]) member[key] = data[key] ?? null;
  return { ...member, name: data.name, group: data.group, links: { ...data.links } };
}
