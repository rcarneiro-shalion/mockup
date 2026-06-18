import { readPersistedList } from "./seedOptions";

// "Subscription" is the renamed job-like hub entity (formerly "Stuff"): it ties a
// Project to a list of Seeds, a Scrapping option, and (when geoloc is MANUAL) a
// Location SET, and carries the client-oriented options.
export type Subscription = {
  id: string;
  name: string;
  project: string;
  store: string;
  seeds: string[];
  scrappingOption: string;
  geo: string; // NONE | AUTOMATIC | MANUAL
  locationSet: string;
  frequency: string; // Daily | Weekly | Monthly
  rotation: string; // Zipcode | Locations | Seeds
  status?: SubscriptionStatus; // Active | Inactive
  businessUnit?: string; // single Business Unit (CMI / FSA / DSM / RMM / MSH / GEN)
  // Set only when the scrapping option's extraction type is DIGITAL_SHELF_PLP or
  // MEDIA — points to a sibling subscription whose scrapping option is a PDP one.
  destinationOption?: string;
};

// Business Units — exactly one may be assigned to a subscription.
export const BUSINESS_UNITS = ["CMI", "FSA", "DSM", "RMM", "MSH", "GEN"];

export const SUBSCRIPTIONS_KEY = "seeds-api:subscriptions";

export type SubscriptionStatus = "Active" | "Inactive";
export const SUBSCRIPTION_STATUS_OPTIONS: SubscriptionStatus[] = ["Active", "Inactive"];

export const SUBSCRIPTION_GEOLOC_OPTIONS = ["NONE", "AUTOMATIC", "MANUAL", "VIRTUAL_STORE"];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub1",
    name: "ME_KW_WATER — Amazon US",
    project: "BEA>SHA_Amazon US",
    store: "Amazon US",
    seeds: ["water"],
    scrappingOption: "ME_KW_WATER — Amazon US",
    geo: "MANUAL",
    locationSet: "Amazon US — All locations",
    frequency: "Daily",
    rotation: "Locations",
    status: "Active",
    businessUnit: "CMI",
  },
  {
    id: "sub2",
    name: "PDP_BEAM_US — Amazon US",
    project: "Ab Inbev MX",
    store: "Amazon US",
    seeds: ["coffee"],
    scrappingOption: "PDP_BEAM_US — Amazon US",
    geo: "AUTOMATIC",
    locationSet: "",
    frequency: "Weekly",
    rotation: "Seeds",
    status: "Active",
    businessUnit: "FSA",
  },
];

export function getSubscriptions(): Subscription[] {
  const list = readPersistedList<Subscription>(SUBSCRIPTIONS_KEY);
  return list.length ? list : INITIAL_SUBSCRIPTIONS;
}

export function emptySubscription(): Subscription {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: "",
    project: "",
    store: "",
    seeds: [],
    scrappingOption: "",
    geo: "NONE",
    locationSet: "",
    frequency: "Daily",
    rotation: "",
    status: "Active",
    businessUnit: "",
    destinationOption: "",
  };
}
