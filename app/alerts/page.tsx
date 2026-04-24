"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchProducts } from "@/store/productSlice";
import { useWarehouse } from "@/context/WarehouseContext";
import { Product } from "@/types/inventory";
import { LowStockAlert } from "@/components/LowStockAlert";
import { StockMovementForm } from "@/components/StockMovementForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AlertsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);
  const status = useAppSelector((state) => state.products.status);
  const { lowStockThresholdOverride } = useWarehouse();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts(undefined));
    }
  }, [dispatch, status]);

  const { outOfStock, lowStock } = useMemo(() => {
    const thresholdFor = (product: Product) =>
      lowStockThresholdOverride ?? product.minStockLevel;

    const out = products.filter((product) => product.quantity === 0);
    const low = products.filter(
      (product) =>
        product.quantity > 0 && product.quantity <= thresholdFor(product),
    );

    return { outOfStock: out, lowStock: low };
  }, [lowStockThresholdOverride, products]);

  const hasAlerts = outOfStock.length > 0 || lowStock.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Inventory Alerts</h1>
        <p className="text-muted-foreground">Out-of-stock and low-stock products</p>
      </div>

      {status === "loading" && (
        <div className="glass rounded-lg p-6 text-sm text-muted-foreground">
          Loading alerts...
        </div>
      )}

      {status !== "loading" && !hasAlerts && (
        <div className="glass rounded-lg p-12 border border-white/10 text-center">
          <div className="text-5xl mb-3">📦</div>
          <h2 className="text-xl font-semibold text-foreground">No alerts right now</h2>
          <p className="text-sm text-muted-foreground mt-1">All products are above minimum stock levels.</p>
        </div>
      )}

      {outOfStock.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Out of Stock</h2>
          {outOfStock.map((product) => (
            <LowStockAlert
              key={product.id}
              product={product}
              onRestock={setSelectedProduct}
            />
          ))}
        </section>
      )}

      {lowStock.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">Low Stock</h2>
          {lowStock.map((product) => (
            <LowStockAlert
              key={product.id}
              product={product}
              onRestock={setSelectedProduct}
            />
          ))}
        </section>
      )}

      <Dialog
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <StockMovementForm
              product={selectedProduct}
              onSuccess={() => {
                setSelectedProduct(null);
                dispatch(fetchProducts(undefined));
              }}
              onCancel={() => setSelectedProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
