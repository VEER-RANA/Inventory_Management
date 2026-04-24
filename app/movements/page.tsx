import { headers } from "next/headers";
import { MovementsPageClient } from "@/components/MovementsPageClient";
import { StockMovement, Product } from "@/types/inventory";
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface MovementsPageProps {
  searchParams: Promise<{
    productId?: string;
    limit?: string;
  }>;
}

export default async function MovementsPage({ searchParams }: MovementsPageProps) {
  const params = await searchParams;
  const queryParams = new URLSearchParams();
  if (params.productId) queryParams.set("productId", params.productId);
  if (params.limit) queryParams.set("limit", params.limit);

  let movements: StockMovement[] = [];
  let products: Product[] = [];
  let error: string | null = null;

  try {
    const hdrs = await headers();
    const host = hdrs.get("host");
    const proto = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = host ? `${proto}://${host}` : "http://localhost:3000";

    const [movementsRes, productsRes] = await Promise.all([
      fetch(`${baseUrl}/api/movements?${queryParams.toString()}`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/products`, {
        cache: "no-store",
      }),
    ]);

    if (!movementsRes.ok) {
      throw new Error("Failed to fetch movements");
    }

    const movementsData = (await movementsRes.json()) as { data?: StockMovement[] };
    movements = movementsData.data || [];

    if (productsRes.ok) {
      const productsData = (await productsRes.json()) as { data?: Product[] };
      products = productsData.data || [];
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch data";
  }

  return (
    <MovementsPageClient
      movements={movements}
      products={products}
      productId={params.productId}
      error={error}
    />
  );
}
