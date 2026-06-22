// AUTO-GENERATED from live ecometry-tasks-api /v1.0/admin/jobs on 2026-06-22.
// Up to 30 real jobs per curated client, diversified across extraction types + stores
// (ACTIVE preferred). key = client slug. Re-run /tmp/gen_live.py to refresh.
import type { RealJob } from "./scenarioSeedData";

export const REAL_JOBS_BULK: Record<string, RealJob[]> = {
  "coca": [
    {
      "name": "AD_COCA_NI_Walmart NI",
      "store": "Walmart NI",
      "country": "NI",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_COCA_BR_Nordestao BR",
      "store": "Nordestao BR",
      "country": "BR",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAG_COCA_EC_Tipti EC - Megamaxi",
      "store": "Tipti EC - Megamaxi",
      "country": "EC",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_COCA_CO_Cencosud Tiendas Jumbo CO",
      "store": "Cencosud Tiendas Jumbo CO",
      "country": "CO",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_COCA_PE_Metro PE",
      "store": "Metro PE",
      "country": "PE",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_COCA_BR_Comercial Zaffari BR",
      "store": "Comercial Zaffari BR",
      "country": "BR",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_COCA_PE_Rappi App PE - La Cesta",
      "store": "Rappi App PE - La Cesta",
      "country": "PE",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_COCA_MX_Bodega Aurrera MX",
      "store": "Bodega Aurrera MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_COCA_BR_iFood BR - Savegnago",
      "store": "iFood BR - Savegnago",
      "country": "BR",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_COCA_CR_Automercado APP CR",
      "store": "Automercado APP CR",
      "country": "CR",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_COCA_PE_Rappi App PE - Wong",
      "store": "Rappi APP PE - Wong",
      "country": "PE",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_COCA_PA_El Fuerte PA",
      "store": "El Fuerte PA",
      "country": "PA",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_COCA_PE_Plaza Vea PE",
      "store": "Plaza Vea PE",
      "country": "PE",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_COCA_BR_Supernosso Em Casa BR",
      "store": "Supernosso Em Casa BR",
      "country": "BR",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_COCA_MX_Rappi App MX - Chedraui",
      "store": "Rappi APP MX - Chedraui",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_COCA_UY_Tata UY",
      "store": "Tata UY",
      "country": "UY",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_COCA_MX_Ley MX",
      "store": "Ley MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_COCA_CL_Spid App CL",
      "store": "Spid App CL",
      "country": "CL",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_COCA_MX_Uber Eats APP MX - La Comer",
      "store": "Uber Eats APP MX - La Comer",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_COCA_BR_Daki BR",
      "store": "Daki BR",
      "country": "BR",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_COCA_CL_Rappi APP CL - Turbo",
      "store": "Rappi APP CL - Turbo",
      "country": "CL",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_COCA_PE_Metro PE",
      "store": "Metro PE",
      "country": "PE",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_COCA_CL_Rappi APP CL - Turbo\n",
      "store": "Rappi APP CL - Turbo",
      "country": "CL",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_COCA_BR_Super VI BR",
      "store": "Super VI BR",
      "country": "BR",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_COCA_MX_Uber Eats APP MX - City Market",
      "store": "Uber Eats APP MX - City Market",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_COCA_PE_PedidosYa App PE - Market",
      "store": "PedidosYa APP PE - Market",
      "country": "PE",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
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
    },
    {
      "name": "SH_COCA_CO_Rappi App CO - Olimpica",
      "store": "Rappi APP CO - Olimpica",
      "country": "CO",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_COCA_BR_Rappi App BR - Mambo",
      "store": "Rappi App BR - Mambo",
      "country": "BR",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_COCA_BR_Nagumo BR",
      "store": "Nagumo BR",
      "country": "BR",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "pepsico": [
    {
      "name": "SH_PEPS_MX_Sams Club MX",
      "store": "Sams Club MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_PEPS_US_Kroger US - Baker's Plus",
      "store": "Kroger US - Baker's Plus",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
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
    },
    {
      "name": "SE_PEPS_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MEG_PEPS_US_Target US",
      "store": "Target US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_PEPS_CL_Jumbo CL",
      "store": "Jumbo CL",
      "country": "CL",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_PEPS_PE_Cencosud Wong PE",
      "store": "Cencosud Wong PE",
      "country": "PE",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_PEPS_US_Albertsons US - Amigos United",
      "store": "Albertsons US - Amigos United",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_PEPS_US_Albertsons US - Acme",
      "store": "Albertsons US - Acme",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_PEPS_PR_SuperMax Online PR",
      "store": "SuperMax Online PR",
      "country": "PR",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "MEG_PEPS_US_Kroger US - Smith's",
      "store": "Kroger US - Smith's",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_PEPS_CO_Exito CO",
      "store": "Exito CO",
      "country": "CO",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_PEPS_CO_Exito CO",
      "store": "Exito CO",
      "country": "CO",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_PEPS_CL_Jumbo APP CL",
      "store": "Jumbo APP CL",
      "country": "CL",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
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
      "name": "SE_PEPS_CO_Rappi APP CO - Exito",
      "store": "Rappi APP CO - Exito",
      "country": "CO",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PEPS_TH_Makro Pro APP TH",
      "store": "Makro Pro APP TH",
      "country": "TH",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_PEPS_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_PEPS_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_PEPS_US_Kroger US - Metro Market",
      "store": "Kroger US - Metro Market",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
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
      "name": "SE_PEPS_GT_Walmart GT",
      "store": "Walmart GT",
      "country": "GT",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PEPS_CA_Walmart CA",
      "store": "Walmart CA",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_PEPS_MX_Soriana APP MX",
      "store": "Soriana APP MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_PEPS_AR_PedidosYa APP AR - Market",
      "store": "PedidosYa APP AR - Market",
      "country": "AR",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_PEPS_US_Kroger US - Fry's",
      "store": "Kroger US - Fry's",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAG_PEPS_US_Kroger US - King Soopers",
      "store": "Kroger US - King Soopers",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_PEPS_CA_Uber Eats CA - Walmart",
      "store": "Uber Eats CA - Walmart",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PEPS_US_Amazon Fresh US",
      "store": "Amazon Fresh US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_PEPS_MX_Rappi APP MX - 7 Eleven",
      "store": "Rappi APP MX - 7 Eleven",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "heineken": [
    {
      "name": "SE_HEIN_IE_Dunnes IE",
      "store": "Dunnes IE",
      "country": "IE",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_HEIN_IT_Cosicomodo Italmark IT",
      "store": "Cosicomodo Italmark IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_HEIN_IT_Cosicomodo Mercato IT",
      "store": "Cosicomodo Mercato IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HEIN_ES_Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_HEIN_IT_Cosicomodo sole 365 IT",
      "store": "Cosicomodo Sole 365 IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HEIN_BE_CollectAndGo - Colruyt BE_nl",
      "store": "CollectAndGo - Colruyt BE_nl",
      "country": "BE",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_HEIN_IE_Carryout IE",
      "store": "Carryout IE",
      "country": "IE",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_HEIN_IT_Cosicomodo Ilgigante IT",
      "store": "Cosicomodo Ilgigante IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HEIN_NL_Jumbo WEB NL",
      "store": "Jumbo WEB NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_HEIN_PT_Continente PT",
      "store": "Continente PT",
      "country": "PT",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HEIN_IT_Cosicomodo Emisfero IT",
      "store": "Cosicomodo Emisfero IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_HEIN_IT_Cosicomodo Ilgigante IT",
      "store": "Cosicomodo Ilgigante IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_HEIN_IE_SuperValu IE",
      "store": "SuperValu IE",
      "country": "IE",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HEIN_NL_Flink APP NL",
      "store": "Flink APP NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_HEIN_BE_CollectAndGo - Colruyt BE_nl",
      "store": "CollectAndGo - Colruyt BE_nl",
      "country": "BE",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HEIN_IT_Cosicomodo dok IT",
      "store": "Cosicomodo Dok IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_HEIN_NL_Plus NL",
      "store": "Plus NL",
      "country": "NL",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_HEIN_NL_Hoogvliet NL",
      "store": "Hoogvliet NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HEIN_IT_Cosicomodo sole 365 IT",
      "store": "Cosicomodo Sole 365 IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_HEIN_BE_Delhaize BE_nl",
      "store": "Delhaize BE_nl",
      "country": "BE",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HEIN_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_HEIN_NL_Plus APP NL",
      "store": "Plus APP NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_HEIN_NL_Picnic APP NL",
      "store": "Picnic APP NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HEIN_IT_Cosicomodo Italmark IT",
      "store": "Cosicomodo Italmark IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_HEIN_PT_El Corte Ingles Supermercado PT",
      "store": "El Corte Ingles Supermercado PT",
      "country": "PT",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HEIN_IT_Cosicomodo Italmark IT",
      "store": "Cosicomodo Italmark IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_HEIN_IE_Dunnes IE",
      "store": "Dunnes IE",
      "country": "IE",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_HEIN_BE_Delhaize BE_nl",
      "store": "Delhaize BE_nl",
      "country": "BE",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HEIN_IT_Cosicomodo Familia IT",
      "store": "Cosicomodo Familia IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_HEIN_IT_Cosicomodo Ilgigante IT",
      "store": "Cosicomodo Ilgigante IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "groupm": [
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
      "name": "PDP_GRPM_US - Meijer US",
      "store": "Meijer US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "CMI"
    },
    {
      "name": "PLP_GRPM_SG_Shopee SG - TRIGGER",
      "store": "Shopee SG",
      "country": "SG",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_GRPM_1m_X00_DE - Zooplus DE",
      "store": "Zooplus DE",
      "country": "DE",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "CMI"
    },
    {
      "name": "PDP_GRPM_AU - Woolworths AU",
      "store": "Woolworths AU",
      "country": "AU",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "CMI"
    },
    {
      "name": "GSB_GRPM_DE_Amazon DE",
      "store": "Amazon DE",
      "country": "DE",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "CMI"
    },
    {
      "name": "ME_GRPM_1d_X00_US - Best Buy US",
      "store": "Best Buy US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "AUTOMATIC",
      "businessUnit": "CMI"
    },
    {
      "name": "SA_GRPM_SKII_JP_Rakuten JP",
      "store": "Rakuten JP",
      "country": "JP",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_GRPM_SKII_JP_Amazon JP_jp",
      "store": "Amazon JP_jp",
      "country": "JP",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
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
      "name": "PDP_GRPM_FR - Carrefour FR",
      "store": "Carrefour FR",
      "country": "FR",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "CMI"
    },
    {
      "name": "PLP_GRPM_TH_Shopee TH - TRIGGER",
      "store": "Shopee TH",
      "country": "TH",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_GRPM_1d_X00_US - Kroger US - Dillons",
      "store": "Kroger US - Dillons",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "CMI"
    },
    {
      "name": "PDP_GRPM_US - Ulta US",
      "store": "Ulta US",
      "country": "US",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "CMI"
    },
    {
      "name": "GSB_GRPM_UK_Amazon UK",
      "store": "Amazon UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "CMI"
    },
    {
      "name": "ME_GRPM_1m_X00_US - Kroger US - Pick N Save",
      "store": "Kroger US - Pick N Save",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "CMI"
    },
    {
      "name": "PDP_GRPM_IN - Amazon IN_en",
      "store": "Amazon IN_en",
      "country": "IN",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "CMI"
    },
    {
      "name": "PLP_GRPM_SKII_JP_Rakuten JP",
      "store": "Rakuten JP",
      "country": "JP",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
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
      "name": "PDP_GRPM_US - Costco US",
      "store": "Costco US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "CMI"
    },
    {
      "name": "PLP_GRPM_MY_Shopee MY - TRIGGER",
      "store": "Shopee MY",
      "country": "MY",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
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
      "name": "PDP_GRPM_AU - Amazon AU",
      "store": "Amazon AU",
      "country": "AU",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": ""
    },
    {
      "name": "PLP_GRPM_ID_Shopee ID_id - TRIGGER",
      "store": "Shopee ID_id",
      "country": "ID",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
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
      "name": "PDP_GRPM_IT - Media World IT",
      "store": "Media World IT",
      "country": "IT",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "CMI"
    },
    {
      "name": "ME_GRPM_1w_X00_AE - Noon Minutes AE_en",
      "store": "Noon Minutes AE_en",
      "country": "AE",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "CMI"
    },
    {
      "name": "PDP_GRPM_US - Kroger US",
      "store": "Kroger US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "CMI"
    },
    {
      "name": "ME_GRPM_1w_M_X00_US - Walmart US",
      "store": "Walmart US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "CMI"
    },
    {
      "name": "PDP_GRPM_US - Instacart US - Walgreens",
      "store": "Instacart US - Walgreens",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "CMI"
    }
  ],
  "jde": [
    {
      "name": "SA_JDEX_UK_Sainsburys UK",
      "store": "Sainsburys UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
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
      "name": "AD_JDEX_TR_Getir APP TR",
      "store": "Getir APP TR",
      "country": "TR",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_JDEX_SE_Elgiganten SE",
      "store": "Elgiganten SE",
      "country": "SE",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_JDEX_NL_Bol NL",
      "store": "Bol NL_nl",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_JDEX_BE_Delhaize BE_nl",
      "store": "Delhaize BE_nl",
      "country": "BE",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_JDEX_UA_Rozetka UA",
      "store": "Rozetka UA",
      "country": "UA",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
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
      "name": "AD_JDEX_ZA_Pick n Pay ZA",
      "store": "Pick n Pay ZA",
      "country": "ZA",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_JDEX_AU_Woolworths AU",
      "store": "Woolworths AU",
      "country": "AU",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_JDEX_ES_Amazon APP ES",
      "store": "Amazon APP ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_JDEX_TR_Hepsiburada TR",
      "store": "Hepsiburada TR",
      "country": "TR",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_JDEX_UK_Ocado UK",
      "store": "Ocado UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
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
      "name": "AD_JDEX_GR_MyMarket GR",
      "store": "MyMarket GR",
      "country": "GR",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_JDEX_BE_Colruyt BE",
      "store": "Colruyt BE",
      "country": "BE",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_JDEX_BE_Carrefour BE_nl",
      "store": "Carrefour BE_nl",
      "country": "BE",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_JDEX_ES_EL Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_JDEX_ES_Amazon APP ES",
      "store": "Amazon APP ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_JDEX_NL_Jumbo WEB NL",
      "store": "Jumbo WEB NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_JDEX_BE_Delhaize BE_nl",
      "store": "Delhaize BE_nl",
      "country": "BE",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_JDEX_NL_Picnic APP NL",
      "store": "Picnic APP NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_JDEX_RO_Freshful RO",
      "store": "Freshful RO",
      "country": "RO",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_JDEX_AU_Amazon AU",
      "store": "Amazon AU",
      "country": "AU",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_JDEX_GR_AB-Delhaize GR",
      "store": "AB-Delhaize GR",
      "country": "GR",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_JDEX_AU_Amazon AU",
      "store": "Amazon AU",
      "country": "AU",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_JDEX_UK_Waitrose UK",
      "store": "Waitrose UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_JDEX_CZ_Tesco CZ",
      "store": "Tesco CZ",
      "country": "CZ",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_JDEX_DE_Viking DE",
      "store": "Viking DE",
      "country": "DE",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_JDEX_UK_ASDA UK",
      "store": "Asda UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "perfetti": [
    {
      "name": "SE_PERF_US_Kroger US",
      "store": "Kroger US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_PERF_NL_Albert Heijn Web NL",
      "store": "Albert Heijn Web NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PERF_IT_Amazon IT",
      "store": "Amazon IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_PERF_DE_Amazon DE",
      "store": "Amazon DE",
      "country": "DE",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_PERF_NL_Plus NL",
      "store": "Plus NL",
      "country": "NL",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_PERF_NL_Plus NL",
      "store": "Plus NL",
      "country": "NL",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_PERF_CA_Costco CA - Business Centre CA",
      "store": "Costco CA - Business Centre CA",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PERF_CA_Walmart CA",
      "store": "Walmart CA",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_PERF_US_Amazon US",
      "store": "Amazon US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_PERF_CA_Walmart CA",
      "store": "Walmart CA",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_PERF_DE_Rewe DE",
      "store": "Rewe DE",
      "country": "DE",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_PERF_CA_Amazon CA - 1P",
      "store": "Amazon CA - 1P",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PERF_US_Amazon US",
      "store": "Amazon US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_PERF_JP_Amazon JP_jp",
      "store": "Amazon JP_jp",
      "country": "JP",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_PERF_US_Target US",
      "store": "Target US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_PERF_NL_Jumbo WEB NL",
      "store": "Jumbo WEB NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_PERF_IT_Esselunga IT",
      "store": "Esselunga IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PERF_CA_Amazon CA",
      "store": "Amazon CA",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_PERF_US_Walmart US - 1P",
      "store": "Walmart US - 1P",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_PERF_NL_Jumbo WEB NL",
      "store": "Jumbo WEB NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_PERF_CA_Walmart CA",
      "store": "Walmart CA",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_PERF_NL_Albert Heijn Web NL",
      "store": "Albert Heijn Web NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PERF_NL_Albert Heijn Web NL",
      "store": "Albert Heijn Web NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_PERF_NL_Plus NL",
      "store": "Plus NL",
      "country": "NL",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_PERF_CA_Amazon CA",
      "store": "Amazon CA",
      "country": "CA",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_PERF_JP_Amazon JP_jp",
      "store": "Amazon JP_jp",
      "country": "JP",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_PERF_NL_Bol NL",
      "store": "Bol NL_nl",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_PERF_NL_Bol NL_nl",
      "store": "Bol NL_nl",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_PERF_US_Kroger US",
      "store": "Kroger US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_PERF_NL_Albert Heijn Web NL",
      "store": "Albert Heijn Web NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    }
  ],
  "lego": [
    {
      "name": "SH_LEGO_NL_Toychamp NL",
      "store": "Toychamp NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
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
      "name": "AD_LEGO_NO_Extra-Leker NO",
      "store": "Extra-Leker NO",
      "country": "NO",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
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
      "name": "SE_LEGO_DK_BR DK",
      "store": "BR DK",
      "country": "DK",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LEGO_DE_Alternate DE",
      "store": "Alternate DE",
      "country": "DE",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO_IT_Vendiloshop IT",
      "store": "Vendiloshop IT",
      "country": "IT",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LEGO_BE_DreamLand BE",
      "store": "Dreamland BE_nl",
      "country": "BE",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LEGO_PL_Amazon PL",
      "store": "Amazon PL",
      "country": "PL",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO_UK_George UK",
      "store": "George UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LEGO_UK_George UK",
      "store": "George UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LEGO_AE_FirstCry AE",
      "store": "FirstCry AE",
      "country": "AE",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO_HU_Emag HU",
      "store": "Emag HU",
      "country": "HU",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LEGO_BE_Bol BE_nl",
      "store": "Bol BE_nl",
      "country": "BE",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LEGO_IT_Yeppon IT",
      "store": "Yeppon IT",
      "country": "IT",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO_UK_Smythstoys UK",
      "store": "Smythstoys UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LEGO_ES_Fnac ES",
      "store": "Fnac ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LEGO_SE_Lekia SE",
      "store": "Lekia SE",
      "country": "SE",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO_BE_DreamLand BE",
      "store": "Dreamland BE_nl",
      "country": "BE",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LEGO_DE_Media Markt DE",
      "store": "Media Markt DE",
      "country": "DE",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LEGO_BE_Bol BE_nl",
      "store": "Bol BE_nl",
      "country": "BE",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO_FI_Prisma FI",
      "store": "Prisma FI",
      "country": "FI",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LEGO_DE_Compravo DE",
      "store": "Compravo DE",
      "country": "DE",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LEGO_NL_Kruidvat NL",
      "store": "Kruidvat NL_nl",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO_UK_The Entertainer UK",
      "store": "The Entertainer UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LEGO_NL_Bol NL",
      "store": "Bol NL_nl",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LEGO_FI_Gigantti FI",
      "store": "Gigantti FI",
      "country": "FI",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LEGO_NO_Elkjop NO",
      "store": "Elkjop NO",
      "country": "NO",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LEGO_FI_Gigantti FI",
      "store": "Gigantti FI",
      "country": "FI",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LEGO_IT_Toys Center IT",
      "store": "Toys Center IT",
      "country": "IT",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    }
  ],
  "deoleo": [
    {
      "name": "SE_DEOL_FR_Intermarche FR",
      "store": "Intermarche FR",
      "country": "FR",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_DEOL_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DEOL_IN_Flipkart IN",
      "store": "Flipkart IN",
      "country": "IN",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DEOL_IT_Carrefour IT",
      "store": "Carrefour IT",
      "country": "IT",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_DEOL_IN_Zepto APP IN",
      "store": "Zepto APP IN",
      "country": "IN",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_DEOL_IN_BigBasket IN",
      "store": "BigBasket IN",
      "country": "IN",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DEOL_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_DEOL_ES_Eroski ES",
      "store": "Eroski ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DEOL_FR_Intermarche FR",
      "store": "Intermarche FR",
      "country": "FR",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DEOL_US_BJs Wholesale Club US",
      "store": "BJs Wholesale Club US",
      "country": "US",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_DEOL_IN_Jiomart IN",
      "store": "Jiomart IN",
      "country": "IN",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_DEOL_IN_Amazon IN",
      "store": "Amazon IN_en",
      "country": "IN",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DEOL_IN_FirstCry IN",
      "store": "FirstCry IN",
      "country": "IN",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_DEOL_DE_Rewe DE",
      "store": "Rewe DE",
      "country": "DE",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DEOL_IN_Jiomart IN",
      "store": "Jiomart IN",
      "country": "IN",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DEOL_US_Instacart US - Target",
      "store": "Instacart US - Target",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_DEOL_IT_Carrefour IT",
      "store": "Carrefour IT",
      "country": "IT",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_DEOL_IN_Flipkart IN",
      "store": "Flipkart IN",
      "country": "IN",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DEOL_NL_Jumbo WEB NL",
      "store": "Jumbo WEB NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_DEOL_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DEOL_IT_Amazon IT",
      "store": "Amazon IT",
      "country": "IT",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DEOL_ES_Eroski ES",
      "store": "Eroski ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_DEOL_NL_Jumbo WEB NL",
      "store": "Jumbo WEB NL",
      "country": "NL",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_DEOL_IN_Zepto APP IN",
      "store": "Zepto APP IN",
      "country": "IN",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DEOL_FR_Leclerc Drive FR",
      "store": "Leclerc Drive FR",
      "country": "FR",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_DEOL_US_Amazon US",
      "store": "Amazon US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DEOL_IN_Blinkit IN",
      "store": "Blinkit IN",
      "country": "IN",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DEOL_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_DEOL_IN_Flipkart IN",
      "store": "Flipkart IN",
      "country": "IN",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_DEOL_IN_Blinkit IN",
      "store": "Blinkit IN",
      "country": "IN",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "danone": [
    {
      "name": "ME_DANO_MX_Uber Eats APP MX - Soriana",
      "store": "Uber Eats APP MX - Soriana",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_DANO_ES_Glovo APP ES - Carrefour",
      "store": "Glovo APP ES - Carrefour",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_DANO_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DANO_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_DANO_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DANO_MX_Rappi APP MX - Turbo",
      "store": "Rappi APP MX - Turbo",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DANO_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_DANO_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_DANO_MX_Rappi APP MX - Costco",
      "store": "Rappi APP MX - Costco",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DANO_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_DANO_MX_Costco MX",
      "store": "Costco MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DANO_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DANO_ES_Glovo APP ES - Carrefour",
      "store": "Glovo APP ES - Carrefour",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_DANO_MX_Rappi APP MX - La Comer",
      "store": "Rappi APP MX - La Comer",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_DANO_MX_Rappi APP MX - Soriana",
      "store": "Rappi APP MX - Soriana",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DANO_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_DANO_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DANO_MX_Uber Eats APP MX - HEB",
      "store": "Uber Eats APP MX - HEB",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DANO_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_DANO_MX_Bodega Aurrera MX",
      "store": "Bodega Aurrera MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_DANO_MX_Bodega Aurrera MX",
      "store": "Bodega Aurrera MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DANO_MX_Rappi APP MX - La Comer",
      "store": "Rappi APP MX - La Comer",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_DANO_MX_Soriana MX",
      "store": "Soriana MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DANO_MX_Uber Eats APP MX - Costco",
      "store": "Uber Eats APP MX - Costco",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_DANO_ES_Amazon Fresh ES",
      "store": "Amazon Fresh ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_DANO_MX_Costco MX",
      "store": "Costco MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_DANO_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_DANO_MX_Rappi APP MX - Chedraui",
      "store": "Rappi APP MX - Chedraui",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_DANO_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_DANO_MX_La Comer MX",
      "store": "La Comer MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "loewe": [
    {
      "name": "SA_LOEW_US_Bloomingdales US",
      "store": "Bloomingdales US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LOEW_US_Bergdorf Goodman US",
      "store": "Bergdorf Goodman US",
      "country": "US",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LOEW_ES_Douglas ES",
      "store": "Douglas ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LOEW_ES_Sephora ES",
      "store": "Sephora ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_LOEW_UK_Net A Porter APP UK",
      "store": "Net A Porter APP UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_LOEW_US_Bloomingdales US",
      "store": "Bloomingdales US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_LOEW_US_Saks US",
      "store": "Saks US",
      "country": "US",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LOEW_MX_El Palacio de Hierro",
      "store": "El Palacio de Hierro MX",
      "country": "MX",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LOEW_US_Bergdorf Goodman US",
      "store": "Bergdorf Goodman US",
      "country": "US",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LOEW_UK_John Lewis UK",
      "store": "John Lewis UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_LOEW_AR_Juleriaque AR",
      "store": "Juleriaque AR",
      "country": "AR",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_LOEW_CA_Holt Renfrew CA",
      "store": "Holt Renfrew CA",
      "country": "CA",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_LOEW_ES_El Corte Ingles ES",
      "store": "El Corte Ingles ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LOEW_CZ_Notino CZ",
      "store": "Notino CZ",
      "country": "CZ",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LOEW_AE_Ounass AE",
      "store": "Ounass AE",
      "country": "AE",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LOEW_AE_Ounass APP AE",
      "store": "Ounass APP AE",
      "country": "AE",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_LOEW_US_Neiman Marcus APP US",
      "store": "Neiman Marcus APP US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_LOEW_ES_Net A Porter ES",
      "store": "Net A Porter ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_LOEW_US_Saks US",
      "store": "Saks US",
      "country": "US",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LOEW_ES_Douglas ES Mobile",
      "store": "Douglas ES Mobile",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LOEW_US_Neiman Marcus US",
      "store": "Neiman Marcus US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LOEW_US_Neiman Marcus US",
      "store": "Neiman Marcus US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_LOEW_US_Neiman Marcus US",
      "store": "Neiman Marcus US",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_LOEW_BR_Sephora BR",
      "store": "Sephora BR",
      "country": "BR",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_LOEW_UK_Selfridges UK",
      "store": "Selfridges UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_LOEW_JP_Zozo Town JP",
      "store": "ZoZo Town JP",
      "country": "JP",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_LOEW_DE_Flaconi DE",
      "store": "Flaconi DE",
      "country": "DE",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_LOEW_ES_Primor ES",
      "store": "Primor ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_LOEW_ES_El Corte Ingles ES",
      "store": "El Corte Ingles ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_LOEW_ES_Net A Porter APP ES",
      "store": "Net A Porter APP ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    }
  ],
  "nestle": [
    {
      "name": "AD_NEST_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_NEST_ES_El Corte Ingles ES",
      "store": "El Corte Ingles ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "BSL_NEST_AU_Doordash AU - Woolworths",
      "store": "Doordash AU - Woolworths",
      "country": "AU",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "MSH"
    },
    {
      "name": "SH_NEST_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_NEST_ES_Dia ES",
      "store": "Dia ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_NEST_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_NEST_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_NEST_ES_Marvimundo ES",
      "store": "Marvimundo ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_NEST_ES_El Corte Ingles ES",
      "store": "El Corte Ingles ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_NEST_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_NEST_AU_Uber Eats AU - Coles",
      "store": "Uber Eats AU - Coles",
      "country": "AU",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_NEST_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_NEST_ES_Marvimundo ES",
      "store": "Marvimundo ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_NEST_ES_ Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_NEST_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_NEST_ES_El Corte Ingles ES",
      "store": "El Corte Ingles ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_NEST_ES_Marvimundo ES",
      "store": "Marvimundo ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_NEST_ES_Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_NEST_ES_ Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "BSL_NEST_AU_Uber Eats AU - Coles",
      "store": "Uber Eats AU - Coles",
      "country": "AU",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "MSH"
    },
    {
      "name": "ME_NEST_ES_Kiwoko ES",
      "store": "Kiwoko ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_NEST_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "BSL_NEST_KR_Coupang KR",
      "store": "Coupang KR",
      "country": "KR",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "MSH"
    },
    {
      "name": "ME_NEST_ES_Tienda Animal ES",
      "store": "Tienda Animal ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_NEST_ES_ Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_NEST_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_NEST_AU_Doordash AU - Woolworths",
      "store": "Doordash AU - Woolworths",
      "country": "AU",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_NEST_ES_Atida Mifarma ES",
      "store": "Atida Mifarma ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_NEST_ES_Atida Mifarma ES",
      "store": "Atida Mifarma ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_NEST_KR_Coupang KR",
      "store": "Coupang KR",
      "country": "KR",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    }
  ],
  "herdez": [
    {
      "name": "MAT_HERD_MX_Rappi APP MX  La Comer",
      "store": "Rappi APP MX - La Comer",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": ""
    },
    {
      "name": "AD_HERD_MX_Sams Club MX",
      "store": "Sams Club MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HERD_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_HERD_MX_Amazon MX",
      "store": "Amazon MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HERD_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_HERD_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_HERD_MX_Rappi APP MX  Soriana Híper",
      "store": "Rappi APP MX - Soriana Híper",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": ""
    },
    {
      "name": "AD_HERD_MX_Rappi APP MX  Soriana Híper",
      "store": "Rappi APP MX - Soriana Híper",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HERD_MX_Soriana MX",
      "store": "Soriana MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_HERD_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HERD_MX_Rappi APP MX  Fresko",
      "store": "Rappi APP MX - Fresko",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_HERD_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_HERD_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HERD_MX_Rappi APP MX  Soriana Híper",
      "store": "Rappi APP MX - Soriana Híper",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_HERD_MX_Uber Eats MX  Chedraui",
      "store": "Uber Eats MX - Chedraui",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HERD_MX_Soriana MX",
      "store": "Soriana MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_HERD_MX_Uber Eats MX Soriana",
      "store": "Uber Eats MX - Soriana",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_HERD_MX_Rappi APP MX  La Comer",
      "store": "Rappi APP MX - La Comer",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HERD_MX_Rappi APP MX  Fresko",
      "store": "Rappi APP MX - Fresko",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_HERD_MX_Mercado Libre APP MX",
      "store": "Mercado Libre APP MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HERD_MX_Amazon MX",
      "store": "Amazon MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_HERD_MX_Soriana MX",
      "store": "Soriana MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_HERD_MX_Rappi APP MX  Fresko",
      "store": "Rappi APP MX - Fresko",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HERD_MX_Amazon MX",
      "store": "Amazon MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_HERD_MX_Uber Eats MX  LaComer",
      "store": "Uber Eats MX - La Comer",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_HERD_MX_Rappi APP MX  Chedraui",
      "store": "Rappi APP MX - Chedraui",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_HERD_MX_Rappi APP MX Fresko",
      "store": "Rappi APP MX - Fresko",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_HERD_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_HERD_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_HERD_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    }
  ],
  "abinbev": [
    {
      "name": "GEO_ABIN_MX_Soriana MX",
      "store": "Soriana MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_ABIN_MX_Rappi APP MX - Turbo",
      "store": "Rappi APP MX - Turbo",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_ABIN_MX_Mercado Libre MX",
      "store": "Mercado Libre MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_ABIN_MX_La Comer MX - City Market",
      "store": "La Comer MX - City Market",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_ABIN_MX_Bodega Aurrera MX",
      "store": "Bodega Aurrera MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_ABIN_MX_Mercado Libre MX",
      "store": "Mercado Libre MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_ABIN_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_ABIN_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_ABIN_MX_Uber Eats App MX - 7eleven",
      "store": "Uber Eats APP MX - 7 Eleven",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_ABIN_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_ABIN_MX_Uber Eats App MX - La Comer",
      "store": "Uber Eats APP MX - La Comer",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_ABIN_MX_Uber Eats App MX - 7eleven",
      "store": "Uber Eats APP MX - 7 Eleven",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_ABIN_MX_Soriana MX",
      "store": "Soriana MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_ABIN_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_ABIN_MX_Uber Eats App MX - Parí",
      "store": "Uber Eats APP MX - Parí",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_ABIN_MX_Bodega Aurrera MX",
      "store": "Bodega Aurrera MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_ABIN_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_ABIN_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_ABIN_MX_Amazon MX",
      "store": "Amazon MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_ABIN_MX_Amazon MX",
      "store": "Amazon MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_ABIN_MX_Chedraui MX",
      "store": "Chedraui MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_ABIN_MX_Soriana MX",
      "store": "Soriana MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_ABIN_MX_Uber Eats App MX - Parí",
      "store": "Uber Eats APP MX - Parí",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_ABIN_MX_Bodega Aurrera MX",
      "store": "Bodega Aurrera MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_ABIN_MX_Mercado Libre MX",
      "store": "Mercado Libre MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_ABIN_MX_Bodega Aurrera MX",
      "store": "Bodega Aurrera MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_ABIN_MX_Soriana MX",
      "store": "Soriana MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_ABIN_MX_Uber Eats App MX - Parí",
      "store": "Uber Eats APP MX - Parí",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_ABIN_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_ABIN_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "bimbo": [
    {
      "name": "PDP_BIMB_ES_Bonpreu Esclat ES",
      "store": "Bonpreu Esclat ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_BIMB_ES_Amazon Fresh ES",
      "store": "Amazon Fresh ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_BIMB_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_BIMB_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_BIMB_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_BIMB_ES_Ahorramas ES",
      "store": "Ahorramas ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_BIMB_ES_Supermercados Mas ES",
      "store": "Supermercados Mas ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_BIMB_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_BIMB_ES_Dia ES",
      "store": "Dia ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_BIMB_ES_Consum ES",
      "store": "Consum ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_BIMB_ES_Dia ES",
      "store": "Dia ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_BIMB_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_BIMB_ES_Glovo APP ES - Super Glovo",
      "store": "Glovo APP ES - Super Glovo",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_BIMB_ES_Consum ES",
      "store": "Consum ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_BIMB_ES_Condisline ES",
      "store": "Condisline ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_BIMB_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_BIMB_ES_Ahorramas ES",
      "store": "Ahorramas ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_BIMB_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_BIMB_ES_Bonpreu Esclat ES",
      "store": "Bonpreu Esclat ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_BIMB_ES_Dia ES",
      "store": "Dia ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_BIMB_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_BIMB_ES_Dia ES",
      "store": "Dia ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_BIMB_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_BIMB_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_BIMB_ES_Amazon Fresh ES",
      "store": "Amazon Fresh ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_BIMB_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_BIMB_ES_Glovo APP ES - Super Glovo",
      "store": "Glovo APP ES - Super Glovo",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_BIMB_ES_Ahorramas ES",
      "store": "Ahorramas ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_BIMB_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_BIMB_ES_Amazon Fresh ES",
      "store": "Amazon Fresh ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "osborne": [
    {
      "name": "SA_OSBO_ES_El Corte Ingles Gourmet Club ES",
      "store": "El Corte Ingles Gourmet Club ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_OSBO_ES_El Corte Ingles Gourmet Club ES",
      "store": "El Corte Ingles Gourmet Club ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "SHELF",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_OSBO_ES_Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_OSBO_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_OSBO_ES_El Corte Ingles Gourmet Club ES",
      "store": "El Corte Ingles Gourmet Club ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "SEARCH",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_OSBO_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_OSBO_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_OSBO_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_OSBO_ES_Glovo Web ES - Super Glovo",
      "store": "Glovo Web ES - Super Glovo",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_OSBO_ES_El Corte Ingles Gourmet Club ES",
      "store": "El Corte Ingles Gourmet Club ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "AD",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_OSBO_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_OSBO_ES_El Corte Ingles Gourmet Club ES",
      "store": "El Corte Ingles Gourmet Club ES",
      "country": "ES",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_OSBO_ES_Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_OSBO_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_OSBO_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_OSBO_ES_Carrefour ES - Supermercado",
      "store": "Carrefour ES - Supermercado",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_OSBO_ES_Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_OSBO_ES_Glovo Web ES - Super Glovo",
      "store": "Glovo Web ES - Super Glovo",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_OSBO_ES_Glovo Web ES - Super Glovo",
      "store": "Glovo Web ES - Super Glovo",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "AUTOMATIC",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_OSBO_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_OSBO_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_OSBO_ES_Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_OSBO_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_OSBO_ES_Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_OSBO_ES_Amazon ES_amz",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_OSBO_ES_Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_OSBO_ES_El Corte Ingles Supermercado ES",
      "store": "El Corte Ingles Supermercado ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_OSBO_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_OSBO_ES_Alcampo ES",
      "store": "Alcampo ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_OSBO_ES_Amazon ES",
      "store": "Amazon ES",
      "country": "ES",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "ferrero": [
    {
      "name": "GEO_FERR_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_FERR_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_FERR_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_FERR_MX_Sams Club MX",
      "store": "Sams Club MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_FERR_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_FERR_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_FERR_MX_La Comer MX",
      "store": "La Comer MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_FERR_MX_La Comer MX",
      "store": "La Comer MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_FERR_MX_Sams Club MX",
      "store": "Sams Club MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_FERR_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_FERR_MX_Rappi APP MX - Turbo",
      "store": "Rappi APP MX - Turbo",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_FERR_MX_Sams Club MX",
      "store": "Sams Club MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_FERR_MX_Rappi APP MX - Turbo",
      "store": "Rappi APP MX - Turbo",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_FERR_MX_Sams Club MX",
      "store": "Sams Club MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_FERR_MX_La Comer MX",
      "store": "La Comer MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_FERR_MX_La Comer MX",
      "store": "La Comer MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_FERR_MX_Rappi APP MX - Turbo",
      "store": "Rappi APP MX - Turbo",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_FERR_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_FERR_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_FERR_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_FERR_MX_Sams Club MX",
      "store": "Sams Club MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_FERR_MX_Walmart Mismo Dia MX",
      "store": "Walmart Mismo Dia MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SE_FERR_MX_Sams Club MX",
      "store": "Sams Club MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SEARCH",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_FERR_MX_Rappi APP MX - Turbo",
      "store": "Rappi APP MX - Turbo",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "AD_FERR_MX_Rappi APP MX - Turbo",
      "store": "Rappi APP MX - Turbo",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "AD",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SH_FERR_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "SHELF",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_FERR_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_FERR_MX_Rappi APP MX - Turbo",
      "store": "Rappi APP MX - Turbo",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_FERR_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_FERR_MX_HEB MX",
      "store": "HEB MX",
      "country": "MX",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    }
  ],
  "samsung": [
    {
      "name": "PDP_SAMS_UK_O2 UK",
      "store": "O2 UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_SAMS_UK_Argos UK - Mobile",
      "store": "Argos UK - Mobile",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_Vodafone UK",
      "store": "Vodafone UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_SAMS_UK_EE UK",
      "store": "EE UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_SAMS_UK_O2 UK - Mobile",
      "store": "O2 UK - Mobile",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_CPW UK",
      "store": "CPW UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_SAMS_UK_AO UK",
      "store": "AO UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_SAMS_UK_Argos UK",
      "store": "Argos UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_Mobile Phone Direct UK",
      "store": "Mobile Phone Direct UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_SAMS_UK_Mobile Phone Direct UK",
      "store": "Mobile Phone Direct UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_SAMS_UK_EE UK",
      "store": "EE UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_John Lewis UK",
      "store": "John Lewis UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_SAMS_UK_Argos UK",
      "store": "Argos UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_SAMS_UK_Very UK",
      "store": "Very UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_Argos UK",
      "store": "Argos UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_SAMS_UK_Currys UK",
      "store": "Currys UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_SAMS_UK_John Lewis UK - Mobile",
      "store": "John Lewis UK - Mobile",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "MEDIA",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_O2 UK",
      "store": "O2 UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_SAMS_UK_Mobile Phone Direct UK",
      "store": "Mobile Phone Direct UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_SAMS_UK_EE UK - Mobile",
      "store": "EE UK - Mobile",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_Tesco Mobile UK",
      "store": "Tesco Mobile UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_SAMS_UK_Currys UK",
      "store": "Currys UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_SAMS_UK_Mobile Phone Direct UK",
      "store": "Mobile Phone Direct UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_Very UK",
      "store": "Very UK",
      "country": "GB",
      "storeType": "FLAGSHIP",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "NO_GEOLOC",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_SAMS_UK_SKY Mobile UK",
      "store": "SKY Mobile UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_SAMS_UK_CPW UK",
      "store": "CPW UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_SKY Mobile UK",
      "store": "SKY Mobile UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_SAMS_UK_Three UK",
      "store": "Three UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "ME_SAMS_UK_Currys UK",
      "store": "Currys UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "MEDIA",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PLP_SAMS_UK_Currys UK",
      "store": "Currys UK",
      "country": "GB",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    }
  ],
  "walmart": [
    {
      "name": "SA_WALM_US_Walmart US - All",
      "store": "Walmart US - All",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_WALM_US_Walmart US - All - Shipping",
      "store": "Walmart US - All",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_WALM_US_Walmart US - Delivery",
      "store": "Walmart US - Delivery",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_WALM_US_Walmart US - All - Delivery",
      "store": "Walmart US - All",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_WALM_US_Walmart US - Shipping",
      "store": "Walmart US - Shipping",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_WALM_US_Walmart US - DK_NUM",
      "store": "Walmart US - DK_NUM",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAG_WALM_US_Walmart US - Pickup",
      "store": "Walmart US - Pickup",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "AUTOMATIC",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_WALM_US_Walmart US - Shipping",
      "store": "Walmart US - Shipping",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_WALM_US_Walmart US - Delivery",
      "store": "Walmart US - Delivery",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_WALM_US_Walmart US - DK_NUM",
      "store": "Walmart US - DK_NUM",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_WALM_US_Walmart US - Pickup",
      "store": "Walmart US - Pickup",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_WALM_US_Walmart US - All - Pickup",
      "store": "Walmart US - All",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_WALM_US_Walmart US - All",
      "store": "Walmart US - All",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_WALM_US_Walmart US - Pickup",
      "store": "Walmart US - Pickup",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_WALM_US_Walmart US - Pickup",
      "store": "Walmart US - Pickup",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_WALM_US_Walmart US - Pickup",
      "store": "Walmart US - Pickup",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "PDP_WALM_US_Walmart US - DK_NUM",
      "store": "Walmart US - DK_NUM",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_WALM_US_Walmart US - All - Delivery",
      "store": "Walmart US - All",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAG_WALM_US_Walmart US - Delivery",
      "store": "Walmart US - Delivery",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "AUTOMATIC",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_WALM_US_Walmart US - All - Pickup",
      "store": "Walmart US - All",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAG_WALM_US_Walmart US - DK_NUM",
      "store": "Walmart US - DK_NUM",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_WALM_US_Walmart US - Delivery",
      "store": "Walmart US - Delivery",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_WALM_US_Walmart US - DK_NUM",
      "store": "Walmart US - DK_NUM",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_WALM_US_Walmart US - All - Shipping",
      "store": "Walmart US - All",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAG_WALM_US_Walmart US - Shipping",
      "store": "Walmart US - Shipping",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "AUTOMATIC",
      "businessUnit": "DSM"
    },
    {
      "name": "MAT_WALM_US_Walmart US - Delivery",
      "store": "Walmart US - Delivery",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "MAG_WALM_US_Walmart US - All",
      "store": "Walmart US - All",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "AUTOMATIC",
      "businessUnit": "DSM"
    },
    {
      "name": "GEO_WALM_US_Walmart US - Shipping",
      "store": "Walmart US - Shipping",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PLP",
      "geolocMode": "MANUAL",
      "businessUnit": "DSM"
    },
    {
      "name": "SA_WALM_US_Walmart US - Shipping",
      "store": "Walmart US - Shipping",
      "country": "US",
      "storeType": "GEOLOC",
      "extractionType": "DIGITAL_SHELF_PDP",
      "geolocMode": "VIRTUAL_STORE",
      "businessUnit": "DSM"
    }
  ]
};
