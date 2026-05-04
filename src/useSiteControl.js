import { useEffect, useState } from "react";
import { defaultControlState, mergeControlState } from "./controlDefaults";

let cachedControlState = null;

export function useSiteControl(siteKey) {
  const [controlState, setControlState] = useState(
    cachedControlState || defaultControlState,
  );

  useEffect(() => {
    let alive = true;

    async function loadControlState() {
      if (cachedControlState) return;

      try {
        const response = await fetch(`/site-control.json?ts=${Date.now()}`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const remoteState = await response.json();
        const mergedState = mergeControlState(defaultControlState, remoteState);
        cachedControlState = mergedState;
        if (alive) setControlState(mergedState);
      } catch {
        // The bundled defaults keep the public site stable if control JSON is unavailable.
      }
    }

    loadControlState();
    return () => {
      alive = false;
    };
  }, []);

  return controlState[siteKey] || defaultControlState[siteKey];
}
