import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import { FilterBar, TableShell, Th, Td, Pagination, LinkText, Pill, SortTh, useSort, sortRows, distinct } from "@/components/seeds/ListPrimitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePersistentState } from "@/hooks/usePersistentState";
import { STORES_KEY, INITIAL_STORES, COUNTRY_OPTIONS, countryLabel, getRetailers, type Store } from "@/lib/retailers";
import { Plus, Calendar, MoreVertical, Flag } from "lucide-react";

export const Route = createFileRoute("/stores/")({
  head: () => ({ meta: [{ title: "Stores — Shalion" }] }),
  component: StoresListPage,
});

function StatusPill({ status }: { status: Store["status"] }) {
  const active = status === "Active";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80">
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-400")} />
      {status}
    </span>
  );
}

function StoresListPage() {
  const [rows] = usePersistentState<Store[]>(STORES_KEY, INITIAL_STORES);
  const [query, setQuery] = useState("");
  const [fDomain, setFDomain] = useState("");
  const [fCountry, setFCountry] = useState("");
  const [fType, setFType] = useState("");
  const [fStatus, setFStatus] = useState("");
  const sort = useSort();
  const q = query.trim().toLowerCase();
  const filtered = rows.filter((s) =>
    (!q || s.name.toLowerCase().includes(q)) &&
    (!fDomain || s.domain === fDomain) &&
    (!fCountry || s.country === fCountry) &&
    (!fType || s.type === fType) &&
    (!fStatus || s.status === fStatus),
  );
  const sorted = sortRows(filtered, sort);
  const navigate = useNavigate();
  const retailerIdByName = new Map(getRetailers().map((r) => [r.name, r.id]));

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">Stores</h1>
          <Button asChild size="sm" className="h-8 gap-1.5">
            <Link to="/stores/new"><Plus className="h-4 w-4" /> New store</Link>
          </Button>
        </div>
        <FilterBar search="Search by store name" searchValue={query} onSearchChange={setQuery}>
          <FilterChip label="Domain" options={distinct(rows, (s) => s.domain)} value={fDomain} onChange={setFDomain} />
          <FilterChip label="Countries" icon={Flag} options={COUNTRY_OPTIONS} getLabel={countryLabel} value={fCountry} onChange={setFCountry} />
          <FilterChip label="Types" options={distinct(rows, (s) => s.type)} value={fType} onChange={setFType} />
          <FilterChip label="Status" options={["Active", "Inactive"]} value={fStatus} onChange={setFStatus} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>
        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Domain" sortKey="domain" sort={sort} />
              <SortTh label="Retailer" sortKey="retailer" sort={sort} />
              <SortTh label="Type" sortKey="type" sort={sort} />
              <SortTh label="Class" sortKey="klass" sort={sort} />
              <SortTh label="Device" sortKey="device" sort={sort} />
              <SortTh label="Status" sortKey="status" sort={sort} />
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} className="border-t border-border hover:bg-secondary/40">
                <Td><LinkText onClick={() => navigate({ to: "/stores/$storeId", params: { storeId: s.id } })}>{s.name}</LinkText></Td>
                <Td><LinkText>{s.domain}</LinkText></Td>
                <Td>
                  <LinkText
                    onClick={() => {
                      const id = retailerIdByName.get(s.retailer);
                      if (id) navigate({ to: "/retailers/$retailerId", params: { retailerId: id } });
                    }}
                  >
                    {s.retailer}
                  </LinkText>
                </Td>
                <Td><Pill tone={s.type === "GEOLOC" ? "amber" : "blue"}>{s.type}</Pill></Td>
                <Td><Pill tone="slate">{s.klass}</Pill></Td>
                <Td><Pill tone="slate">{s.device}</Pill></Td>
                <Td><StatusPill status={s.status} /></Td>
                <Td><button className="rounded p-1 text-muted-foreground hover:bg-secondary"><MoreVertical className="h-4 w-4" /></button></Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
        <Pagination total={sorted.length} />
      </div>
    </AppShell>
  );
}
