"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  subtext?: string;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-white/5 border-white/10",
  success: "bg-green-500/10 border-green-500/20",
  warning: "bg-amber-500/10 border-amber-500/20",
  danger: "bg-red-500/10 border-red-500/20",
};

const textVariantStyles: Record<string, string> = {
  default: "text-primary",
  success: "text-green-600 dark:text-green-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
};

const iconVariantStyles: Record<string, string> = {
  default: "text-primary bg-primary/10",
  success: "text-green-600 dark:text-green-400 bg-green-500/20",
  warning: "text-amber-600 dark:text-amber-400 bg-amber-500/20",
  danger: "text-red-600 dark:text-red-400 bg-red-500/20",
};

/**
 * StatsCard Component
 * Displays a single stat with icon, label, and optional subtext
 * Supports multiple visual variants
 */
export function StatsCard({
  label,
  value,
  icon,
  subtext,
  variant = "default",
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-[1.5rem] p-6 relative overflow-hidden",
        "border border-white/10 shadow-lg",
        variantStyles[variant],
        "transition-all hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p
            className={cn(
              "text-4xl font-extrabold tracking-tight",
              textVariantStyles[variant],
            )}
          >
            {value}
          </p>
        </div>
        
        {icon && (
          <div
            className={cn(
              "flex items-center justify-center h-12 w-12 rounded-2xl",
              iconVariantStyles[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {subtext && (
        <p className="text-sm text-muted-foreground mt-4 font-medium">{subtext}</p>
      )}

      {/* Decorative gradient blur */}
      <div className={cn(
        "absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none",
        iconVariantStyles[variant]
      )} />
    </div>
  );
}
