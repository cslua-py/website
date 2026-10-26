// Validates every folder in src/members/ (run by `npm run check:members`, CI and the build).
// A broken member should fail here, with a clear message, instead of reaching the site.
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { MAX_PHOTO_BYTES, PHOTO_EXTENSIONS, validateMember } from "../src/data/memberSchema.js";

const MEMBERS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/members");

// Names the site looks for. Matching is case-sensitive on Linux (where the site is built)
// but not on Windows or macOS, so a wrong case would work locally and fail in production.
const SPECIAL_FILES = ["member.js", "Profile.jsx"];

const problems = [];
const report = (slug, message) => problems.push(`  src/members/${slug}: ${message}`);

async function checkMember(slug) {
  const dir = path.join(MEMBERS_DIR, slug);
  const files = readdirSync(dir);

  for (const file of files) {
    const wrongCase = SPECIAL_FILES.find((name) => name.toLowerCase() === file.toLowerCase() && name !== file);
    if (wrongCase) report(slug, `el archivo "${file}" debe llamarse exactamente "${wrongCase}" (mayúsculas incluidas).`);
  }

  const photos = files.filter((file) => /^photo\./i.test(file));
  if (photos.length > 1) report(slug, `hay más de una foto (${photos.join(", ")}); dejá solo una.`);
  for (const photo of photos) {
    const extension = photo.slice(photo.indexOf(".") + 1);
    if (photo.slice(0, 5) !== "photo" || !PHOTO_EXTENSIONS.includes(extension)) {
      report(slug, `la foto "${photo}" debe llamarse photo.${PHOTO_EXTENSIONS.join(" / photo.")} (en minúsculas).`);
    } else if (statSync(path.join(dir, photo)).size > MAX_PHOTO_BYTES) {
      report(slug, `la foto pesa más de ${MAX_PHOTO_BYTES / 1024} kB; achicala o comprimila.`);
    }
  }

  if (!files.includes("member.js")) return report(slug, "falta member.js.");

  let data;
  try {
    ({ default: data } = await import(pathToFileURL(path.join(dir, "member.js")).href));
  } catch (error) {
    return report(slug, `member.js tiene un error de sintaxis: ${error.message}`);
  }
  for (const message of validateMember(slug, data)) report(slug, message);
}

const entries = readdirSync(MEMBERS_DIR, { withFileTypes: true }).filter((entry) => !entry.name.startsWith("_"));
const folders = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
for (const entry of entries) {
  if (!entry.isDirectory()) report("", `"${entry.name}" está suelto: cada integrante va en su propia carpeta.`);
}
for (const slug of folders) await checkMember(slug);

if (problems.length > 0) {
  console.error(`Se encontraron ${problems.length} problema(s) en los integrantes:\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`Integrantes revisados: ${folders.length}, todo en orden.`);
