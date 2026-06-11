import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MoreHorizontal, Star, ChevronLeft, ChevronRight, Barcode, Tag, Flag, Briefcase, Layers, Box, Calendar } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  FilterBar,
  TableShell,
  Th,
  Td,
  SortTh,
  useSort,
  sortRows,
  distinct,
  LinkText,
} from "@/components/seeds/ListPrimitives";
import { FilterChip } from "@/components/seeds/FilterChip";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { usePersistentState } from "@/hooks/usePersistentState";
import { flag, countryLabel } from "@/lib/retailers";
import { getClients } from "@/lib/clients";
import {
  CLIENT_SKUS_KEY,
  CLIENT_SKU_REGIONS_KEY,
  CLIENT_SKUS_TOTAL,
  CLIENT_SKU_REGIONS_TOTAL,
  INITIAL_CLIENT_SKUS,
  INITIAL_CLIENT_SKU_REGIONS,
  type ClientSku,
  type ClientSkuRegion,
} from "@/lib/clientSkus";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/client-skus/")({
  head: () => ({ meta: [{ title: "Client skus — Shalion" }] }),
  component: ClientSkusListPage,
});

type Tab = "skus" | "region";

function ClientSkusListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("skus");
  const [skus, setSkus] = usePersistentState<ClientSku[]>(CLIENT_SKUS_KEY, INITIAL_CLIENT_SKUS);
  const [regions, setRegions] = usePersistentState<ClientSkuRegion[]>(
    CLIENT_SKU_REGIONS_KEY,
    INITIAL_CLIENT_SKU_REGIONS,
  );

  // client name → id, so the Client column links to the client edit page.
  const clientId = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of getClients()) map.set(c.name, c.id);
    return (name: string) => map.get(name);
  }, []);
  const goClient = (name: string) => {
    const id = clientId(name);
    if (id) navigate({ to: "/clients/$clientId", params: { clientId: id } });
  };
  const goDetail = (id: string) =>
    navigate({ to: "/product/client-skus/$skuId", params: { skuId: id } });

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">Client skus</h1>
          <div className="flex items-center gap-2">
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
              aria-label="More actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <Button size="sm" className="h-9 gap-1.5" onClick={() => goDetail("new")}>
              Add client sku
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-3 flex gap-6 border-b border-border px-6">
          <TabButton active={tab === "skus"} onClick={() => setTab("skus")}>
            Client skus
          </TabButton>
          <TabButton active={tab === "region"} onClick={() => setTab("region")}>
            Client skus by region
          </TabButton>
        </div>

        {tab === "skus" ? (
          <SkusTab rows={skus} setRows={setSkus} goClient={goClient} goDetail={goDetail} />
        ) : (
          <RegionsTab rows={regions} setRows={setRegions} goClient={goClient} goDetail={goDetail} />
        )}
      </div>
    </AppShell>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "-mb-px border-b-2 px-1 pb-3 pt-1 text-sm font-medium transition-colors",
        active
          ? "border-[var(--sidebar-active-fg)] text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tab 1 — Client skus
// ---------------------------------------------------------------------------

