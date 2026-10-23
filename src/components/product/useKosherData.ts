import { useEffect, useState } from "react";

export type KosherData = typeof import("../../data/kosherFeatures");

/** Loads the generated kosher.com data on demand, so it stays out of the page bundles. */
export function useKosherData(): KosherData | null {
  const [data, setData] = useState<KosherData | null>(null);
  useEffect(() => {
    let active = true;
    import("../../data/kosherFeatures")
      .then((module) => {
        if (active) setData(module);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);
  return data;
}

