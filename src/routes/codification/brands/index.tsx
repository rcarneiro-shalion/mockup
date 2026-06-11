import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import {
  FilterBar,
  TableShell,
  Th,
  Td,
  Pagination,
  LinkText,
  Pill,
  SortTh,
  useSort,
  sortRows,
  distinct,
} from "@/components/seeds/ListPrimitives";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { BRANDS_KEY, INITIAL_BRANDS, type Brand } from "@/lib/brands";
import { Plus, Calendar, Tag, Factory, GitBranch } from "lucide-react";

export const Route = createFileRoute("/codification/brands/")({
  head: () => ({ meta: [{ title: "Brands — Shalion" }] }),
  component: BrandsListPage,
});

function YesNo({ value }: { value: boolean }) {
  return value ? (
    <Pill tone="green">Yes</Pill>
  ) : (
    <span className="text-muted-foreground">No</span>
  );
}

function BrandsListPage() {
  const [rows, setRows] = usePersistentState<Brand[]>(BRANDS_KEY, INITIAL_BRANDS);
  const navigate = useNavigate();
  const sort = useSort();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [manufacturer, setManufacturer] = useState<string[]>([]);
  const [parent, setParent] = useState<string[]>([]);
  const [whiteLabel, setWhiteLabel] = useState<string[]>([]);
  const [multiBrand, setMultiBrand] = useState<string[]>([]);

  const inSel = (sel: string[], v?: string) => sel.length === 0 || (!!v && sel.includes(v));

  const filtered = rows.filter(
    (r) =>
      (!q || r.name.toLowerCase().includes(q.trim().toLowerCase())) &&
      inSel(category, r.defaultCategory) &&
      inSel(manufacturer, r.defaultManufacturer) &&
      inSel(parent, r.parent) &&
      inSel(whiteLabel, r.isWhiteLabel ? "Yes" : "No") &&
      inSel(multiBrand, r.isMultiBrand ? "Yes" : "No"),
  );
  const sorted = sortRows(filtered, sort);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">Brands</h1>
          <Button asChild size="sm" className="h-8 gap-1.5">
            <Link to="/codification/brands/new">
              <Plus className="h-4 w-4" /> New brand
            </Link>
          </Button>
        </div>

        <FilterBar search="Search by brand name" searchValue={q} onSearchChange={setQ}>
          <FilterChip label="Default category" icon={Tag} options={distinct(rows, (r) => r.defaultCategory)} value={category} onChange={setCategory} />
          <FilterChip label="Default manufacturer" icon={Factory} options={distinct(rows, (r) => r.defaultManufacturer)} value={manufacturer} onChange={setManufacturer} />
          <FilterChip label="Parent brand" icon={GitBranch} options={distinct(rows, (r) => r.parent)} value={parent} onChange={setParent} />
          <FilterChip label="White label" options={["Yes", "No"]} value={whiteLabel} onChange={setWhiteLabel} />
          <FilterChip label="Multi-brand" options={["Yes", "No"]} value={multiBrand} onChange={setMultiBrand} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
        </FilterBar>

        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Default category" sortKey="defaultCategory" sort={sort} />
              <SortTh label="Default manufacturer" sortKey="defaultManufacturer" sort={sort} />
              <SortTh label="Parent" sortKey="parent" sort={sort} />
              <SortTh label="White label" sortKey="isWhiteLabel" sort={sort} />
              <SortTh label="Multi-brand" sortKey="isMultiBrand" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
              <Th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                <Td>
                  <LinkText onClick={() => navigate({ to: "/codification/brands/$brandId", params: { brandId: r.id } })}>
                    {r.name}
                  </LinkText>
                </Td>
                <Td className="text-foreground/80">{r.defaultCategory}</Td>
                <Td className="text-foreground/80">{r.defaultManufacturer}</Td>
                <Td>
                  {r.parent ? (
                    <span className="text-[var(--sidebar-active-fg)]">{r.parent}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </Td>
                <Td><YesNo value={r.isWhiteLabel} /></Td>
                <Td><YesNo value={r.isMultiBrand} /></Td>
                <Td className="whitespace-nowrap text-muted-foreground">{r.updatedAt}</Td>
                <Td>
                  <RowActionsMenu
                    id={r.id}
                    entityLabel="brand"
                    onDelete={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>

        <Pagination total={sorted.length} />
      </div>
    </AppShell>
  );
}
