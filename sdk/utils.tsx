import { Section } from "deco/blocks/section.ts";

export function pick<
  T extends object,
  K extends keyof T = keyof T,
>(
  keys: K[],
  obj: T | null | undefined,
): Pick<T, K> {
  if (!obj) {
    return {} as Pick<T, K>;
  }

  const entries = keys.map((key) => [key, obj[key]]);

  return Object.fromEntries(entries);
}

export function omit<T extends object, K extends keyof T>(
  keys: K[],
  obj: T | null | undefined,
): Omit<T, K> {
  if (!obj) {
    return {} as Omit<T, K>;
  }

  const pickedKeys = (Object.keys(obj) as K[]).filter(
    (key) => !keys.includes(key),
  );

  return pick(pickedKeys, obj) as unknown as Omit<T, K>;
}

export function _get(path: string, obj = self, separator = ".") {
  const properties = Array.isArray(path) ? path : path.split(separator);

  return properties.reduce((prev, curr) => prev?.[curr], obj);
}

export function renderSection(section: Section) {
  if (!section) {
    return <></>;
  }

  const { Component, props } = section;

  return <Component {...props} />;
}
