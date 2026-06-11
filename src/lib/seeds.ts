import { nowStamp } from "./clients";

export type SeedType = "URL" | "API" | "KEYWORD";
export type KeywordType = "BRANDED" | "CATEGORY";

export const KEYWORD_TYPE_OPTIONS: KeywordType[] = ["BRANDED", "CATEGORY"];

// Field names d/store/cat/c/u are kept for backward compatibility (e.g. the
// Subscriptions seed dropdown reads `.d`). New type-aware fields are optional.
export type Seed = {
  id: string;
  d: string; // description
  store: string;
  cat: string; // category
  c: string; // created at
  u: string; // updated at
  type?: SeedType;
  isQa?: boolean;
  discoveryKey?: string;
  pageType?: string;
  value?: string; // the URL / keyword / API origin, depending on type
  keywordType?: KeywordType; // BRANDED / CATEGORY — only for KEYWORD seeds
};

export const SEEDS_KEY = "seeds-api:seeds";

const BASE_SEEDS: Seed[] = [
  { id: "s1", d: "chocolate", store: "Walmart US", cat: "Pantry > Chocolate > Choco...", c: "2025-04-25, 11:11:33", u: "2025-04-25, 11:11:33", type: "KEYWORD", value: "chocolate", keywordType: "CATEGORY" },
  { id: "s2", d: "water", store: "Amazon US", cat: "Beverages > Waters > Other", c: "2026-06-08, 16:03:09", u: "2026-06-08, 16:03:09", type: "KEYWORD", value: "water", keywordType: "CATEGORY" },
  { id: "s3", d: "coffee", store: "Amazon US", cat: "Pantry > Coffee > Beans", c: "2026-01-30, 13:41:14", u: "2026-01-30, 13:41:14", type: "KEYWORD", value: "coffee", keywordType: "CATEGORY" },
  { id: "s4", d: "Milk", store: "Walmart US", cat: "Pantry > Coffee > Beans", c: "2026-01-30, 13:42:59", u: "2026-06-09, 10:00:00", type: "URL" },
  { id: "s5", d: "sample of keyword", store: "Walmart Mismo Dia MX", cat: "Beauty > Hair Care > Sham...", c: "2026-04-27, 12:43:10", u: "2026-04-27, 12:43:10", type: "KEYWORD", value: "sample of keyword", keywordType: "BRANDED" },
];

