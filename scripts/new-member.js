// Creates src/members/<slug>/ from src/members/_template/.
// Usage: npm run new-member -- <slug> [--custom]
//   --custom  also copies a starter Profile.jsx and profile.css for a fully custom page.
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SLUG_PATTERN } from "../src/data/memberSchema.js";

const MEMBERS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/members");
const [slug, ...flags] = process.argv.slice(2);
const custom = flags.includes("--custom");

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

if (!slug || slug.startsWith("-")) fail("Uso: npm run new-member -- <slug> [--custom]\nEjemplo: npm run new-member -- ana-gomez");
if (!SLUG_PATTERN.test(slug) || slug.startsWith("_")) {
  fail(`"${slug}" no es un nombre válido. Usá minúsculas, números y guiones (ej: ana-gomez). Será la dirección /team/${slug}.`);
}
if (flags.some((flag) => flag !== "--custom")) fail(`Opción desconocida: ${flags.join(" ")}`);

const target = path.join(MEMBERS_DIR, slug);
if (existsSync(target)) fail(`Ya existe src/members/${slug}/. Si es tu carpeta, editá los archivos que ya tiene.`);

const files = ["member.js", ...(custom ? ["Profile.jsx", "profile.css"] : [])];
for (const file of files) {
  const destination = path.join(target, file);
  cpSync(path.join(MEMBERS_DIR, "_template", file), destination, { recursive: true });
  writeFileSync(destination, readFileSync(destination, "utf8").replaceAll("__SLUG__", slug));
}

console.log(`Listo: se creó src/members/${slug}/ con ${files.join(", ")}.

Siguientes pasos:
  1. Editá src/members/${slug}/member.js con tus datos.
  2. (Opcional) Agregá tu foto como src/members/${slug}/photo.jpg (cuadrada, menos de 300 kB).
  3. Mirá cómo queda con \`npm run dev\`: tu tarjeta aparece en /team y tu perfil en /team/${slug}.
  4. Antes de subir tus cambios, corré \`npm run check:members\` y \`npm run lint\`.`);
