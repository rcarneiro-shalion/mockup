// AUTO-GENERATED real-like seed data for the desk-test Scenario simulator.
// Parsed from live ecometry-tasks-api (most-recently-updated Jobs) on 2026-06-19,
// for 6 + 12 target clients (18 total). Used offline by src/lib/scenarioGenerator.ts to fabricate
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
  ],
  "bimbo": [
    {
      "name": "ME_BIMB_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_BIMB_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_BIMB_ES_Glovo APP ES - Super Glovo",
      "store": "Glovo APP ES - Super Glovo",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_BIMB_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_BIMB_ES_Amazon Fresh ES",
      "store": "Amazon Fresh ES",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_BIMB_ES_Dia ES",
      "store": "Dia ES",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "danone": [
    {
      "name": "ME_DANO_MX_Uber Eats APP MX - Soriana",
      "store": "Uber Eats APP MX - Soriana",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DANO_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_DANO_MX_Rappi APP MX - La Comer",
      "store": "Rappi APP MX - La Comer",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_DANO_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DANO_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_DANO_MX_Bodega Aurrera MX",
      "store": "Bodega Aurrera MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "abinbev": [
    {
      "name": "ME_ABIN_MX_Rappi APP MX - Turbo",
      "store": "Rappi APP MX - Turbo",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_ABIN_MX_HEB MX",
      "store": "HEB MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_ABIN_MX_Mercado Libre MX",
      "store": "Mercado Libre MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_ABIN_MX_Mercado Libre MX",
      "store": "Mercado Libre MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_ABIN_MX_Uber Eats App MX - Parí",
      "store": "Uber Eats APP MX - Parí",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_ABIN_MX_Uber Eats App MX - 7eleven",
      "store": "Uber Eats APP MX - 7 Eleven",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "ferrero": [
    {
      "name": "GEO_FERR_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_FERR_MX_La Comer MX",
      "store": "La Comer MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_FERR_MX_Sams Club MX",
      "store": "Sams Club MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_FERR_MX_HEB MX",
      "store": "HEB MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_FERR_MX_HEB MX",
      "store": "HEB MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    }
  ],
  "perfetti": [
    {
      "name": "ME_PERF_NL_Albert Heijn Web NL",
      "store": "Albert Heijn Web NL",
      "country": "nl",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PERF_US_Amazon US",
      "store": "Amazon US",
      "country": "us",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PERF_CA_Amazon CA",
      "store": "Amazon CA",
      "country": "ca",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PERF_CA_Walmart CA",
      "store": "Walmart CA",
      "country": "ca",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PERF_IT_Amazon IT",
      "store": "Amazon IT",
      "country": "it",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_PERF_CA_Amazon CA - 1P",
      "store": "Amazon CA - 1P",
      "country": "ca",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "deoleo": [
    {
      "name": "ME_DEOL_IT_Carrefour IT",
      "store": "Carrefour IT",
      "country": "it",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DEOL_US_BJs Wholesale Club US",
      "store": "BJs Wholesale Club US",
      "country": "us",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DEOL_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_DEOL_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DEOL_FR_Intermarche FR",
      "store": "Intermarche FR",
      "country": "fr",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DEOL_FR_Intermarche FR",
      "store": "Intermarche FR",
      "country": "fr",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "walmart": [
    {
      "name": "MAT_WALM_US_Walmart US - All - Delivery",
      "store": "Walmart US - All",
      "country": "us",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_WALM_US_Walmart US - All",
      "store": "Walmart US - All",
      "country": "us",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_WALM_US_Walmart US - All - Shipping",
      "store": "Walmart US - All",
      "country": "us",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_WALM_US_Walmart US - Delivery",
      "store": "Walmart US - Delivery",
      "country": "us",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    }
  ],
  "herdez": [
    {
      "name": "SA_HERD_MX_Mercado Libre APP MX",
      "store": "Mercado Libre APP MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_HERD_MX_Rappi APP MX  La Comer",
      "store": "Rappi APP MX - La Comer",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": ""
    },
    {
      "name": "MAT_HERD_MX_Rappi APP MX  Soriana Híper",
      "store": "Rappi APP MX - Soriana Híper",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": ""
    },
    {
      "name": "GEO_HERD_MX_Soriana MX",
      "store": "Soriana MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_HERD_MX_Rappi APP MX Fresko",
      "store": "Rappi APP MX - Fresko",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_HERD_MX_HEB MX",
      "store": "HEB MX",
      "country": "mx",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "samsung": [
    {
      "name": "SA_SAMS_UK_AO UK",
      "store": "AO UK",
      "country": "gb",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_SAMS_UK_O2 UK",
      "store": "O2 UK",
      "country": "gb",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_SAMS_UK_EE UK",
      "store": "EE UK",
      "country": "gb",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_Vodafone UK",
      "store": "Vodafone UK",
      "country": "gb",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_Mobile Phone Direct UK",
      "store": "Mobile Phone Direct UK",
      "country": "gb",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_CPW UK",
      "store": "CPW UK",
      "country": "gb",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "osborne": [
    {
      "name": "ME_OSBO_ES_Glovo Web ES - Super Glovo",
      "store": "Glovo Web ES - Super Glovo",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_OSBO_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_OSBO_ES_Amazon ES",
      "store": "Amazon ES",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_OSBO_ES_El Corte Ingles Gourmet Club ES",
      "store": "El Corte Ingles Gourmet Club ES",
      "country": "es",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_OSBO_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "es",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_OSBO_ES_El Corte Ingles Gourmet Club ES",
      "store": "El Corte Ingles Gourmet Club ES",
      "country": "es",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    }
  ],
  "nestle": [
    {
      "name": "ME_NEST_VN_Shopee APP VN_vn",
      "store": "Shopee APP VN_vn",
      "country": "vn",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_NEST_VN_Lazada APP VN_vn",
      "store": "Lazada APP VN_vn",
      "country": "vn",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "BSL_NEST_AU_Doordash AU - Woolworths",
      "store": "Doordash AU - Woolworths",
      "country": "au",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "MSH"
    },
    {
      "name": "SA_NEST_UK_Amazon UK - Vital Protein BV",
      "store": "Amazon UK - Vital Protein BV",
      "country": "gb",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_NEST_UK_Booker Retail UK",
      "store": "Booker Retail UK",
      "country": "gb",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_NEST_IT_Amazon IT",
      "store": "Amazon IT",
      "country": "it",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "loewe": [
    {
      "name": "SA_LOEW_US_Saks US",
      "store": "Saks US",
      "country": "us",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_LOEW_US_Saks US",
      "store": "Saks US",
      "country": "us",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_LOEW_US_Bloomingdales US",
      "store": "Bloomingdales US",
      "country": "us",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_LOEW_US_Bloomingdales US",
      "store": "Bloomingdales US",
      "country": "us",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_LOEW_UK_Net A Porter APP UK",
      "store": "Net A Porter APP UK",
      "country": "gb",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LOEW_UK_John Lewis UK",
      "store": "John Lewis UK",
      "country": "gb",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
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
  "heineken": "Heineken",
  "bimbo": "Bimbo",
  "danone": "Danone",
  "abinbev": "Ab Inbev",
  "ferrero": "Ferrero",
  "perfetti": "Perfetti Van Melle",
  "deoleo": "Deoleo",
  "walmart": "Walmart",
  "herdez": "Herdez",
  "samsung": "Samsung",
  "osborne": "Osborne",
  "nestle": "Nestlé",
  "loewe": "Loewe"
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

// Real store location sets pulled from backoffice-api (store > locations) on 2026-06-19.
// Used by the simulator to assign a realistic locationSet + location volume to
// geolocated (MANUAL) subscriptions, instead of a flat placeholder count.
export type LocationSet = { name: string; store: string; country: string; count: number; samples: string[] };
export const REAL_LOCATION_SETS: LocationSet[] = [
  { name: "Portillos US - FSA — 206 locations", store: "Portillos US - FSA", country: "US", count: 206, samples: ["Mobile County Health Department Newburn Clinic","White Pond","Ashburnham State Forest","Walker Spring","Township of Vesta"] },
  { name: "GrabFood ID - FSA — 52 locations", store: "GrabFood ID - FSA", country: "ID", count: 52, samples: ["Dukuhan","Kebonpala","Gunung Medasih","Ngepoh","Sipangan Bolon"] },
  { name: "ShopeeFood ID - FSA — 37 locations", store: "ShopeeFood ID - FSA", country: "ID", count: 37, samples: ["Boen","Blayu","Air Lesungriga","Laerias","Desa Lumban Sihite"] },
  { name: "Rappi BR - FSA — 31 locations", store: "Rappi BR - FSA", country: "BR", count: 31, samples: ["Prefeitura Municipal de Maraã","Ilha do Sapo","Sítio Pedregulho","Porto Mapis Novo","Sítio Santa Rosa"] },
  { name: "Maderos BR - FSA — 23 locations", store: "Maderos BR - FSA", country: "BR", count: 23, samples: ["Lajeado Passo dos Índios","Sítio Pedro Rivelino","Igarapé Paraíba","Riacho do Castanho","Pombos"] },
  { name: "GrabFood TH - FSA — 19 locations", store: "GrabFood TH - FSA", country: "TH", count: 19, samples: ["Wat Bua Si","Wat Si Mongkhon","Doi Luk Chang","Wat Buppharam","Ban Don Si Chan"] },
  { name: "iFood BR - FSA — 18 locations", store: "iFood BR - FSA", country: "BR", count: 18, samples: ["Cemitério São Sebastião","Riacho Mato dos Porcos","Setor D Um","Bituba","Anagé"] },
  { name: "ShopeeFood TH - FSA — 17 locations", store: "ShopeeFood TH - FSA", country: "TH", count: 17, samples: ["Ban Muang Charoen Rat","Sima Thani Hotel","Khlong Phangka","Rongrian Ban Nong Kha Khok Kung","Ban Lamnao"] },
  { name: "GrabFood VN - FSA — 16 locations", store: "GrabFood VN - FSA", country: "VN", count: 16, samples: ["Xã Suối Tre","Đặng Xá","Kong R’tam","Xã Lộc Giang","Đại Đồng"] },
  { name: "Rappi PE - FSA — 11 locations", store: "Rappi PE - FSA", country: "PE", count: 11, samples: ["Quebrada Rumihuasi","Altos del Hueco","Lacuyo","Río Araya","Parque Cahuya"] },
  { name: "iFood BR - QCA — 10 locations", store: "iFood BR - QCA", country: "BR", count: 10, samples: ["Arroio Joaquim","Rio da Chacrinha","Ibicuitinga","Chuí","Batalha"] },
  { name: "GrabFood MM - FSA — 9 locations", store: "GrabFood MM - FSA", country: "MM", count: 9, samples: ["Wānmau","Nyaung gon ga lay","Nammākmo","Zaha","Welwin Taung"] },
  { name: "GrabFood PH - FSA — 9 locations", store: "GrabFood PH - FSA", country: "PH", count: 9, samples: ["Guinacot","Madumug Island","Hinukay","Sibalat River","Masukol"] },
  { name: "El Pollo Loco US - FSA — 7 locations", store: "El Pollo Loco US - FSA", country: "US", count: 7, samples: ["Wyandotte","Town of Redfield","Towson","Terrace Park","Town of Oneida"] },
  { name: "Pyszne PL - FSA — 7 locations", store: "Pyszne PL - FSA", country: "PL", count: 7, samples: ["sredzki-hermanow","97-319","pietno","kutnowski-ruszki","warszawa-wola-01-266"] },
  { name: "ShopeeFood MY - FSA — 6 locations", store: "ShopeeFood MY - FSA", country: "MY", count: 6, samples: ["Rumah Masam","Sungai Pandan Pandan","Parit Lapis Betong Nombor Satu","Tanjong Selidang","Kemajuan Tanah Chamek"] },
];

// On-brand keyword pools + default category per client. The live job↔seed relation
// is unavailable (the ecometry-tasks-api seeds endpoint times out on every query),
// so these stand in as realistic, brand-accurate seed samples the generator uses for
// KEYWORD-type subscriptions, tied to the subscription store.
export const CLIENT_KEYWORDS: Record<string, string[]> = {
  groupm: ["pet food","dog food","cat litter","laundry detergent","dishwasher tablets","shampoo","diapers"],
  coca: ["coca cola","coca cola zero","sprite","fanta","fuze tea","powerade","del valle","aquarius"],
  jde: ["l'or espresso","jacobs coffee","tassimo","senseo","douwe egberts","kenco","l'or capsules"],
  lego: ["lego city","lego technic","lego star wars","lego friends","lego marvel","lego harry potter","lego icons"],
  pepsico: ["pepsi","pepsi max","lays","doritos","gatorade","quaker oats","cheetos","7up"],
  heineken: ["heineken","amstel","sol cerveza","tecate","dos equis","desperados","heineken 0.0"],
  bimbo: ["pan bimbo","oroweat","thomas english muffins","sara lee","mantecadas","donas bimbo","pan integral"],
  danone: ["activia","danone","oikos","actimel","alpro","danonino","light and fit"],
  abinbev: ["budweiser","corona extra","stella artois","michelob ultra","bud light","modelo especial"],
  ferrero: ["nutella","kinder bueno","ferrero rocher","tic tac","kinder sorpresa","raffaello","nutella biscuits"],
  perfetti: ["mentos","chupa chups","fruittella","smint","alpenliebe","golia","vivident"],
  deoleo: ["aceite bertolli","carbonell aceite de oliva","koipe","hojiblanca","aceite de oliva virgen extra"],
  walmart: ["great value","equate","mainstays","parents choice","marca walmart"],
  herdez: ["herdez salsa","doña maria mole","embasa","chiles herdez","salsa casera herdez"],
  samsung: ["samsung galaxy s24","samsung tv qled","galaxy buds","samsung galaxy a55","samsung refrigerador","galaxy watch"],
  osborne: ["jamon cinco jotas","brandy carlos i","osborne","veterano","magno brandy"],
  nestle: ["nescafe","kitkat","nespresso","maggi","purina","la lechera","nesquik","cerelac"],
  loewe: ["perfume loewe","solo loewe","aire loewe","loewe 001","bolso loewe"],
};
export const CLIENT_CATEGORY: Record<string, string> = {
  groupm: "Pets > Dog > Food",
  coca: "Beverages > Soft Drinks > Soda",
  jde: "Pantry > Coffee > Capsules",
  lego: "Toys and Games > Building Toys > Building Blocks",
  pepsico: "Beverages > Soft Drinks > Soda",
  heineken: "Beverages > Beer > Beer",
  bimbo: "Pantry > Breakfast and Bakery > Bread",
  danone: "Fresh and Frozen > Yogurt > Other",
  abinbev: "Beverages > Beer > Beer",
  ferrero: "Pantry > Chocolate > Other",
  perfetti: "Pantry > Candy > Candies",
  deoleo: "Pantry > Condiments and Sauces > Oil",
  walmart: "Other > Other > Other",
  herdez: "Pantry > Condiments and Sauces > Sauces",
  samsung: "Home and Appliances > Electronics > Other",
  osborne: "Beverages > Spirits > Brandy",
  nestle: "Pantry > Coffee > Other",
  loewe: "Beauty > Fragrances > Other",
};
