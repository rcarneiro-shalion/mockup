import { readPersistedList } from "./seedOptions";

// ---------------------------------------------------------------------------
// Client SKUs — two related datasets that back the Product › Client SKUs page:
//   • ClientSku        → the "Client skus" tab (one row per SKU definition)
//   • ClientSkuRegion  → the "Client skus by region" tab (SKU × region rows)
// Data is sampled from the Ecometry / Shalion console (Jun 2026).
// ---------------------------------------------------------------------------

export type SkuCode = { type: string; value: string };

export type ClientSku = {
  id: string;
  title: string;
  hero?: boolean;
  codes: SkuCode[];
  client: string;
  brand: string;
  country: string; // ISO-2 country code
  category: string;
  businessUnit?: string;
  clientCategory?: string;
  activeAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ClientSkuRegion = {
  id: string;
  title: string;
  hero?: boolean;
  client: string;
  country: string; // ISO-2
  regionSystem: string;
  region: string;
  businessUnit?: string;
  clientCategory?: string;
  activeFrom?: string;
  createdAt: string;
  updatedAt: string;
};

export const CLIENT_SKUS_KEY = "product:client-skus:v1";
export const CLIENT_SKU_REGIONS_KEY = "product:client-sku-regions:v1";

export const nowStamp = () => new Date().toDateString();

const ean = (v: string): SkuCode => ({ type: "ean", value: v });
const asin = (v: string): SkuCode => ({ type: "asin", value: v });
const sku = (v: string): SkuCode => ({ type: "sku_code", value: v });
const gtin = (v: string): SkuCode => ({ type: "gtin", value: v });

// ---------- "Client skus" tab ------------------------------------------------

export const INITIAL_CLIENT_SKUS: ClientSku[] = [
  {
    id: "csk-1",
    title: "essence Silky BLUR HYDRATING LONGWEAR Foundation",
    codes: [ean("4059729583680"), sku("COSN_DE_4059729583680")],
    client: "Cosnova",
    brand: "Essence Cosmetics",
    country: "DE",
    category: "Beauty > Makeup > Face",
    businessUnit: "New assortment H1 2026",
    clientCategory: "Make-up",
    activeAt: "Wed, Apr 2, 2025",
    createdAt: "Wed, Apr 2, 2025 8:52 AM",
    updatedAt: "Sun, Jun 29, 2025 7:25 PM",
  },
  {
    id: "csk-2",
    title: "Confort Galatee FP200ml",
    codes: [ean("3147758030228"), asin("B000RIF5XM"), sku("LORE_DE_3147758030228")],
    client: "Loreal",
    brand: "Lancôme",
    country: "DE",
    category: "Legacy",
    businessUnit: "LPD",
    clientCategory: "Skin Care",
    createdAt: "Mon, Nov 18, 2024 11:58 AM",
    updatedAt: "Mon, Dec 29, 2025 4:21 PM",
  },
  {
    id: "csk-3",
    title: "Desenfriol D Tabl 12 Mx",
    codes: [ean("7502276040375"), sku("86380927")],
    client: "Bayer",
    brand: "Desenfriol",
    country: "MX",
    category: "Pharma > Health > Cold & Flu",
    businessUnit: "Antigripales",
    clientCategory: "Respiratory",
    createdAt: "Thu, Oct 26, 2023 2:40 PM",
    updatedAt: "Thu, Oct 26, 2023 2:40 PM",
  },
  {
    id: "csk-4",
    title: "Luna Rossa Sport EDT V50ml",
    codes: [ean("3614273544955"), sku("LORE_DE_416197")],
    client: "Loreal",
    brand: "Prada Fragances",
    country: "DE",
    category: "Baby > Bathing and Skin Care",
    businessUnit: "LPD",
    clientCategory: "Fragrance",
    createdAt: "Thu, Oct 26, 2023 3:30 PM",
    updatedAt: "Fri, Oct 27, 2023 8:13 AM",
  },
  {
    id: "csk-5",
    title: "Vichy Capital Soleil Agua Solar Protectora SPF50",
    codes: [ean("3337875695145"), sku("LORE_PT_3337875695145")],
    client: "Loreal",
    brand: "Vichy",
    country: "PT",
    category: "Legacy",
    businessUnit: "ACD",
    clientCategory: "Skincare",
    createdAt: "Thu, Oct 26, 2023 3:29 PM",
    updatedAt: "Fri, Oct 27, 2023 8:12 AM",
  },
  {
    id: "csk-6",
    title: "essence JUICY BOMB shiny lipgloss 103",
    hero: true,
    codes: [ean("4059729394590"), asin("B0B8ZFMWRM"), sku("COSN_DE_4059729394590")],
    client: "Cosnova",
    brand: "Essence Cosmetics",
    country: "DE",
    category: "Beauty > Makeup > Lips",
    businessUnit: "Lips",
    clientCategory: "Lipgloss",
    createdAt: "Mon, Oct 23, 2023 9:23 AM",
    updatedAt: "Fri, Oct 27, 2023 8:13 AM",
  },
  {
    id: "csk-7",
    title: 'MASTERS OF THE UNIVERSE Zodak 5.5" Origins',
    codes: [ean("887961934175"), asin("B08J4J6GZL"), sku("GVW66")],
    client: "Mattel",
    brand: "Mattel - Masters of the Universe",
    country: "MX",
    category: "Toys and Games > Action Figures",
    clientCategory: "Figura de Acción",
    activeAt: "Sat, Mar 1, 2025",
    createdAt: "Wed, Oct 25, 2023 3:47 PM",
    updatedAt: "Thu, Oct 26, 2023 3:28 PM",
  },
  {
    id: "csk-8",
    title: 'MASTERS OF THE UNIVERSE Ninjor 5.5" Origins',
    codes: [ean("887961934151"), sku("GVW66")],
    client: "Mattel",
    brand: "Mattel - Masters of the Universe",
    country: "CL",
    category: "Toys and Games > Action Figures",
    clientCategory: "Figura de Acción",
    activeAt: "Fri, Feb 14, 2025",
    createdAt: "Thu, Oct 26, 2023 2:39 PM",
    updatedAt: "Fri, Oct 27, 2023 8:12 AM",
  },
  {
    id: "csk-9",
    title: "essence maximum DEFINITION mascara 01",
    codes: [ean("4250035268678"), sku("COSNO_DK_4250035268678")],
    client: "Cosnova",
    brand: "Essence Cosmetics",
    country: "DK",
    category: "Beauty > Makeup > Eyes",
    businessUnit: "Eyes",
    clientCategory: "Mascara",
    createdAt: "Thu, Oct 26, 2023 3:29 PM",
    updatedAt: "Thu, Oct 26, 2023 3:29 PM",
  },
  {
    id: "csk-10",
    title: "RK EXTR PLAY SAFE 450 200ML V805",
    codes: [ean("884486415233"), gtin("96481"), sku("LORE_CH_454503")],
    client: "Loreal",
    brand: "Redken",
    country: "CH",
    category: "Legacy",
    businessUnit: "PPD",
    createdAt: "Thu, Oct 26, 2023 3:30 PM",
    updatedAt: "Thu, Oct 26, 2023 3:30 PM",
  },
  {
    id: "csk-11",
    title: "4935421607391 MIRACLE CUSHION REFILL",
    codes: [ean("4935421607391"), sku("LORE_CH_489266")],
    client: "Loreal",
    brand: "Lancôme",
    country: "CH",
    category: "Legacy",
    businessUnit: "LPD",
    clientCategory: "Skin Care",
    createdAt: "Thu, Oct 26, 2023 2:39 PM",
    updatedAt: "Fri, Oct 27, 2023 8:12 AM",
  },
  {
    id: "csk-12",
    title: "Catrice Pure False Lash Mascara 010",
    codes: [ean("4059729398598"), sku("COSNO_DK_4059729398598")],
    client: "Cosnova",
    brand: "Catrice",
    country: "DK",
    category: "Beauty > Makeup > Eyes",
    businessUnit: "Eyes",
    clientCategory: "Mascara",
    createdAt: "Thu, Oct 26, 2023 3:31 PM",
    updatedAt: "Thu, Oct 26, 2023 3:31 PM",
  },
  {
    id: "csk-13",
    title: "Mentos Gum Pure Fresh Sugar Free Bottle",
    hero: true,
    codes: [ean("00073390014049"), asin("B007W45AGG"), sku("PERF_US_00073390014049")],
    client: "Perfetti",
    brand: "Mentos Gum",
    country: "US",
    category: "Pantry > Candy > Chewing Gum",
    clientCategory: "Gum",
    activeAt: "Wed, Jan 8, 2025",
    createdAt: "Wed, Jan 8, 2025 3:30 PM",
    updatedAt: "Fri, Apr 17, 2026 9:52 AM",
  },
  {
    id: "csk-14",
    title: "COSME DECORTE コスメデコルテ サンシェルター マルチ プロテクション",
    codes: [sku("no_sku_78")],
    client: "GroupM - PNDG",
    brand: "Decorté",
    country: "JP",
    category: "Beauty > Personal Care",
    activeAt: "Sat, May 10, 2025",
    createdAt: "Fri, Apr 17, 2026 9:16 AM",
    updatedAt: "Thu, May 21, 2026 4:00 PM",
  },
  {
    id: "csk-15",
    title: "Lanzador Nerf Minecraft Stormlander - Mattel",
    codes: [ean("195166151335"), sku("F4416")],
    client: "Hasbro",
    brand: "Nerf",
    country: "PE",
    category: "Legacy",
    businessUnit: "Nerf",
    clientCategory: "Lanzadores",
    createdAt: "Fri, May 29, 2026 2:18 PM",
    updatedAt: "Fri, May 29, 2026 2:18 PM",
  },
  {
    id: "csk-16",
    title: "VICHY AQUALIA THER CREM.LEICHTE 50ML",
    codes: [ean("4020962360794"), sku("LORE_DE_454503")],
    client: "Loreal",
    brand: "Vichy",
    country: "DE",
    category: "Legacy",
    businessUnit: "LDB",
    clientCategory: "Skin Care",
    createdAt: "Thu, May 9, 2024 7:50 AM",
    updatedAt: "Mon, Feb 2, 2026 6:20 PM",
  },
];

// ---------- "Client skus by region" tab -------------------------------------

const R = (
  id: string,
  title: string,
  country: string,
  regionSystem: string,
  region: string,
  businessUnit: string | undefined,
  clientCategory: string | undefined,
  activeFrom: string | undefined,
  createdAt: string,
  updatedAt: string,
  hero = false,
): ClientSkuRegion => ({
  id,
  title,
  hero,
  client: "Coca Cola",
  country,
  regionSystem,
  region,
  businessUnit,
  clientCategory,
  activeFrom,
  createdAt,
  updatedAt,
});

export const INITIAL_CLIENT_SKU_REGIONS: ClientSkuRegion[] = [
  R("csr-1", "Água Saborizada Crystal Sabores com Gás Frutas Vermelhas 1,5L", "BR", "BR - Coke Bottlers", "Uberlandia BR", "Frutas Vermelhas", "STILLS - Packaged Water", undefined, "Wed, May 21, 2025 8:52 AM", "Sun, Jun 29, 2025 7:25 PM"),
  R("csr-2", "BEBIDAS SPRITE ZERO 3.0 L", "CL", "CL - Coke Bottlers", "Andina CL", undefined, undefined, undefined, "Wed, May 21, 2025 9:06 AM", "Sun, Jun 29, 2025 8:00 PM"),
  R("csr-3", "Drink Pronto Schweppes Mixed Maracujá Vodka 269ml", "BR", "BR - Coke Bottlers", "Uberlandia BR", "Maracujá Vodka Fusion", "ARTD", undefined, "Wed, May 21, 2025 9:05 AM", "Sun, Jun 29, 2025 7:07 PM"),
  R("csr-4", "Bebida Gaseosa Pack COCA-COLA ORIGINAL 400ml x6", "EC", "EC - Coke Bottlers", "Arca EC", undefined, undefined, undefined, "Wed, May 21, 2025 9:06 AM", "Wed, Mar 25, 2026 12:37 PM"),
  R("csr-5", "FLASHLYTE REGULAR COCO-LIMÓN BOTELLA 500ML", "MX", "MX - Coke Bottlers", "FEMSA MX", undefined, undefined, undefined, "Wed, May 21, 2025 9:10 AM", "Sun, Jun 29, 2025 7:54 PM"),
  R("csr-6", "AGUA NATURAL CIEL 600ML", "MX", "MX - Coke Bottlers", "FEMSA MX", undefined, undefined, undefined, "Wed, May 21, 2025 9:10 AM", "Sun, Jun 29, 2025 7:34 PM"),
  R("csr-7", "Coca-Cola Bacardí 355 Mililiter", "MX", "MX - Coke Bottlers", "Bepensa MX", undefined, undefined, undefined, "Tue, May 20, 2025 1:30 PM", "Mon, Jun 9, 2025 9:00 AM"),
  R("csr-8", "Agua Saborizada Brisa Con Gas Maracuyá 600ml", "CO", "CO - Coke Bottlers", "FEMSA CO", undefined, undefined, "Fri, May 2, 2025", "Tue, May 20, 2025 2:18 PM", "Fri, May 2, 2025 1:34 PM"),
  R("csr-9", "COCA COLA COLA 2LT PET RET 9PK", "MX", "MX - Coke Bottlers", "FEMSA MX", undefined, undefined, undefined, "Tue, May 20, 2025 2:09 PM", "Thu, Apr 30, 2025 2:20 PM"),
  R("csr-10", "SCHWEPPES GINGER ALE 1.5 L", "PE", "PE - Coke Bottlers", "Arca PE", undefined, undefined, undefined, "Tue, May 20, 2025 1:53 PM", "Thu, Apr 30, 2025 2:20 PM"),
  R("csr-11", "Santa Clara 27 Pack Leche Entera 180 ml c/u", "MX", "MX - Coke Bottlers", "FEMSA MX", undefined, undefined, undefined, "Mon, May 19, 2025 3:30 PM", "Fri, Jul 19, 2024 12:41 PM"),
  R("csr-12", "Refrigerante Uva Fanta Lata 350ml", "BR", "BR - Coke Bottlers", "Andina BR", "SSD", "Flavors", undefined, "Mon, May 19, 2025 2:00 PM", "Fri, Jun 5, 2026 9:48 AM"),
  R("csr-13", "Refrigerante Coca-Cola Original Garrafa 3l PET", "BR", "BR - Coke Bottlers", "Sorocaba BR", "SSD", "Cola", "Wed, Jan 8, 2025", "Mon, May 19, 2025 9:20 AM", "Wed, Jan 8, 2025 3:00 PM", true),
  R("csr-14", "DEL VALLE PET BEBIDA SABOR MANZANA 1.5L", "MX", "MX - Coke Bottlers", "Rica MX", undefined, undefined, undefined, "Thu, May 15, 2025 3:50 PM", "Fri, Jun 5, 2026 3:50 PM"),
  R("csr-15", "REFRESCO COCA-COLA ORIGINAL 355ML LATA", "MX", "MX - Coke Bottlers", "Rica MX", undefined, undefined, undefined, "Tue, Apr 14, 2025 1:29 PM", "Wed, May 13, 2026 7:00 PM"),
  R("csr-16", "Jugo Del Valle Frugos Manzana 1.45Lt x1", "PE", "PE - Coke Bottlers", "Arca PE", undefined, undefined, undefined, "Tue, Apr 28, 2025 9:20 AM", "Tue, May 26, 2026 2:00 PM"),
  R("csr-17", "REFRESCO SIDRAL MUNDET MANZANA LATA 355ML", "MX", "MX - Coke Bottlers", "CDF MX", undefined, undefined, undefined, "Thu, Apr 30, 2025 1:50 PM", "Fri, Jun 5, 2026 3:50 PM"),
];

// ---------- Getters ----------------------------------------------------------

export function getClientSkus(): ClientSku[] {
  const list = readPersistedList<ClientSku>(CLIENT_SKUS_KEY);
  return list.length ? list : INITIAL_CLIENT_SKUS;
}

export function getClientSkuRegions(): ClientSkuRegion[] {
  const list = readPersistedList<ClientSkuRegion>(CLIENT_SKU_REGIONS_KEY);
  return list.length ? list : INITIAL_CLIENT_SKU_REGIONS;
}

/** Display totals shown in the paginators (sampled rows are a small subset). */
export const CLIENT_SKUS_TOTAL = 92601;
export const CLIENT_SKU_REGIONS_TOTAL = 6153;
