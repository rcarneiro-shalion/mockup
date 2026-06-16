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
  // Set only when the scrapping option's extraction type is DIGITAL_SHELF_PLP or
  // MEDIA — points to a sibling subscription whose scrapping option is a PDP one.
  destinationOption?: string;
};

export const SUBSCRIPTIONS_KEY = "seeds-api:subscriptions";

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
    destinationOption: "",
  };
}
