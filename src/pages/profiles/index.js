import { lazy } from "react";
import { memberSlugFromPath } from "../../data/memberSchema.js";

// Members with a fully custom profile page: any src/members/<slug>/Profile.jsx is picked
// up automatically, with no registration needed. A custom page is its own component with
// its own stylesheet, and it replaces the whole site chrome (menu and footer): each one is
// a little world. Members without one get DefaultProfile.
// Pages are lazy-loaded so they only cost anything when somebody visits them.
//
// Prefix the CSS classes with the slug (.fede-*) since stylesheets are global.
const loaders = import.meta.glob(["../../members/*/Profile.jsx", "!../../members/_*/**"]);

export const PROFILES = Object.fromEntries(
  Object.entries(loaders).map(([path, load]) => [memberSlugFromPath(path), lazy(load)]),
);

export const hasCustomProfile = (slug) => Object.hasOwn(PROFILES, slug);
