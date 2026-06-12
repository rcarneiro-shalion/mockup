// IAM user ↔ datagroup membership model (spec TECH-14456 "User navigating by
// many datagroups"). The DB already models USER ↔ DATA_GROUP as N:M
// (USER_DATA_GROUP), so a user can belong to many datagroups — across accounts —
// with exactly ONE default datagroup per account. This module powers the custom
// IAM → Users → Detail page (datagroups grouped by account + default radio).

export type IamDataGroupRef = { id: string; name: string };
export type IamAccount = { id: string; domain: string; dataGroups: IamDataGroupRef[] };

// Account = a client user-pool (domain). Each account owns a set of datagroups.
export const IAM_ACCOUNTS: IamAccount[] = [
  {
    id: "acc-cocacola",
    domain: "coca-cola.shalion",
    dataGroups: [
      { id: "dg-cc-latam", name: "Coca Cola LATAM" },
      { id: "dg-cc-na", name: "Coca Cola NA" },
      { id: "dg-cc-emea", name: "Coca Cola EMEA" },
    ],
  },
  {
    id: "acc-pepsi",
    domain: "pepsi.shalion",
    dataGroups: [
      { id: "dg-pep-mx", name: "Pepsi MX" },
      { id: "dg-pep-us", name: "Pepsi US" },
      { id: "dg-pep-co", name: "Pepsi CO" },
    ],
  },
  {
    id: "acc-nestle",
    domain: "nestle.shalion",
    dataGroups: [
      { id: "dg-nes-eu", name: "Nestlé EU" },
      { id: "dg-nes-us", name: "Nestlé US" },
    ],
  },
  {
    id: "acc-groupm",
    domain: "groupm.shalion",
    dataGroups: [
      { id: "dg-gm-admin", name: "GroupM Admin" },
      { id: "dg-gm-global", name: "GroupM Global" },
    ],
  },
  {
    id: "acc-perfetti",
    domain: "perfetti.shalion",
    dataGroups: [
      { id: "dg-per-au", name: "Perfetti AU" },
      { id: "dg-per-ca", name: "Perfetti CA" },
      { id: "dg-per-de", name: "Perfetti DE" },
    ],
  },
  {
    id: "acc-jde",
    domain: "jde.shalion",
    dataGroups: [
      { id: "dg-jde-ae", name: "JDE AE" },
      { id: "dg-jde-au", name: "JDE AU" },
      { id: "dg-jde-be", name: "JDE BE" },
      { id: "dg-jde-cz", name: "JDE CZ" },
      { id: "dg-jde-de", name: "JDE DE" },
    ],
  },
];

/** A single USER_DATA_GROUP row: the user belongs to this datagroup; isDefault
 *  marks the one shown by default within its account (one default per account). */
export type Membership = { accountId: string; dataGroupId: string; isDefault: boolean };

export type IamUser = {
  id: string;
  email: string;
  status: "Active" | "Inactive";
  role: string;
  /** Internal Shalion staff (CS/Sales) can span datagroups across many clients. */
  internal?: boolean;
  memberships: Membership[];
};

const M = (accountId: string, dataGroupId: string, isDefault = false): Membership => ({
  accountId,
  dataGroupId,
  isDefault,
});

// Same ids/emails as IAM_SPECS["iam-users"] rows so the list links to this detail.
export const IAM_USERS: IamUser[] = [
  {
    id: "usr-john-doe",
    email: "john.doe@example.com",
    status: "Active",
    role: "Analyst",
    memberships: [
      M("acc-cocacola", "dg-cc-latam", true),
      M("acc-cocacola", "dg-cc-na"),
      M("acc-pepsi", "dg-pep-mx", true),
    ],
  },
  {
    id: "usr-jane-smith",
    email: "jane.smith@company.com",
    status: "Active",
    role: "Manager",
    memberships: [M("acc-nestle", "dg-nes-eu", true), M("acc-nestle", "dg-nes-us")],
  },
  {
    id: "usr-admin-shalion",
    email: "admin@shalion.com",
    status: "Inactive",
    role: "Admin",
    internal: true,
    memberships: [
      M("acc-cocacola", "dg-cc-latam", true),
      M("acc-groupm", "dg-gm-admin", true),
      M("acc-groupm", "dg-gm-global"),
      M("acc-perfetti", "dg-per-au", true),
      M("acc-perfetti", "dg-per-ca"),
      M("acc-perfetti", "dg-per-de"),
    ],
  },
  {
    id: "usr-maria-garcia",
    email: "maria.garcia@cocacola.com",
    status: "Active",
    role: "Viewer",
    memberships: [M("acc-cocacola", "dg-cc-latam", true)],
  },
  {
    id: "usr-tom-lee",
    email: "tom.lee@pepsico.com",
    status: "Active",
    role: "Analyst",
    memberships: [M("acc-pepsi", "dg-pep-mx", true), M("acc-pepsi", "dg-pep-us")],
  },
  {
    id: "usr-sara-kim",
    email: "sara.kim@shalion.com",
    status: "Active",
    role: "Read only",
    internal: true,
    memberships: [
      M("acc-groupm", "dg-gm-global", true),
      M("acc-jde", "dg-jde-be", true),
      M("acc-jde", "dg-jde-ae"),
    ],
  },
];

export const accountById = (id: string) => IAM_ACCOUNTS.find((a) => a.id === id);
export const userById = (id: string) => IAM_USERS.find((u) => u.id === id);
