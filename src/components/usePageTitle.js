import { useEffect } from "react";

const BASE = "CSLUA · Club de Software Libre";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · CSLUA` : BASE;
  }, [title]);
}
