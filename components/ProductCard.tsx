"use client";

import { Product } from "@/types/inventory";
import { useWarehouse } from "@/context/WarehouseContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onRecordMovement: (product: Product) => void;
  className?: string;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onRecordMovement,
  className,
}: ProductCardProps) {
  const { formatPrice } = useWarehouse();

  const maxForIndicator = Math.max(product.minStockLevel * 3, 1);
  const indicatorPercent = Math.min(100, (product.quantity / maxForIndicator) * 100);

  const stockColor =
    product.quantity <= product.minStockLevel
      ? "bg-red-500"
      : product.quantity <= product.minStockLevel * 2
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className={cn("glass rounded-lg p-5 border border-white/10 space-y-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.sku}</p>
          <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20 capitalize">
          {product.category}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Stock Level</span>
          <span className="font-semibold text-foreground">{product.quantity}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
          <div className={cn("h-full transition-all", stockColor)} style={{ width: `${indicatorPercent}%` }} />
        </div>
      </div>

      {product.quantity <= product.minStockLevel && (
        <div className="text-xs font-semibold text-red-600 dark:text-red-400">⚠ Low Stock</div>
      )}

      <div className="space-y-1 text-sm">
        <p>
          <span className="text-muted-foreground">Price:</span>{" "}
          <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Supplier:</span>{" "}
          <span className="text-foreground">{product.supplier || "N/A"}</span>
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="btn-glass w-full py-2 rounded-lg text-sm font-medium">
            Actions
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(product)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(product.id)}>Delete</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRecordMovement(product)}>
            Record Movement
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