// [description, keyword, keyword type, store, category]
const KEYWORD_ROWS: [string, string, KeywordType, string, string][] = [
  ["sprite sem açúcar", "sprite sem açúcar", "BRANDED", "iFood BR - Roldao", "Beverages > Soft Drinks > Soda"],
  ["helado brownie", "helado brownie", "CATEGORY", "El Corte Ingles Supermercado ES", "Fresh and Frozen > Other > Other"],
  ["canada dry", "canada dry", "BRANDED", "Uber Eats MX - Fresko", "Beverages > Beer > Beer"],
  ["del valle fizz naranja", "del valle fizz naranja", "CATEGORY", "Al Super APP MX", "Beverages > Juices > Soda"],
  ["cocacola", "cocacola", "BRANDED", "iFood BR - Barbosa", "Beverages > Soft Drinks > Soda"],
  ["laranja", "laranja", "CATEGORY", "Carrefour ES", "Beauty > Hair Care > Other"],
  ["pelo", "pelo", "CATEGORY", "Rappi App BR - Assaí Atacadista", "Beauty > Hair Care > Other"],
  ["ofertas del valle nectar", "ofertas del valle nectar", "CATEGORY", "Uber Eats MX - Costco", "Beverages > Juices > Other"],
  ["vitamin water", "vitamin water", "CATEGORY", "Rappi APP MX - Farmacias Guadalajara", "Beverages > Waters > Still Water"],
  ["energy drinks rockstar", "chocolate chip granola bar", "CATEGORY", "Uber Eats CA - Walmart", "Beverages > Soft Drinks > Energy Drinks"],
  ["zamek", "zamek", "CATEGORY", "Amazon PL", "Toys and Games > Building Toys > Building Blocks"],
  ["snacks papas fritas", "snacks papas fritas", "CATEGORY", "Jumbo AR", "Pantry > Snacks > Chips"],
  ["guarana tuchaua zero açúcar", "guarana tuchaua zero açúcar", "BRANDED", "Rappi App BR - Turbo", "Beverages > Soft Drinks > Soda"],
  ["cola light", "cola light", "CATEGORY", "Uber Eats App MX - Circle K", "Beverages > Soft Drinks > Soda"],
  ["snackmix", "snackmix", "CATEGORY", "Jumbo APP CL", "Pantry > Snacks > Other"],
  ["leche light leche", "leche light leche", "CATEGORY", "Rappi APP MX - Farmacias Guadalajara", "Fresh and Frozen > Milk > Other"],
  ["candelabros loewe", "candelabros loewe", "BRANDED", "Paco Perfumerias ES", "Beauty > Fragrances > Other"],
  ["fanta zero", "fanta zero", "CATEGORY", "Angeloni BR - Super", "Beverages > Soft Drinks > Soda"],
  ["caja de jugos del valle", "caja de jugos del valle", "BRANDED", "Rappi App MX - Calimax", "Beverages > Juices > Other"],
  ["haarmaske für trockenes haar", "haarmaske für trockenes haar", "CATEGORY", "Hagel Shop DE", "Beauty > Hair Care > Treatments"],
  ["coca-cola light mini", "coca-cola light mini", "CATEGORY", "Rappi APP MX - Circle K", "Beverages > Soft Drinks > Soda"],
  ["balayage shampoo", "balayage shampoo", "CATEGORY", "Sephora UK", "Beauty > Hair Care > Shampoo"],
  ["lata sprite", "lata sprite", "BRANDED", "Uber Eats MX - Soriana", "Beverages > Soft Drinks > Soda"],
  ["prebiotic soda", "diet pepsi 18 pack", "CATEGORY", "Uber Eats CA - 7 Eleven", "Beverages > Soft Drinks > Soda"],
  ["viajes en crucero", "viajes en crucero", "CATEGORY", "Uber Eats MX - 7 Eleven", "Other > Other > Other"],
  ["chocolate postres", "chocolate postres", "CATEGORY", "El Corte Ingles Mascotas ES", "Pantry > Chocolate > Other"],
  ["spindrift", "fruits", "CATEGORY", "Uber Eats APP CA - 7 Eleven", "Beverages > Waters > Sparkling Water"],
  ["mosh nutremas", "mosh nutremas", "CATEGORY", "Walmart GT", "Pantry > Cereals > Other"],
  ["soda antarctida", "soda antarctida", "BRANDED", "iFood BR - Carrefour", "Beverages > Soft Drinks > Soda"],
  ["lechitas", "lechitas", "CATEGORY", "Al Super MX", "Fresh and Frozen > Milk > Other"],
  ["protector solar facial", "protector solar facial", "CATEGORY", "Arenal ES", "Beauty > Personal Care > Sun Protection"],
  ["jugo", "jugo", "CATEGORY", "Uber Eats APP MX - HEB", "Beverages > Juices > Other"],
  ["kabsa mix", "kabsa mix", "CATEGORY", "Hunger Station APP SA", "Pantry > Other > Other"],
  ["mens fragrance set", "mens fragrance set", "CATEGORY", "Harrods UK", "Beauty > Fragrances > Other"],
  ["salsa soya", "salsa soya", "CATEGORY", "HEB MX", "Pantry > Condiments and Sauces > Sauces"],
  ["pienso atopic perros", "pienso atopic perros", "CATEGORY", "Tienda Animal ES", "Pets > Dog > Food"],
  ["diet soda", "diet soda", "CATEGORY", "Sams Club US", "Beverages > Soft Drinks > Soda"],
  ["saladitas", "saladitas", "BRANDED", "Rappi APP MX - 7 Eleven", "Pantry > Snacks > Chips"],
  ["limão", "limão", "BRANDED", "Pao de Acucar BR", "Beverages > Soft Drinks > Soda"],
  ["cerveza ambar", "cerveza ambar", "CATEGORY", "Soriana MX", "Beverages > Beer > Beer"],
  ["lomecan", "lomecan", "BRANDED", "Farmacia San Pablo MX", "Beauty > Intimate Care > Other"],
  ["fuze", "fuze", "BRANDED", "Rappi APP MX - Turbo", "Beverages > Ready-to-drink > Iced Tea"],
  ["fragancia de viaje para hombre", "fragancia de viaje para hombre", "CATEGORY", "Sephora ES", "Beauty > Fragrances > Other"],
  ["brettspiele", "brettspiele", "CATEGORY", "Rofu DE", "Toys and Games > Games and Puzzles > Board Games"],
  ["sabor", "sabor", "CATEGORY", "Bonpreu Esclat ES", "Pantry > Other > Other"],
  ["picnic", "picnic", "CATEGORY", "Uber Eats MX - Fresko", "DIY > Garden > Other"],
  ["mens cologne spray", "mens cologne spray", "CATEGORY", "Net A Porter APP UK", "Beauty > Fragrances > Other"],
  ["danone", "danone", "BRANDED", "Rappi APP MX - Turbo", "Fresh and Frozen > Fresh Food > Other"],
  ["laundry detergent", "laundry detergent", "CATEGORY", "Amazon US", "Home Care and Cleaning > Dish Detergent"],
  ["galleta mamut", "galleta mamut", "CATEGORY", "Walmart GT", "Pantry > Breakfast and Bakery > Biscuits and Cookies"],
  ["caja jugos del valle", "caja jugos del valle", "BRANDED", "Rappi App MX - Calimax", "Beverages > Juices > Other"],
  ["cepillos para el cabello", "cepillos para el cabello", "CATEGORY", "Alkosto CO", "Beauty > Hair Care > Other"],
  ["sidral mundet ciruela", "sidral mundet ciruela", "BRANDED", "Uber Eats MX - Sumesa", "Beverages > Soft Drinks > Soda"],
  ["nectar de manzana del valle", "nectar de manzana del valle", "BRANDED", "Uber Eats MX - Chedraui", "Beverages > Juices > Other"],
  ["ofertas del valle nectar", "ofertas del valle nectar", "BRANDED", "La Comer MX", "Beverages > Juices > Other"],
  ["leche de soja calcio", "leche de soja calcio", "CATEGORY", "Dia ES", "Fresh and Frozen > Milk > Plant-Based Milk"],
  ["del valle fizz naranja", "del valle fizz naranja", "BRANDED", "Walmart Mismo Dia MX", "Beverages > Juices > Other"],
  ["bocaditos", "bocaditos", "CATEGORY", "El Corte Ingles Mascotas ES", "Pantry > Other > Other"],
  ["lego marvel", "lego marvel", "BRANDED", "The Entertainer UK", "Toys and Games > Building Toys > Building Blocks"],
  ["powder foundation", "powder foundation", "CATEGORY", "Sainsburys UK", "Beauty > Other > Other"],
  ["running tips", "running tips", "CATEGORY", "Rappi APP MX - Soriana Hiper", "Other > Yoga and Sports > Other"],
  ["lego disney", "lego disney", "BRANDED", "Otto DE", "Toys and Games > Building Toys > Building Blocks"],
  ["agua sem gás", "água sem gás", "CATEGORY", "iFood BR - Extra", "Beverages > Waters > Still Water"],
  ["pienso humedo perros", "pienso humedo perros", "CATEGORY", "Glovo APP ES - Super Glovo", "Pets > Dog > Food"],
  ["frutas citricas", "frutas citricas", "CATEGORY", "Supermosso BR", "Fresh and Frozen > Milk > Other"],
  ["lechitas", "lechitas", "CATEGORY", "Rappi App MX - Calimax", "Fresh and Frozen > Milk > Other"],
  ["vermu blanco", "vermu blanco", "CATEGORY", "Amazon ES", "Beverages > Wine > Fortified Wine"],
  ["sheba", "sheba", "BRANDED", "Zooplus UK", "Pets > Cat > Food"],
  ["agua mineral", "agua mineral", "BRANDED", "Glovo APP ES - Carrefour", "Beverages > Waters > Still Water"],
  ["alpro natural con avena", "alpro natural con avena", "BRANDED", "Dia ES", "Fresh and Frozen > Yogurt > Plant-Based Yogurt"],
  ["cacao sin azucar", "cacao sin azucar (old)", "CATEGORY", "El Corte Ingles Supermercado ES", "Fresh and Frozen > Other > Other"],
  ["coca cola", "coca cola", "CATEGORY", "PedidosYa APP PE - Market", "Beverages > Soft Drinks > Soda"],
  ["del valle nectar durazno", "del valle nectar durazno", "BRANDED", "Uber Eats APP MX - La Comer", "Beverages > Juices > Other"],
  ["epura", "epura", "BRANDED", "Justo APP MX", "Beverages > Waters > Still Water"],
  ["automobili", "automobili", "CATEGORY", "Amazon IT", "Toys and Games > Other > Other"],
  ["gut health soda", "gut health soda", "CATEGORY", "Sams Club US", "Beverages > Soft Drinks > Soda"],
  ["avengers spielzeug", "avengers spielzeug", "CATEGORY", "Media Markt DE", "Toys and Games > Other > Other"],
  ["Kenzo intense", "Kenzo intense", "BRANDED", "Primor ES", "Beauty > Fragrances > Other"],
  ["caldo natural", "caldo natural", "CATEGORY", "Bonpreu Esclat ES", "Pantry > Soups > Other"],
  ["cacao soluble instantaneo", "cacao soluble instantaneo", "CATEGORY", "Alcampo ES", "Pantry > Breakfast and Bakery > Chocolate"],
  ["agua micelar", "agua micelar", "CATEGORY", "Falabella PE", "Beauty > Personal Care > Face Care"],
  ["pepperoni pizza", "pepperoni pizza", "CATEGORY", "Amazon US", "Fresh and Frozen > Pasta > Other"],
  ["batman", "batman", "BRANDED", "Emag RO", "Toys and Games > Action Figures and Playsets"],
  ["queso tarrina", "queso tarrina", "CATEGORY", "Amazon Fresh ES", "Fresh and Frozen > Cheese > Other"],
  ["torta de pierna", "torta de pierna", "CATEGORY", "Soriana APP MX", "Pantry > Breakfast and Bakery > Wraps"],
  ["ijsthee", "ijsthee", "CATEGORY", "Albert Heijn Web NL", "Beverages > Other > Other"],
  ["pienso gato esterilizado", "pienso gato esterilizado", "CATEGORY", "Amazon ES", "Pets > Cat > Food"],
  ["santa clara deslactosada light", "santa clara deslactosada light", "BRANDED", "Uber Eats MX - Costco", "Fresh and Frozen > Milk > Other"],
  ["mario", "mario", "BRANDED", "Takealot APP ZA", "Toys and Games > Other > Other"],
  ["fresca lata", "fresca lata", "CATEGORY", "Uber Eats MX - Soriana", "Beverages > Other > Other"],
  ["pastilla de caldo", "pastilla de caldo", "CATEGORY", "Drinx ES", "Pantry > Soups > Soup Broth"],
  ["santa clara chopeo", "santa clara chopeo", "BRANDED", "Uber Eats MX - Circle K", "Fresh and Frozen > Milk > Other"],
  ["olla arrocera", "olla arrocera", "CATEGORY", "Mercado Libre MX", "Home and Appliances > Small Appliances > Other"],
  ["agua sem gas", "agua sem gas", "CATEGORY", "Amazon App BR", "Beverages > Waters > Still Water"],
  ["leao", "leao", "BRANDED", "Arco Mix APP BR", "Beverages > Ready-to-drink > Iced Tea"],
  ["cerveza 25cl", "cerveza 25cl", "CATEGORY", "Alcampo ES", "Beverages > Beer > Beer"],
  ["avengers loksaker", "avengers loksaker", "BRANDED", "Toyspace SE", "Toys and Games > Other > Other"],
  ["natural trainer", "natural trainer", "BRANDED", "Amazon IT", "Pets > Dog > Food"],
  ["samochód policyjny", "samochód policyjny", "CATEGORY", "Empik PL", "Toys and Games > Action Figures and Playsets"],
  ["carro electrico", "carro electrico", "CATEGORY", "Mercado Libre MX", "Toys and Games > Youth Electronics > Remote Control"],
];

const KEYWORD_SEEDS: Seed[] = KEYWORD_ROWS.map(([d, keyword, keywordType, store, cat], i) => {
  const day = String((i % 28) + 1).padStart(2, "0");
  const min = String((i * 13) % 60).padStart(2, "0");
  const stamp = `2026-05-${day}, 09:${min}:00`;
  return { id: `k${i + 1}`, d, store, cat, c: stamp, u: stamp, type: "KEYWORD", value: keyword, keywordType };
});

export const INITIAL_SEEDS: Seed[] = [...BASE_SEEDS, ...KEYWORD_SEEDS];

// Label for the type-specific value field.
export function seedValueLabel(type: SeedType): string {
  switch (type) {
    case "URL": return "Url";
    case "API": return "API origin";
    case "KEYWORD": return "Keyword";
  }
}

export function emptySeed(type: SeedType): Seed {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    d: "",
    store: "",
    cat: "",
    c: nowStamp(),
    u: nowStamp(),
    type,
    isQa: false,
    discoveryKey: "",
    pageType: "",
    value: "",
    ...(type === "KEYWORD" ? { keywordType: "CATEGORY" as KeywordType } : {}),
  };
}
