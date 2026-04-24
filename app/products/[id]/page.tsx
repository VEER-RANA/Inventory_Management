import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, StockMovement } from "@/types/inventory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https");
  const baseUrl = `${proto}://${host}`;

  const [productRes, movementRes] = await Promise.all([
    fetch(`${baseUrl}/api/products/${id}`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/movements?productId=${id}&limit=20`, { cache: "no-store" }),
  ]);

  if (!productRes.ok) {
    notFound();
  }

  const productPayload = (await productRes.json()) as { data: Product };
  const movementsPayload = movementRes.ok
    ? ((await movementRes.json()) as { data?: StockMovement[] })
    : { data: [] as StockMovement[] };

  const product = productPayload.data;
  const movements = movementsPayload.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
          <p className="text-muted-foreground">SKU: {product.sku}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/products/${product.id}/edit`}>Edit Product</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Current inventory information</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Category</p>
            <Badge variant="secondary">{product.category}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Unit</p>
            <p>{product.unit}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Price (cents)</p>
            <p>{product.price}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cost Price (cents)</p>
            <p>{product.costPrice}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Quantity</p>
            <p>{product.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Min Stock Level</p>
            <p>{product.minStockLevel}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Supplier</p>
            <p>{product.supplier || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <p>{new Date(product.updatedAt).toLocaleString()}</p>
          </div>
          {product.description && (
            <div className="md:col-span-2">
              <p className="text-xs text-muted-foreground">Description</p>
              <p>{product.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movement History</CardTitle>
          <CardDescription>Latest stock updates for this product</CardDescription>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No stock movements recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {movements.map((movement) => (
                <div key={movement.id} className="glass rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="font-medium capitalize">{movement.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(movement.performedAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {movement.previousQuantity} → {movement.newQuantity} (qty: {movement.quantity})
                  </p>
                  {movement.note && (
                    <p className="text-sm mt-1">Note: {movement.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
