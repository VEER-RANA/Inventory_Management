"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { ProductCategory } from "@/types/inventory";

interface CategoryDistributionChartProps {
  byCategory: Record<ProductCategory, number>;
  className?: string;
}

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  electronics: "#3b82f6",
  clothing: "#ec4899",
  food: "#f59e0b",
  furniture: "#8b5cf6",
  tools: "#14b8a6",
  stationery: "#6366f1",
  other: "#6b7280",
};

export function CategoryDistributionChart({ byCategory, className }: CategoryDistributionChartProps) {
  const data = (Object.keys(byCategory) as ProductCategory[])
    .map((key) => ({ key, name: key, value: byCategory[key] }))
    .filter((item) => item.value > 0);

  return (
    <div className={`glass rounded-lg p-6 ${className || ""}`}>
      <h3 className="text-lg font-semibold text-foreground mb-1">Category Distribution</h3>
      <p className="text-sm text-muted-foreground mb-4">Product count per category</p>
      {data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-sm text-muted-foreground">No category data</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={95}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={CATEGORY_COLORS[entry.key]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
