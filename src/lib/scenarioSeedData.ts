// AUTO-GENERATED real-like seed data for the desk-test Scenario simulator.
// Parsed from live ecometry-tasks-api (most-recently-updated Jobs) on 2026-06-19,
// for the 6 target clients. Used offline by src/lib/scenarioGenerator.ts to fabricate
// internally-consistent Seeds-API scenarios (project → subscription → scrapping option
// → seeds) that surface in the Value Stream Map. Re-pull from live to refresh.

export type RealJob = {
  name: string;            // production Job name, e.g. "ME_GRPM_1d_X00_US - Petsmart US"
  store: string;           // store display name
  country: string;         // ISO-ish country code (upper)
  storeType: string;       // GEOLOC | ...
  extractionType: string;  // MEDIA | DIGITAL_SHELF_PLP | DIGITAL_SHELF_PDP | SEARCH | SHELF | AD
  geolocMode: string;      // MANUAL | AUTOMATIC | VIRTUAL_STORE | NO_GEOLOC
  businessUnit: string;    // DSM | CMI | FSA | RMM | MSH | ""
};

/** key = client slug; value = its most-recent real jobs. */
export const REAL_JOBS: Record<string, RealJob[]> = {
  "groupm": [
    {
      "name": "ME_GRPM_1d_X00_US - Petsmart US",
      "store": "Petsmart US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "CMI"
    },
    {
      "name": "ME_GRPM_1w_X00_UK - Zooplus UK",
      "store": "Zooplus UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "CMI"
    },
    {
      "name": "ME_GRPM_1w_X00_IT - Coop IT",
      "store": "Coop IT",
      "country": "IT",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "CMI"
    },
    {
      "name": "ME_GRPM_1d_X00_US - Instacart US - Publix",
      "store": "Instacart US - Publix",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "AUTOMATIC",
      "businessUnit": "CMI"
    },
    {
      "name": "ME_GRPM_1m_X00_VN - Shopee VN_vn",
      "store": "Shopee VN_vn",
      "country": "VN",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "CMI"
    },
    {
      "name": "ME_GRPM_XX_X00_US - Instacart US - Walmart - SHUT DOWN",
      "store": "Instacart US - Walmart",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "CMI"
    }
  ],
  "coca": [
    {
      "name": "MAG_COCA_BR_Rappi App BR - Turbo",
      "store": "Rappi App BR - Turbo",
      "country": "BR",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_COCA_MX_Rappi APP MX - Oxxo",
      "store": "Rappi APP MX - Oxxo",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_COCA_US_Walmart US",
      "store": "Walmart US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_COCA_FR_Intermarche FR",
      "store": "Intermarche FR",
      "country": "FR",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_COCA_FR_Intermarche FR",
      "store": "Intermarche FR",
      "country": "FR",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_COCA_BR_Big Box Delivery BR",
      "store": "Big Box Delivery BR",
      "country": "BR",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    }
  ],
  "jde": [
    {
      "name": "ME_JDEX_UK_Morrisons UK",
      "store": "Morrisons UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_JDEX_TR_Amazon TR",
      "store": "Amazon TR",
      "country": "TR",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_JDEX_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_JDEX_TR_Trendyol TR - SHUT DOWN",
      "store": "Trendyol TR",
      "country": "TR",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_JDEX_TR_Getir APP TR - SHUT DOWN",
      "store": "Getir APP TR",
      "country": "TR",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_JDEX_TR_Migros TR - SHUT DOWN",
      "store": "Migros TR",
      "country": "TR",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "lego": [
    {
      "name": "AD_LEGO-HIST_DE_Otto DE",
      "store": "Otto DE",
      "country": "DE",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LEGO-HIST_DE_Ideeundspiel DE",
      "store": "Ideeundspiel DE",
      "country": "DE",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LEGO_FR_Auchan FR",
      "store": "Auchan FR",
      "country": "FR",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO_DE_Compravo DE",
      "store": "Compravo DE",
      "country": "DE",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO.TEST_FR_Auchan FR",
      "store": "Auchan FR",
      "country": "FR",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO-HIST_FR_Fnac FR",
      "store": "Fnac FR",
      "country": "FR",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    }
  ],
  "pepsico": [
    {
      "name": "PDP_PEPS_CA_DoorDash CA - Loblaws",
      "store": "DoorDash CA - Loblaws",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_PEPS_CA_Save on Foods CA",
      "store": "Save on Foods CA",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_PEPS_CA_DoorDash CA - Loblaws",
      "store": "DoorDash CA - Loblaws",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_PEPS_CA_Amazon CA",
      "store": "Amazon CA",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "MAG_PEPS_US_Walmart US_Parte 12",
      "store": "Walmart US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_PEPS_US_Target US",
      "store": "Target US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    }
  ],
  "heineken": [
    {
      "name": "PLP_HEIN_MX_Uber Eats MX - 7 Eleven",
      "store": "Uber Eats MX - 7 Eleven",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HEIN_MX_Rappi APP MX - Turbo",
      "store": "Rappi APP MX - Turbo",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_HEIN_MX_Uber Eats MX - 7 Eleven",
      "store": "Uber Eats MX - 7 Eleven",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HEIN_MX_Rappi MX - 7 Eleven",
      "store": "Rappi MX - 7 Eleven",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_HEIN_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_HEIN_MX_Rappi MX - 7 Eleven",
      "store": "Rappi MX - 7 Eleven",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    }
  ]
};

export const CLIENT_LABELS: Record<string, string> = {
  "groupm": "GroupM",
  "coca": "Coca Cola",
  "jde": "JDE",
  "lego": "LEGO",
  "pepsico": "PepsiCo",
  "heineken": "Heineken"
};

export const SCENARIO_CLIENTS = Object.keys(REAL_JOBS);

// Small realistic value pools so fabricated seeds look real per extraction family.
export const KEYWORD_POOL = ["water", "coffee", "cola", "energy drink", "sparkling water", "iced tea", "lego city", "lego technic", "beer", "lager", "pet food", "dog treats"];
export const PRODUCT_POOL = [
  { d: "Coca-Cola Original 12 pack", path: "/dp/B0848P8JKR", cat: "Beverages > Soft Drinks > Soda" },
  { d: "Sprite Zero Sugar 2L", path: "/p/sprite-zero/0004900005525", cat: "Beverages > Soft Drinks > Soda" },
  { d: "Heineken Lager 6x330ml", path: "/dp/B003TEKM0S", cat: "Beverages > Beer > Lager" },
  { d: "LEGO City Police Station", path: "/dp/B0BKFC4M6S", cat: "Toys > Building Sets > City" },
  { d: "Pepsi Max 24 pack", path: "/dp/B07Q9MJKR2", cat: "Beverages > Soft Drinks > Soda" },
  { d: "JDE L'OR Espresso 40 caps", path: "/dp/B07PXG6N5K", cat: "Pantry > Coffee > Capsules" },
];