function SkusTab({
  rows,
  setRows,
  goClient,
  goDetail,
}: {
  rows: ClientSku[];
  setRows: React.Dispatch<React.SetStateAction<ClientSku[]>>;
  goClient: (name: string) => void;
  goDetail: (id: string) => void;
}) {
  const sort = useSort();
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<string[]>([]);
  const [country, setCountry] = useState<string[]>([]);
  const [client, setClient] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [bu, setBu] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [hero, setHero] = useState<string[]>([]);

  const inSel = (sel: string[], v?: string) => sel.length === 0 || (!!v && sel.includes(v));

  const filtered = rows.filter(
    (r) =>
      (!q || r.title.toLowerCase().includes(q.toLowerCase())) &&
      inSel(brand, r.brand) &&
      inSel(country, r.country) &&
      inSel(client, r.client) &&
      inSel(category, r.category) &&
      inSel(bu, r.businessUnit) &&
      inSel(cc, r.clientCategory) &&
      inSel(hero, r.hero ? "Yes" : "No"),
  );
  const sorted = sortRows(filtered, sort);

  return (
    <>
      <FilterBar search="Search client skus by title" searchValue={q} onSearchChange={setQ}>
        <FilterChip label="Code" icon={Barcode} />
        <FilterChip label="Brands" icon={Tag} options={distinct(rows, (r) => r.brand)} value={brand} onChange={setBrand} />
        <FilterChip label="Country" icon={Flag} options={distinct(rows, (r) => r.country)} value={country} onChange={setCountry} getLabel={countryLabel} />
        <FilterChip label="Client" icon={Briefcase} options={distinct(rows, (r) => r.client)} value={client} onChange={setClient} />
        <FilterChip label="Skus" icon={Box} />
        <FilterChip label="Categories" icon={Layers} options={distinct(rows, (r) => r.category)} value={category} onChange={setCategory} />
        <FilterChip label="Business units" options={distinct(rows, (r) => r.businessUnit)} value={bu} onChange={setBu} />
        <FilterChip label="Client categories" options={distinct(rows, (r) => r.clientCategory)} value={cc} onChange={setCc} />
        <FilterChip label="Hero" icon={Star} options={["Yes", "No"]} value={hero} onChange={setHero} />
        <FilterChip label="Active at" icon={Calendar} />
        <FilterChip label="Created at" icon={Calendar} />
        <FilterChip label="Updated at" icon={Calendar} />
      </FilterBar>

      <TableShell>
        <thead className="bg-secondary/60">
          <tr>
            <SortTh label="Title" sortKey="title" sort={sort} />
            <Th>Codes</Th>
            <SortTh label="Client" sortKey="client" sort={sort} />
            <SortTh label="Brand" sortKey="brand" sort={sort} />
            <SortTh label="Country" sortKey="country" sort={sort} />
            <SortTh label="Category" sortKey="category" sort={sort} />
            <SortTh label="Business unit" sortKey="businessUnit" sort={sort} />
            <SortTh label="Client category" sortKey="clientCategory" sort={sort} />
            <SortTh label="Active at" sortKey="activeAt" sort={sort} />
            <Th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
              <Td className="max-w-[260px]">
                <span className="flex items-center gap-2">
                  <LinkText onClick={() => goDetail(r.id)}>
                    <span className="line-clamp-2">{r.title}</span>
                  </LinkText>
                  {r.hero && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-500" /> Hero
                    </span>
                  )}
                </span>
              </Td>
              <Td>
                <CodeCell codes={r.codes} />
              </Td>
              <Td>
                <LinkText onClick={() => goClient(r.client)}>{r.client}</LinkText>
              </Td>
              <Td>
                <span className="text-[var(--sidebar-active-fg)]">{r.brand}</span>
              </Td>
              <Td>
                <span className="inline-flex items-center gap-1.5">
                  <span>{flag(r.country)}</span>
                  <span className="text-foreground/80">{r.country}</span>
                </span>
              </Td>
              <Td className="text-foreground/80">{r.category}</Td>
              <Td className="text-foreground/80">{r.businessUnit ?? "-"}</Td>
              <Td>
                {r.clientCategory ? (
                  <span className="text-[var(--sidebar-active-fg)]">{r.clientCategory}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </Td>
              <Td className="whitespace-nowrap text-muted-foreground">{r.activeAt ?? "-"}</Td>
              <Td>
                <RowActionsMenu
                  id={r.id}
                  entityLabel="client sku"
                  onDelete={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <BigPagination shown={sorted.length} total={CLIENT_SKUS_TOTAL} pages={927} />
    </>
  );
}

function CodeCell({ codes }: { codes: { type: string; value: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
      {codes.map((c, i) => (
        <span key={i} className="inline-flex flex-col leading-tight">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{c.type}</span>
          <span className="font-mono text-xs text-foreground/80">{c.value}</span>
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab 2 — Client skus by region
// ---------------------------------------------------------------------------

function RegionsTab({
  rows,
  setRows,
  goClient,
  goDetail,
}: {
  rows: ClientSkuRegion[];
  setRows: React.Dispatch<React.SetStateAction<ClientSkuRegion[]>>;
  goClient: (name: string) => void;
  goDetail: (id: string) => void;
}) {
  const sort = useSort();
  const [client, setClient] = useState<string[]>([]);
  const [region, setRegion] = useState<string[]>([]);
  const [country, setCountry] = useState<string[]>([]);
  const [bu, setBu] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [hero, setHero] = useState<string[]>([]);

  const inSel = (sel: string[], v?: string) => sel.length === 0 || (!!v && sel.includes(v));

  const filtered = rows.filter(
    (r) =>
      inSel(client, r.client) &&
      inSel(region, r.region) &&
      inSel(country, r.country) &&
      inSel(bu, r.businessUnit) &&
      inSel(cc, r.clientCategory) &&
      inSel(hero, r.hero ? "Yes" : "No"),
  );
  const sorted = sortRows(filtered, sort);

  return (
    <>
      <FilterBar>
        <FilterChip label="Clients" icon={Briefcase} options={distinct(rows, (r) => r.client)} value={client} onChange={setClient} />
        <FilterChip label="Client skus" icon={Box} />
        <FilterChip label="Regions" icon={Layers} options={distinct(rows, (r) => r.region)} value={region} onChange={setRegion} />
        <FilterChip label="Countries" icon={Flag} options={distinct(rows, (r) => r.country)} value={country} onChange={setCountry} getLabel={countryLabel} />
        <FilterChip label="Business units" options={distinct(rows, (r) => r.businessUnit)} value={bu} onChange={setBu} />
        <FilterChip label="Client categories" options={distinct(rows, (r) => r.clientCategory)} value={cc} onChange={setCc} />
        <FilterChip label="Hero" icon={Star} options={["Yes", "No"]} value={hero} onChange={setHero} />
        <FilterChip label="Active at" icon={Calendar} />
        <FilterChip label="Created at" icon={Calendar} />
        <FilterChip label="Updated at" icon={Calendar} />
      </FilterBar>

      <TableShell>
        <thead className="bg-secondary/60">
          <tr>
            <SortTh label="Title" sortKey="title" sort={sort} />
            <SortTh label="Client" sortKey="client" sort={sort} />
            <SortTh label="Country" sortKey="country" sort={sort} />
            <SortTh label="Region system" sortKey="regionSystem" sort={sort} />
            <SortTh label="Region" sortKey="region" sort={sort} />
            <SortTh label="Business unit" sortKey="businessUnit" sort={sort} />
            <SortTh label="Client category" sortKey="clientCategory" sort={sort} />
            <SortTh label="Active from" sortKey="activeFrom" sort={sort} />
            <Th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
              <Td className="max-w-[260px]">
                <span className="flex items-center gap-2">
                  <LinkText onClick={() => goDetail(r.id)}>
                    <span className="line-clamp-2">{r.title}</span>
                  </LinkText>
                  {r.hero && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-500" /> Hero
                    </span>
                  )}
                </span>
              </Td>
              <Td>
                <LinkText onClick={() => goClient(r.client)}>{r.client}</LinkText>
              </Td>
              <Td>
                <span className="inline-flex items-center gap-1.5">
                  <span>{flag(r.country)}</span>
                  <span className="text-foreground/80">{r.country}</span>
                </span>
              </Td>
              <Td>
                <span className="text-[var(--sidebar-active-fg)]">{r.regionSystem}</span>
              </Td>
              <Td>
                <span className="text-[var(--sidebar-active-fg)]">{r.region}</span>
              </Td>
              <Td>
                {r.businessUnit ? (
                  <span className="text-[var(--sidebar-active-fg)]">{r.businessUnit}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </Td>
              <Td>
                {r.clientCategory ? (
                  <span className="text-[var(--sidebar-active-fg)]">{r.clientCategory}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </Td>
              <Td className="whitespace-nowrap text-muted-foreground">{r.activeFrom ?? "-"}</Td>
              <Td>
                <RowActionsMenu
                  id={r.id}
                  entityLabel="client sku region"
                  onDelete={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <BigPagination shown={sorted.length} total={CLIENT_SKU_REGIONS_TOTAL} pages={62} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Pagination footer matching the console (Rows per page · 1–N of TOTAL · pages)
// ---------------------------------------------------------------------------

function BigPagination({ shown, total, pages }: { shown: number; total: number; pages: number }) {
  const fmt = (n: number) => n.toLocaleString("en-US");
  const upper = Math.min(shown, 100);
  return (
    <div className="flex items-center justify-end gap-5 border-t border-border px-6 py-3 text-sm text-muted-foreground">
      <span className="flex items-center gap-2">
        Rows per page:
        <span className="rounded border border-border px-2 py-0.5 text-foreground">100</span>
      </span>
      <span>
        1–{upper} of {fmt(total)}
      </span>
      <div className="flex items-center gap-1">
        <button className="rounded p-1 hover:bg-secondary" aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <PageChip n={1} active />
        <PageChip n={2} />
        <PageChip n={3} />
        <PageChip n={4} />
        <PageChip n={5} />
        <span className="px-1">…</span>
        <PageChip n={pages} />
        <button className="rounded p-1 hover:bg-secondary" aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function PageChip({ n, active }: { n: number; active?: boolean }) {
  return (
    <span
      className={cn(
        "grid h-6 min-w-6 place-items-center rounded px-1 text-xs",
        active ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary",
      )}
    >
      {n}
    </span>
  );
}
