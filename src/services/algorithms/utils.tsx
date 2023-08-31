import Papa from "papaparse";

export async function parseCsv<T>(fileLocation: string) {
  return fetch(fileLocation)
    .then((res) => res.text())
    .then((data) => Papa.parse<T>(data, { header: true }).data);
}

export function computeIfAbsent<K, V>(
  map: Map<K, V>,
  key: K,
  defaultValue: V
): V {
  const value = map.get(key) ?? defaultValue;
  if (!map.has(key)) {
    map.set(key, value);
  }
  return value;
}
