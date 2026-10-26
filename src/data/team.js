// Club members shown on /team.
//
// Each member lives in their own folder, src/members/<slug>/, and is discovered here
// automatically: adding a folder adds a card, and no list needs to be edited. The folder
// holds `member.js` (data), an optional `photo.<ext>` and an optional custom profile page
// (`Profile.jsx`, see src/pages/profiles/index.js). The full guide is CONTRIBUTING.md.
//
// This is the only module that knows where members come from. If they ever move to an
// API (Express + MongoDB), replace the loading below and keep the exports.
import { GROUPS, memberSlugFromPath, normalizeMember, validateMember } from "./memberSchema.js";

export { GROUPS };

// Folders starting with "_" (the template) are skipped.
const dataFiles = import.meta.glob(["../members/*/member.js", "!../members/_*/**"], {
  eager: true,
  import: "default",
});
const photoFiles = import.meta.glob(
  ["../members/*/photo.{jpg,jpeg,png,webp,svg}", "!../members/_*/**"],
  { eager: true, import: "default", query: "?url" },
);

const photos = Object.fromEntries(
  Object.entries(photoFiles).map(([path, url]) => [memberSlugFromPath(path), url]),
);

// Coordinators go in the order of Art. 8 of the bylaws (set with `order`); everyone else
// is sorted by name. Groups keep the order of GROUPS.
const byGroupOrderName = (a, b) =>
  GROUPS.findIndex((g) => g.id === a.group) - GROUPS.findIndex((g) => g.id === b.group) ||
  (a.order ?? Infinity) - (b.order ?? Infinity) ||
  a.name.localeCompare(b.name, "es");

export const TEAM = Object.entries(dataFiles)
  .map(([path, data]) => {
    const slug = memberSlugFromPath(path);
    // `npm run check:members` (CI) rejects invalid members; in dev, report them in the console.
    if (import.meta.env.DEV) {
      for (const problem of validateMember(slug, data)) console.warn(`[members/${slug}] ${problem}`);
    }
    return normalizeMember(slug, data, photos[slug]);
  })
  .sort(byGroupOrderName);

export const getMember = (slug) => TEAM.find((member) => member.slug === slug);
