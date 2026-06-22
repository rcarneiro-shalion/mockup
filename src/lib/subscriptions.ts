import { readPersistedList } from "./seedOptions";

// "Subscription" is the renamed job-like hub entity (formerly "Stuff"): it ties a
// Project to a list of Seeds, exactly ONE Scrapping option (1:1), and (when geoloc
// is MANUAL) a Location SET, and carries the client-oriented options.
export type Subscription = {
  id: string;
  name: string;
  project: string;
  store: string;
  seeds: string[];
  // A subscription runs exactly ONE scrapping option (1:1). Scrapping options stay
  // reusable — several subscriptions may reference the same option by name.
  scrappingOption: string;
  geo: string; // NONE | AUTOMATIC | MANUAL | VIRTUAL_STORE
  locationSet: string;
  frequency: string; // Daily | Weekly | Monthly | Custom
  frequencyDays?: string; // mandatory "every N days" when frequency = Custom
  rotation: string; // Locations | Seeds | Both
  status?: SubscriptionStatus; // Active | Inactive
  businessUnit?: string; // single Business Unit (CMI / FSA / DSM / RMM / MSH / GEN)
  // Shown only when the scrapping option's extraction type is DIGITAL_SHELF_PLP or
  // MEDIA — points to zero, one or many sibling subscriptions running a PDP option.
  destinationOptions?: string[];
  /** @deprecated legacy single value — migrated into destinationOptions on read. */
  destinationOption?: string;
  createdAt?: string;
  updatedAt?: string;
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
    createdAt: "Thu, May 2, 2024 3:21",
    updatedAt: "Mon, Oct 27, 2025 1:30",
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
    createdAt: "Fri, May 3, 2024 8:27",
    updatedAt: "Mon, Oct 27, 2025 2:00",
  },
];

export function getSubscriptions(): Subscription[] {
  const list = readPersistedList<Subscription>(SUBSCRIPTIONS_KEY);
  return list.length ? list : INITIAL_SUBSCRIPTIONS;
}

/** A subscription's destination options as a list, tolerating legacy records that
 *  only carry the singular `destinationOption`. Zero, one or many PDP siblings. */
export function subDestinationOptions(s: Subscription): string[] {
  if (s.destinationOptions?.length) return s.destinationOptions;
  return s.destinationOption ? [s.destinationOption] : [];
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
    frequencyDays: "",
    rotation: "",
    status: "Active",
    businessUnit: "",
    destinationOptions: [],
    createdAt: "",
    updatedAt: "",
  };
}
