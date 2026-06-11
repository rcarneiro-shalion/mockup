import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClientSkuEditPage } from "@/components/product/ClientSkuEditPage";
import {
  getClientSkus,
  getClientSkuRegions,
  type ClientSku,
} from "@/lib/clientSkus";

export const Route = createFileRoute("/product/client-skus/$skuId")({
  head: () => ({ meta: [{ title: "Client SKU — Shalion" }] }),
  component: ClientSkuDetailRoute,
});

/** Resolve a row from either dataset into the shape the edit form expects. */
function resolveSku(skuId: string): Partial<ClientSku> | undefined {
  if (skuId === "new") return undefined;
  const direct = getClientSkus().find((s) => s.id === skuId);
  if (direct) return direct;
  // Region-tab rows carry less detail — map what we have onto the SKU shape.
  const region = getClientSkuRegions().find((r) => r.id === skuId);
  if (region) {
    return {
      id: region.id,
      title: region.title,
      client: region.client,
      country: region.country,
      hero: region.hero,
      codes: [],
      brand: "",
      category: "",
      businessUnit: region.businessUnit,
      clientCategory: region.clientCategory,
    };
  }
  return undefined;
}

function ClientSkuDetailRoute() {
  const { skuId } = Route.useParams();
  const navigate = useNavigate();
  const sku = resolveSku(skuId);
  return (
    <ClientSkuEditPage
      sku={sku}
      isNew={skuId === "new"}
      onBack={() => navigate({ to: "/product/client-skus" })}
    />
  );
}
