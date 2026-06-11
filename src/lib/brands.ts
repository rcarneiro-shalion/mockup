import { readPersistedList } from "./seedOptions";

// ---------------------------------------------------------------------------
// Brands (Codification). Modelled on the production codification-api Brand:
//   name (required, unique), default category (required), default manufacturer
//   (required), optional parent brand, isWhiteLabel, isMultiBrand. Multi-brand
//   brands can have editions; a brand can't be deleted while anything uses it.
// ---------------------------------------------------------------------------

export type BrandEdition = {
  id: string;
  name: string;
  category: string;
  createdAt: string;
};

export type Brand = {
  id: string;
  name: string;
  defaultCategory: string;
  defaultManufacturer: string;
  parent?: string; // parent brand name
  isWhiteLabel: boolean;
  isMultiBrand: boolean;
  editions?: BrandEdition[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};

export const BRANDS_KEY = "codification:brands:v1";

export const MANUFACTURERS = [
  "The Coca-Cola Company",
  "PepsiCo",
  "Nestlé",
  "L'Oréal",
  "Cosnova",
  "Mattel",
  "Hasbro",
  "Bayer",
  "Perfetti Van Melle",
  "Kosé",
];

export const BRAND_CATEGORIES = [
  "Beverages > Soft Drinks > Soda",
  "Beverages > Water",
  "Beauty > Makeup > Face",
  "Beauty > Makeup > Lips",
  "Beauty > Makeup > Eyes",
  "Beauty > Skin Care",
  "Hair Care",
  "Fragrance",
  "Toys and Games > Action Figures",
  "Pharma > Health > Cold & Flu",
  "Pantry > Candy > Chewing Gum",
];

const ed = (id: string, name: string, category: string, createdAt: string): BrandEdition => ({
  id,
  name,
  category,
  createdAt,
});

const B = (
  id: string,
  name: string,
  defaultCategory: string,
  defaultManufacturer: string,
  parent: string | undefined,
  isWhiteLabel: boolean,
  isMultiBrand: boolean,
  createdAt: string,
  updatedAt: string,
  editions?: BrandEdition[],
): Brand => ({
  id,
  name,
  defaultCategory,
  defaultManufacturer,
  parent,
  isWhiteLabel,
  isMultiBrand,
  editions,
  createdAt,
  updatedAt,
  createdBy: "ecometry@shalion.com",
  updatedBy: "ecometry@shalion.com",
});

export const INITIAL_BRANDS: Brand[] = [
  B("br-coca", "Coca-Cola", "Beverages > Soft Drinks > Soda", "The Coca-Cola Company", undefined, false, true,
    "Thu, Mar 7, 2024 11:15 AM", "Fri, Jun 5, 2026 9:26 AM", [
      ed("be-1", "Coca-Cola Original", "Beverages > Soft Drinks > Soda", "Thu, Mar 7, 2024 11:20 AM"),
      ed("be-2", "Coca-Cola Zero", "Beverages > Soft Drinks > Soda", "Thu, Mar 7, 2024 11:22 AM"),
      ed("be-3", "Coca-Cola Cherry", "Beverages > Soft Drinks > Soda", "Tue, Jun 2, 2026 7:01 AM"),
    ]),
  B("br-coca-light", "Coca-Cola Light", "Beverages > Soft Drinks > Soda", "The Coca-Cola Company", "Coca-Cola", false, false,
    "Thu, Mar 7, 2024 11:18 AM", "Mon, Jun 1, 2026 12:01 PM"),
  B("br-fanta", "Fanta", "Beverages > Soft Drinks > Soda", "The Coca-Cola Company", undefined, false, false,
    "Thu, Mar 7, 2024 11:25 AM", "Thu, May 21, 2026 4:00 PM"),
  B("br-sprite", "Sprite", "Beverages > Soft Drinks > Soda", "The Coca-Cola Company", undefined, false, false,
    "Thu, Mar 7, 2024 11:30 AM", "Tue, May 26, 2026 2:00 PM"),
  B("br-schweppes", "Schweppes", "Beverages > Soft Drinks > Soda", "The Coca-Cola Company", undefined, false, false,
    "Fri, Apr 17, 2026 9:16 AM", "Fri, Jun 5, 2026 3:50 PM"),
  B("br-essence", "Essence Cosmetics", "Beauty > Makeup > Face", "Cosnova", undefined, false, true,
    "Mon, Nov 18, 2024 11:58 AM", "Sun, Jun 29, 2025 7:25 PM", [
      ed("be-4", "Essence Spring Collection", "Beauty > Makeup > Face", "Wed, Apr 2, 2025 8:52 AM"),
      ed("be-5", "Essence Holiday Edition", "Beauty > Makeup > Lips", "Mon, Nov 18, 2024 12:10 PM"),
    ]),
  B("br-catrice", "Catrice", "Beauty > Makeup > Eyes", "Cosnova", undefined, false, false,
    "Thu, Oct 26, 2023 3:31 PM", "Thu, Oct 26, 2023 3:31 PM"),
  B("br-lancome", "Lancôme", "Beauty > Skin Care", "L'Oréal", undefined, false, false,
    "Mon, Nov 13, 2023 7:00 AM", "Mon, Dec 29, 2025 4:21 PM"),
  B("br-vichy", "Vichy", "Beauty > Skin Care", "L'Oréal", undefined, false, false,
    "Mon, Nov 13, 2023 7:00 AM", "Fri, Oct 27, 2023 8:12 AM"),
  B("br-redken", "Redken", "Hair Care", "L'Oréal", undefined, false, false,
    "Thu, Oct 26, 2023 3:30 PM", "Thu, Oct 26, 2023 3:30 PM"),
  B("br-prada", "Prada Fragances", "Fragrance", "L'Oréal", undefined, false, false,
    "Thu, Oct 26, 2023 3:30 PM", "Fri, Oct 27, 2023 8:13 AM"),
  B("br-mentos", "Mentos Gum", "Pantry > Candy > Chewing Gum", "Perfetti Van Melle", undefined, false, false,
    "Wed, Jan 8, 2025 3:30 PM", "Fri, Apr 17, 2026 9:52 AM"),
  B("br-motu", "Mattel - Masters of the Universe", "Toys and Games > Action Figures", "Mattel", undefined, false, false,
    "Wed, Oct 25, 2023 3:47 PM", "Thu, Oct 26, 2023 3:28 PM"),
  B("br-nerf", "Nerf", "Toys and Games > Action Figures", "Hasbro", undefined, false, false,
    "Fri, May 29, 2026 2:18 PM", "Fri, May 29, 2026 2:18 PM"),
  B("br-desenfriol", "Desenfriol", "Pharma > Health > Cold & Flu", "Bayer", undefined, false, false,
    "Thu, Oct 26, 2023 2:40 PM", "Thu, Oct 26, 2023 2:40 PM"),
  B("br-decorte", "Decorté", "Beauty > Skin Care", "Kosé", undefined, false, false,
    "Fri, Apr 17, 2026 9:16 AM", "Thu, May 21, 2026 4:00 PM"),
  B("br-selecta", "Selecta", "Beverages > Soft Drinks > Soda", "The Coca-Cola Company", undefined, true, false,
    "Tue, Dec 10, 2024 1:58 PM", "Tue, Dec 10, 2024 1:58 PM"),
];

// Vary the audit users for realism (mirrors the console's mix of editors).
const USER_BY_ID: Record<string, string> = {
  "br-decorte": "dmolini@shalion.com",
  "br-nerf": "mflores@shalion.com",
  "br-selecta": "alarco@shalion.com",
  "br-prada": "dmolini@shalion.com",
  "br-mentos": "mflores@shalion.com",
};
for (const b of INITIAL_BRANDS) {
  const u = USER_BY_ID[b.id];
  if (u) {
    b.createdBy = u;
    b.updatedBy = u;
  }
}

/** Display totals for the paginator (sampled rows are a small subset). */
export const BRANDS_TOTAL = 247204;
export const BRANDS_PAGES = 2473;

export function getBrands(): Brand[] {
  const list = readPersistedList<Brand>(BRANDS_KEY);
  return list.length ? list : INITIAL_BRANDS;
}

export function emptyBrand(): Brand {
  const stamp = new Date().toDateString();
  return {
    id: crypto.randomUUID(),
    name: "",
    defaultCategory: "",
    defaultManufacturer: "",
    parent: undefined,
    isWhiteLabel: false,
    isMultiBrand: false,
    editions: [],
    createdAt: stamp,
    updatedAt: stamp,
  };
}
