"use client";

import { Product } from "@/types/inventory";
import { useStockMovement } from "@/hooks/useStockMovement";
import { cn } from "@/lib/utils";

interface StockMovementFormProps {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
  className?: string;
}

export function StockMovementForm({
  product,
  onSuccess,
  onCancel,
  className,
}: StockMovementFormProps) {
  const {
    movementType,
    setMovementType,
    quantity,
    setQuantity,
    note,
    setNote,
    canSubmit,
    submit,
    isSubmitting,
    currentQuantity,
    previewQuantity,
    error,
  } = useStockMovement(product.id);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = await submit();
    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("glass rounded-lg p-6 space-y-4", className)}>
      <div className="mb-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Product</p>
        <p className="font-semibold text-foreground">{product.name}</p>
        <p className="text-sm text-muted-foreground">{product.sku}</p>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Movement Type</legend>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(["restock", "sale", "adjustment", "return"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMovementType(type)}
              className={cn(
                "px-3 py-2 rounded-lg border text-sm capitalize",
                movementType === type
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white/5 border-white/20 hover:bg-white/10",
              )}
              disabled={isSubmitting}
            >
              {type}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value, 10) || 0))}
          className="glass-input w-full rounded px-3 py-2"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="glass-input w-full rounded px-3 py-2 resize-none"
          disabled={isSubmitting}
        />
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm">
        Current: <span className="font-semibold">{currentQuantity}</span> → New:{" "}
        <span className="font-semibold">{previewQuantity}</span>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="btn-glass px-4 py-2 rounded-lg" disabled={isSubmitting}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className={cn(
            "btn-glass btn-glassPrimary px-4 py-2 rounded-lg text-white",
            (!canSubmit || isSubmitting) && "opacity-60 cursor-not-allowed",
          )}
        >
          {isSubmitting ? "Recording..." : "Record Movement"}
        </button>
      </div>
    </form>
  );
}
