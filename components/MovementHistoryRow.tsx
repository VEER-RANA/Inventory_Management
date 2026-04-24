"use client";

import { StockMovement } from "@/types/inventory";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, RefreshCcw, PackageCheck } from "lucide-react";

interface MovementHistoryRowProps {
  movement: StockMovement;
  productName: string;
  className?: string;
}

const TYPE_STYLE: Record<StockMovement["type"], string> = {
  restock: "bg-green-500/20 text-green-700 dark:text-green-300",
  sale: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  adjustment: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  return: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
};

export function MovementHistoryRow({ movement, productName, className }: MovementHistoryRowProps) {
  const isPositive = movement.type === "restock" || movement.type === "return";
  const deltaSign = isPositive ? "+" : "-";
  const deltaColor = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  
  const Icon = movement.type === "restock" ? PackageCheck :
               movement.type === "sale" ? TrendingDown :
               movement.type === "return" ? TrendingUp : RefreshCcw;

  return (
    <div className={cn("glass rounded-[1.5rem] p-4 transition-all hover:bg-white/5 border border-white/10", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left Side: Icon & Product */}
        <div className="flex items-center gap-3 w-full sm:w-1/3">
          <div className={cn("flex items-center justify-center h-10 w-10 rounded-xl shrink-0", TYPE_STYLE[movement.type])}>
            <Icon className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate">{productName}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{movement.type}</span>
          </div>
        </div>

        {/* Middle: Quantities */}
        <div className="flex items-center gap-6 w-full sm:w-1/3 justify-between sm:justify-center">
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Previous</span>
            <span className="font-medium">{movement.previousQuantity}</span>
          </div>
          <div className="flex flex-col items-center bg-background/50 rounded-lg px-4 py-1 border border-white/5 shadow-sm">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Change</span>
            <span className={cn("font-bold text-sm", deltaColor)}>
              {deltaSign}{movement.quantity}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">New</span>
            <span className="font-medium text-foreground">{movement.newQuantity}</span>
          </div>
        </div>

        {/* Right Side: Note & Date */}
        <div className="flex flex-col items-end w-full sm:w-1/3 text-sm">
          <span className="font-medium text-foreground text-right">{new Date(movement.performedAt).toLocaleDateString()}</span>
          <span className="text-xs text-muted-foreground text-right">{new Date(movement.performedAt).toLocaleTimeString()}</span>
          {movement.note && (
            <span className="mt-1 text-xs text-muted-foreground italic truncate max-w-full">"{movement.note}"</span>
          )}
        </div>
        
      </div>
    </div>
  );
}
