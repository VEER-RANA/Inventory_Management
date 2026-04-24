"use client";

import { PaginatedMovementList } from "@/components/PaginatedMovementList";
import { Product, StockMovement } from "@/types/inventory";
import { cn } from "@/lib/utils";

interface MovementsPageClientProps {
  movements: StockMovement[];
  products: Product[];
  productId?: string;
  error?: string | null;
}

export function MovementsPageClient({
  movements,
  products,
  productId,
  error,
}: MovementsPageClientProps) {
  const stats = {
    totalMovements: movements.length,
    restock: movements.filter((m) => m.type === "restock").length,
    sale: movements.filter((m) => m.type === "sale").length,
    adjustment: movements.filter((m) => m.type === "adjustment").length,
    return: movements.filter((m) => m.type === "return").length,
  };

  const productMap = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Stock Movements</h1>
        <p className="text-muted-foreground">
          Track all inventory movements and transactions
        </p>
      </div>

      {productId && (
        <div className="glass rounded-lg p-4 border border-white/10 bg-white/5">
          <p className="text-sm text-muted-foreground">
            Showing movements for product:{" "}
            <span className="font-semibold text-foreground">
              {productMap.get(productId)?.name || "Unknown Product"}
            </span>
          </p>
        </div>
      )}

      {error && (
        <div
          className={cn(
            "glass rounded-lg p-4",
            "border border-red-500/30 bg-red-500/10",
            "text-red-700 dark:text-red-300",
            "text-sm",
          )}
        >
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="glass rounded-lg p-4 border border-white/10 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.totalMovements}</p>
        </div>

        <div className="glass rounded-lg p-4 border border-green-500/20 bg-green-500/5 text-center">
          <p className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider">Restock</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.restock}</p>
        </div>

        <div className="glass rounded-lg p-4 border border-blue-500/20 bg-blue-500/5 text-center">
          <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">Sale</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.sale}</p>
        </div>

        <div className="glass rounded-lg p-4 border border-purple-500/20 bg-purple-500/5 text-center">
          <p className="text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">Returns</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.return}</p>
        </div>

        <div className="glass rounded-lg p-4 border border-orange-500/20 bg-orange-500/5 text-center">
          <p className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wider">Adjustments</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{stats.adjustment}</p>
        </div>
      </div>

      <PaginatedMovementList
        movements={movements}
        products={products}
        pageSize={10}
        emptyTitle="No Movements Yet"
        emptyDescription="Record your first stock movement to see history here"
      />
    </div>
  );
}
