"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/inventory";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilter";
import { cn } from "@/lib/utils";

interface ProductsPageClientProps {
  initialProducts: Product[];
  error?: string | null;
  category?: string;
  lowStockOnly?: boolean;
}

export function ProductsPageClient({
  initialProducts,
  error,
  category,
  lowStockOnly,
}: ProductsPageClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Sync local state when server component passes new filtered products
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleEditProduct = (product: Product) => {
    router.push(`/products/${product.id}/edit`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete product");
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch {
      alert("Failed to delete product");
    }
  };

  const handleRecordMovement = (product: Product) => {
    router.push(`/movements/add?productId=${product.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="text-muted-foreground">
          Manage your inventory items and stock levels
        </p>
      </div>

      <ProductFilters />

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

      {products.length > 0 && (
        <div className="glass rounded-lg p-4 border border-white/10 bg-white/5">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{products.length}</span> product
            {products.length !== 1 ? "s" : ""}
            {category ? ` in category: ${category}` : ""}
            {lowStockOnly ? " (low stock only)" : ""}
          </p>
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onRecordMovement={handleRecordMovement}
            />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "glass rounded-lg p-12",
            "border border-white/10",
            "flex flex-col items-center justify-center gap-4",
            "text-center",
          )}
        >
          <div className="text-4xl">📦</div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No Products Found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Add your first product to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
