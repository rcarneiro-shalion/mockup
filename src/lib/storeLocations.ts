import { REAL_LOCATION_SETS } from "./locationsBulk";
import { getStores } from "./retailers";

// V1 "Locations" source for the subscription form: the locations that belong to the
// store picked in the form. Real sampled records (locationsBulk) when the store has
// them; otherwise a DETERMINISTIC simulated set (≥5) so every store offers choices.

// Compact per-country city pools for plausible simulated locations. Generic compass
// districts for countries not listed.
const CITY_POOL: Record<string, string[]> = {
  US: ["Tulsa", "Omaha", "Bowling Green", "Austin", "Denver", "Raleigh"],
  MX: ["Guadalajara", "Monterrey", "Puebla", "Tijuana", "Mérida", "León"],
  BR: ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Recife", "Fortaleza"],
  ES: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Bilbao"],
  GB: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Bristol"],
  UK: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Bristol"],
  FR: ["Paris", "Lyon", "Marseille", "Toulouse", "Nantes", "Lille"],
  DE: ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart"],
  IT: ["Milano", "Roma", "Torino", "Napoli", "Bologna", "Firenze"],
  AR: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Salta"],
  CL: ["Santiago", "Valparaíso", "Concepción", "Antofagasta", "Temuco", "Viña del Mar"],
  CO: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga"],
  PE: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Cusco", "Piura"],
  CA: ["Toronto", "Vancouver", "Montréal", "Calgary", "Ottawa", "Edmonton"],
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra"],
  BE: ["Bruxelles", "Antwerpen", "Gent", "Liège", "Charleroi", "Brugge"],
  NL: ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven", "Groningen"],
  PT: ["Lisboa", "Porto", "Braga", "Coimbra", "Faro", "Aveiro"],
  PL: ["Warszawa", "Kraków", "Wrocław", "Poznań", "Gdańsk", "Łódź"],
  CZ: ["Praha", "Brno", "Ostrava", "Plzeň", "Olomouc", "Liberec"],
  SG: ["Orchard", "Jurong East", "Tampines", "Woodlands", "Punggol", "Bedok"],
  MY: ["Kuala Lumpur", "Penang", "Johor Bahru", "Ipoh", "Shah Alam", "Melaka"],
  PH: ["Manila", "Quezon City", "Cebu", "Davao", "Makati", "Pasig"],
  VN: ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Biên Hòa"],
  ZA: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"],
  AE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Al Ain", "Ras Al Khaimah"],
  SA: ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina", "Khobar"],
  CR: ["San José", "Alajuela", "Cartago", "Heredia", "Liberia", "Puntarenas"],
};
const GENERIC_POOL = ["Central", "North", "South", "East", "West", "Metro"];

// Small deterministic hash (djb2) — repo convention: no Math.random in fixtures.
function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Simulated "City - postal" names for a store, ≥5, stable across renders/reloads. */
function simulatedLocationNames(store: string): string[] {
  const country = getStores().find((s) => s.name === store)?.country?.toUpperCase() ?? "";
  const pool = CITY_POOL[country] ?? GENERIC_POOL;
  const h = hash(store);
  return pool.slice(0, 6).map((city, i) => {
    const postal = 10000 + ((h * (i + 7) + i * 131) % 89000);
    return `${city} - ${postal}`;
  });
}

/** Location choices for a store: its real sampled locations, topped up with
 *  simulated ones when fewer than 5 real samples exist. Empty until a store is set. */
export function getStoreLocationNames(store: string): string[] {
  if (!store) return [];
  const real = [
    ...new Set(
      REAL_LOCATION_SETS.filter((s) => s.store === store).flatMap((s) =>
        s.locations.map((l) => l.name),
      ),
    ),
  ];
  if (real.length >= 5) return real;
  const sim = simulatedLocationNames(store).filter((n) => !real.includes(n));
  return [...real, ...sim];
}
