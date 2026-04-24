"use client";

import { useMemo } from "react";
import { Product } from "@/types/inventory";
import { useWarehouse } from "@/context/WarehouseContext";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopValueChartProps {
  products: Product[];
  className?: string;
}

export function TopValueChart({ products, className }: TopValueChartProps) {
  const { formatPrice } = useWarehouse();

  const data = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.price * b.quantity - a.price * a.quantity)
        .slice(0, 5)
        .map((product) => ({
          name: product.name,
          value: product.price * product.quantity,
        })),
    [products],
  );

  return (
    <div className={`glass rounded-lg p-6 ${className || ""}`}>
      <h3 className="text-lg font-semibold text-foreground mb-1">Top Inventory Value</h3>
      <p className="text-sm text-muted-foreground mb-4">Top 5 products by value</p>
      {data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-sm text-muted-foreground">No value data</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis tickFormatter={(value) => formatPrice(Number(value))} />
            <Tooltip formatter={(value) => formatPrice(Number(value))} />
            <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
