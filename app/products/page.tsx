import { headers } from "next/headers";
import { Product } from "@/types/inventory";
import { ProductsPageClient } from "@/components/ProductsPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    lowStockOnly?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.set("search", params.search);
  if (params.category) queryParams.set("category", params.category);
  if (params.minPrice) queryParams.set("minPrice", params.minPrice);
  if (params.maxPrice) queryParams.set("maxPrice", params.maxPrice);
  if (params.lowStockOnly) queryParams.set("lowStockOnly", params.lowStockOnly);
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);

  let products: Product[] = [];
  let error: string | null = null;

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https");
  const baseUrl = `${proto}://${host}`;

  try {
    const response = await fetch(
      `${baseUrl}/api/products?${queryParams.toString()}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = (await response.json()) as { data?: Product[] };
    products = data.data ?? [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch products";
  }

  return (
    <ProductsPageClient
      initialProducts={products}
      error={error}
      category={params.category}
      lowStockOnly={params.lowStockOnly === "true"}
    />
  );
}
