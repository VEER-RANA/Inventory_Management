import { headers } from "next/headers";
import { Product, StockMovement, InventoryStats } from "@/types/inventory";
import type { ProductCategory } from "@/types/inventory";
import { StatsCard } from "@/components/StatsCard";
import { CategoryDistributionChart } from "@/components/CategoryDistributionChart";
import { TopValueChart } from "@/components/TopValueChart";
import { LowStockAlert } from "@/components/LowStockAlert";
import { MovementHistoryRow } from "@/components/MovementHistoryRow";

import { Package, CircleDollarSign, AlertTriangle, OctagonAlert } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  let products: Product[] = [];
  let stats: InventoryStats | null = null;
  let movements: StockMovement[] = [];

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https");
  const baseUrl = `${proto}://${host}`;

  try {
    const [productsRes, statsRes, movementsRes] = await Promise.all([
      fetch(`${baseUrl}/api/products`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/movements/stats`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/movements?limit=5`, { cache: "no-store" }),
    ]);

    if (productsRes.ok) {
      const payload = (await productsRes.json()) as { data?: Product[] };
      products = payload.data ?? [];
    }

    if (statsRes.ok) {
      const payload = (await statsRes.json()) as { data?: InventoryStats };
      stats = payload.data ?? null;
    }

    if (movementsRes.ok) {
      const payload = (await movementsRes.json()) as { data?: StockMovement[] };
      movements = payload.data ?? [];
    }
  } catch {
    // Keep resilient dashboard rendering.
  }

  // Compute stats from fetched data if stats endpoint failed
  const byCategory: Record<ProductCategory, number> = {
    electronics: 0,
    clothing: 0,
    food: 0,
    furniture: 0,
    tools: 0,
    stationery: 0,
    other: 0,
  };
  for (const p of products) {
    byCategory[p.category] += 1;
  }

  const computedStats: InventoryStats = stats ?? {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    lowStockCount: products.filter((p) => p.quantity <= p.minStockLevel).length,
    outOfStockCount: products.filter((p) => p.quantity === 0).length,
    byCategory,
    topByValue: [...products]
      .sort((a, b) => b.price * b.quantity - a.price * a.quantity)
      .slice(0, 5),
  };

  const lowStockProducts = products
    .filter((p) => p.quantity <= p.minStockLevel)
    .slice(0, 5);

  const productNameById = new Map(
    products.map((p) => [p.id, p.name]),
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Package className="h-6 w-6" />} label="Total Products" value={computedStats.totalProducts} />
        <StatsCard
          icon={<CircleDollarSign className="h-6 w-6" />}
          label="Total Inventory Value"
          value={`$${(computedStats.totalValue / 100).toFixed(2)}`}
        />
        <StatsCard
          icon={<AlertTriangle className="h-6 w-6" />}
          label="Low Stock Items"
          value={computedStats.lowStockCount}
          variant={computedStats.lowStockCount > 0 ? "warning" : "success"}
        />
        <StatsCard
          icon={<OctagonAlert className="h-6 w-6" />}
          label="Out of Stock Items"
          value={computedStats.outOfStockCount}
          variant={computedStats.outOfStockCount > 0 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistributionChart byCategory={computedStats.byCategory} />
        <TopValueChart products={computedStats.topByValue} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Low Stock Alerts</h2>
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No low stock alerts</p>
        ) : (
          lowStockProducts.map((product) => (
            <LowStockAlert key={product.id} product={product} />
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Recent Movements</h2>
        {movements.length === 0 ? (
          <p className="text-sm text-muted-foreground">No movements yet</p>
        ) : (
          movements.slice(0, 5).map((movement) => (
            <MovementHistoryRow
              key={movement.id}
              movement={movement}
              productName={productNameById.get(movement.productId) ?? "Unknown Product"}
            />
          ))
        )}
      </section>
    </div>
  );
}
