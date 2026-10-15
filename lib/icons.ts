import type { IconType } from "react-icons";

export type IconMap = Record<string, IconType>;

let fullIconMap: IconMap | null = null;
let fullIconMapPromise: Promise<IconMap> | null = null;

export function loadFullIconMap(): Promise<IconMap> {
  if (fullIconMap) return Promise.resolve(fullIconMap);
  if (!fullIconMapPromise) {
    fullIconMapPromise = Promise.all([
      import("react-icons/fa6"),
      import("react-icons/lu"),
    ]).then(([fa6, lu]) => {
      const map: IconMap = {
        ...(fa6 as unknown as IconMap),
        ...(lu as unknown as IconMap),
      };
      delete map.default;
      fullIconMap = map;
      return map;
    });
  }
  return fullIconMapPromise;
}
