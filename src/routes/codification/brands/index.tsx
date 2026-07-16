import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FilterChip } from "@/components/seeds/FilterChip";
import {
  FilterBar,
  TableShell,
  Th,
  Td,
  LinkText,
  UserCell,
  SortTh,
  useSort,
  sortRows,
  distinct,
} from "@/components/seeds/ListPrimitives";
import { RowActionsMenu } from "@/components/seeds/RowActionsMenu";
import { Button } from "@/components/ui/button";
import { usePersistentState } from "@/hooks/usePersistentState";
import { BRANDS_KEY, INITIAL_BRANDS, BRANDS_TOTAL, BRANDS_PAGES, type Brand } from "@/lib/brands";
import { Plus, Calendar, Tag, Factory, GitBranch, BadgeCheck, Layers, User, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/codification/brands/")({
  head: () => ({ meta: [{ title: "Brands — Shalion" }] }),
  component: BrandsListPage,
});

function BrandsListPage() {
  const [rows, setRows] = usePersistentState<Brand[]>(BRANDS_KEY, INITIAL_BRANDS);
  const navigate = useNavigate();
  const sort = useSort("codification-brands");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [edition, setEdition] = useState<string[]>([]);
  const [manufacturer, setManufacturer] = useState<string[]>([]);
  const [parent, setParent] = useState<string[]>([]);
  const [whiteLabel, setWhiteLabel] = useState<string[]>([]);
  const [multiBrand, setMultiBrand] = useState<string[]>([]);
  const [createdBy, setCreatedBy] = useState<string[]>([]);
  const [updatedBy, setUpdatedBy] = useState<string[]>([]);

  // Resolve a parent brand name → its id, so the Parent column links to its edit page.
  const brandIdByName = useMemo(() => {
    const m = new Map<string, string>();
    for (const b of rows) m.set(b.name, b.id);
    return m;
  }, [rows]);

  const inSel = (sel: string[], v?: string) => sel.length === 0 || (!!v && sel.includes(v));

  const filtered = rows.filter(
    (r) =>
      (!q || r.name.toLowerCase().includes(q.trim().toLowerCase())) &&
      inSel(category, r.defaultCategory) &&
      inSel(edition, r.defaultEdition) &&
      inSel(manufacturer, r.defaultManufacturer) &&
      inSel(parent, r.parent) &&
      inSel(whiteLabel, r.isWhiteLabel ? "Yes" : "No") &&
      inSel(multiBrand, r.isMultiBrand ? "Yes" : "No") &&
      inSel(createdBy, r.createdBy) &&
      inSel(updatedBy, r.updatedBy),
  );
  const sorted = sortRows(filtered, sort);

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5">
          <h1 className="text-[17px] font-semibold text-foreground">Brands</h1>
          <Button asChild size="sm" className="h-8 gap-1.5">
            <Link to="/codification/brands/new">
              <Plus className="h-4 w-4" /> Add brand
            </Link>
          </Button>
        </div>

        <FilterBar search="Search brands by name" searchValue={q} onSearchChange={setQ}>
          <FilterChip label="Name starts with" icon={Tag} />
          <FilterChip label="Default categories" icon={Layers} options={distinct(rows, (r) => r.defaultCategory)} value={category} onChange={setCategory} />
          <FilterChip label="Default editions" icon={Layers} options={distinct(rows, (r) => r.defaultEdition)} value={edition} onChange={setEdition} />
          <FilterChip label="Default manufacturers" icon={Factory} options={distinct(rows, (r) => r.defaultManufacturer)} value={manufacturer} onChange={setManufacturer} />
          <FilterChip label="Parents" icon={GitBranch} options={distinct(rows, (r) => r.parent)} value={parent} onChange={setParent} />
          <FilterChip label="White label" icon={BadgeCheck} options={["Yes", "No"]} value={whiteLabel} onChange={setWhiteLabel} />
          <FilterChip label="Multi brand" options={["Yes", "No"]} value={multiBrand} onChange={setMultiBrand} />
          <FilterChip label="Created at" icon={Calendar} />
          <FilterChip label="Updated at" icon={Calendar} />
          <FilterChip label="Created by" icon={User} options={distinct(rows, (r) => r.createdBy)} value={createdBy} onChange={setCreatedBy} />
          <FilterChip label="Updated by" icon={User} options={distinct(rows, (r) => r.updatedBy)} value={updatedBy} onChange={setUpdatedBy} />
        </FilterBar>

        <TableShell>
          <thead className="bg-secondary/60">
            <tr>
              <SortTh label="Name" sortKey="name" sort={sort} />
              <SortTh label="Default category" sortKey="defaultCategory" sort={sort} />
              <SortTh label="Default edition" sortKey="defaultEdition" sort={sort} />
              <SortTh label="Default manufacturer" sortKey="defaultManufacturer" sort={sort} />
              <SortTh label="Parent" sortKey="parent" sort={sort} />
              <SortTh label="Created at" sortKey="createdAt" sort={sort} />
              <SortTh label="Updated at" sortKey="updatedAt" sort={sort} />
              <SortTh label="Created by" sortKey="createdBy" sort={sort} />
              <SortTh label="Updated by" sortKey="updatedBy" sort={sort} />
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
                <Td>
                  <span className="text-[var(--sidebar-active-fg)]">{r.defaultCategory}</span>
                </Td>
                <Td>
                  {r.defaultEdition ? (
                    <span className="text-[var(--sidebar-active-fg)]">{r.defaultEdition}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </Td>
                <Td>
                  <span className="text-[var(--sidebar-active-fg)]">{r.defaultManufacturer}</span>
                </Td>
                <Td>
                  {r.parent ? (
                    <LinkText
                      onClick={() => {
                        const id = brandIdByName.get(r.parent!);
                        if (id) navigate({ to: "/codification/brands/$brandId", params: { brandId: id } });
                      }}
                    >
                      {r.parent}
                    </LinkText>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </Td>
                <Td className="whitespace-nowrap text-muted-foreground">{r.createdAt}</Td>
                <Td className="whitespace-nowrap text-muted-foreground">{r.updatedAt}</Td>
                <Td>
                  <UserCell email={r.createdBy ?? "ecometry@shalion.com"} />
                </Td>
                <Td>
                  <UserCell email={r.updatedBy ?? "ecometry@shalion.com"} />
                </Td>
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

        <BrandsPagination shown={sorted.length} total={BRANDS_TOTAL} pages={BRANDS_PAGES} />
      </div>
    </AppShell>
  );
}

/** Footer matching the console (Rows per page · 1–N of TOTAL · page chips). */
function BrandsPagination({ shown, total, pages }: { shown: number; total: number; pages: number }) {
  const upper = Math.min(shown, 100);
  return (
    <div className="flex items-center justify-end gap-5 border-t border-border px-6 py-3 text-sm text-muted-foreground">
      <span className="flex items-center gap-2">
        Rows per page:
        <span className="rounded border border-border px-2 py-0.5 text-foreground">100</span>
      </span>
      <span>
        1–{upper} of {total.toLocaleString("en-US")}
      </span>
      <div className="flex items-center gap-1">
        <button className="rounded p-1 hover:bg-secondary" aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={cn(
              "grid h-6 min-w-6 place-items-center rounded px-1 text-xs",
              n === 1 ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary",
            )}
          >
            {n}
          </span>
        ))}
        <span className="px-1">…</span>
        <span className="grid h-6 min-w-6 place-items-center rounded px-1 text-xs text-muted-foreground">{pages}</span>
        <button className="rounded p-1 hover:bg-secondary" aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
