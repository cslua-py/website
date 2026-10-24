import { lazy } from "react";

// Members with a fully custom profile page, keyed by slug. A custom page is its own
// component with its own stylesheet, and it replaces the whole site chrome (menu and
// footer): each one is a little world. Members not listed here get DefaultProfile.
// Pages are lazy-loaded so they only cost anything when somebody visits them.
//
// Convention: each custom profile lives in its own folder, profiles/<slug>/, with its
// component, stylesheet and any assets inside (see fede/). Prefix the CSS classes with the
// slug (.fede-*) since stylesheets are global. profiles/ itself only holds shared code.
export const PROFILES = {
  fede: lazy(() => import("./fede/FedeProfile.jsx")),
  pablo: lazy(() => import("./pablo/PabloProfile.jsx")),
};

export const hasCustomProfile = (slug) => Object.hasOwn(PROFILES, slug);
