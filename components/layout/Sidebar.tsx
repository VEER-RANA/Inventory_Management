"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlertBadge } from "./AlertBadge";
import { useWarehouse } from "@/context/WarehouseContext";
import { LayoutDashboard, Package, PlusCircle, ArrowRightLeft, Bell } from "lucide-react";

interface SidebarProps {
  onNavClick?: () => void;
  className?: string;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
  },
  {
    label: "Add Product",
    href: "/add",
    icon: PlusCircle,
  },
  {
    label: "Movements",
    href: "/movements",
    icon: ArrowRightLeft,
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: Bell,
  },
];

const ROUTE_EXCLUSIONS: Record<string, string[]> = {
  "/products": ["/products/add"],
  "/movements": ["/movements/add"],
};

/**
 * Sidebar Component
 * Navigation menu for dashboard routes
 * Shows active route with visual indicator
 * Includes alert badge on Alerts link
 */
export function Sidebar({ onNavClick, className }: SidebarProps) {
  const pathname = usePathname();
  const { warehouseName } = useWarehouse();

  const isActive = (href: string) => {
    if (pathname === href) {
      return true;
    }

    const excludedRoutes = ROUTE_EXCLUSIONS[href] ?? [];
    if (excludedRoutes.some((route) => pathname.startsWith(route))) {
      return false;
    }

    return pathname.startsWith(`${href}/`);
  };

  return (
    <nav className={cn("flex flex-col gap-2 p-4", "h-full", className)}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-[1.5rem]",
              "transition-all duration-200",
              "text-sm font-medium",
              "relative group",
              active
                ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                : "text-muted-foreground hover:bg-white/5 border border-transparent hover:text-foreground",
            )}
          >
            <Icon 
              className={cn("h-5 w-5 transition-transform group-hover:scale-110", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} 
              strokeWidth={2.5} 
            />
            <span className="flex-1">{item.label}</span>
            {item.href === "/alerts" && <AlertBadge />}
          </Link>
        );
      })}
    </nav>
  );
}