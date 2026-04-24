"use client";

import { useWarehouse, CurrencyCode } from "@/context/WarehouseContext";
import { cn } from "@/lib/utils";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Package } from "lucide-react";

interface WarehouseHeaderProps {
  className?: string;
}

/**
 * WarehouseHeader Component
 * Displays warehouse name and active currency
 * Shows warehouse configuration at top of layout
 */
export function WarehouseHeader({ className }: WarehouseHeaderProps) {
  const { warehouseName, currency, setCurrency } = useWarehouse();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as CurrencyCode);
  };

  return (
    <div
      className={cn(
        "glass border-b border-white/10",
        "px-4 md:px-6 py-4",
        "flex items-center justify-between gap-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/20 text-primary shadow-sm">
          <Package className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <div className="hidden md:flex flex-col">
          <h1 className="text-lg font-bold text-foreground">{warehouseName}</h1>
          <p className="text-xs text-muted-foreground">Currency: {currency}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={currency}
          onChange={handleCurrencyChange}
          className={cn(
            "text-sm font-medium",
            "bg-white/5 border border-white/10 rounded-xl px-2 py-1",
            "focus:outline-none focus:ring-2 focus:ring-primary",
            "text-foreground",
          )}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="INR">INR (₹)</option>
        </select>
        <ThemeToggleButton />
      </div>
    </div>
  );
}
