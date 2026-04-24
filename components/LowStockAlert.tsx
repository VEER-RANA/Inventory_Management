"use client";

import Link from "next/link";
import { Product } from "@/types/inventory";
import { cn } from "@/lib/utils";
import { AlertTriangle, OctagonAlert } from "lucide-react";

interface LowStockAlertProps {
  product: Product;
  onRestock?: (product: Product) => void;
  className?: string;
}

export function LowStockAlert({ product, onRestock, className }: LowStockAlertProps) {
  const outOfStock = product.quantity === 0;
  const Icon = outOfStock ? OctagonAlert : AlertTriangle;

  return (
    <div
      className={cn(
        "glass rounded-[1.5rem] p-5 border shadow-sm",
        "transition-all hover:shadow-md hover:-translate-y-0.5",
        outOfStock
          ? "border-red-500/30 bg-gradient-to-r from-red-500/10 to-transparent"
          : "border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center h-12 w-12 rounded-2xl shrink-0",
              outOfStock
                ? "bg-red-500/20 text-red-600 dark:text-red-400"
                : "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-foreground text-lg leading-none">{product.name}</h3>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  outOfStock
                    ? "bg-red-500/20 text-red-700 dark:text-red-300"
                    : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
                )}
              >
                {outOfStock ? "Out of Stock" : "Low Stock"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              SKU: <span className="font-medium">{product.sku}</span> &nbsp;&bull;&nbsp; 
              Qty: <span className={cn("font-bold", outOfStock ? "text-red-500" : "text-yellow-500")}>{product.quantity}</span> 
              <span className="text-muted-foreground/70"> / Min {product.minStockLevel}</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
          {onRestock ? (
            <button
              onClick={() => onRestock(product)}
              className="w-full sm:w-auto btn-glass btn-glassPrimary px-5 py-2.5 rounded-full text-sm font-semibold shadow-md"
            >
              Restock Item
            </button>
          ) : (
            <Link
              href="/movements"
              className="w-full sm:w-auto flex justify-center btn-glass btn-glassPrimary px-5 py-2.5 rounded-full text-sm font-semibold shadow-md"
            >
              Restock Item
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
