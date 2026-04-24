"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Product, ProductCategory } from "@/types/inventory";
import { cn } from "@/lib/utils";

const CATEGORIES: ProductCategory[] = [
  "electronics",
  "clothing",
  "food",
  "furniture",
  "tools",
  "stationery",
  "other",
];

interface FormData {
  sku: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: string;
  costPrice: string;
  quantity: string;
  minStockLevel: string;
  unit: string;
  supplier: string;
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${id}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load product");
        }

        const payload = (await response.json()) as { data: Product };
        const product = payload.data;

        setFormData({
          sku: product.sku,
          name: product.name,
          category: product.category,
          description: product.description,
          price: String(product.price),
          costPrice: String(product.costPrice),
          quantity: String(product.quantity),
          minStockLevel: String(product.minStockLevel),
          unit: product.unit,
          supplier: product.supplier || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      }
    }

    loadProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: formData.sku,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          price: parseInt(formData.price, 10),
          costPrice: parseInt(formData.costPrice, 10),
          quantity: parseInt(formData.quantity, 10),
          minStockLevel: parseInt(formData.minStockLevel, 10),
          unit: formData.unit,
          supplier: formData.supplier,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Failed to update product");
      }

      router.push(`/products/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) {
    return <p className="text-muted-foreground">Loading product...</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <Link href={`/products/${id}`} className="text-sm underline text-muted-foreground">
          Back to details
        </Link>
      </div>

      {error && (
        <div className={cn("glass rounded-lg p-4 border border-red-500/30 bg-red-500/10")}>{error}</div>
      )}

      <form onSubmit={handleSubmit} className="glass rounded-lg p-6 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="sku" value={formData.sku} onChange={handleChange} className="glass-input rounded-lg px-3 py-2" placeholder="SKU" />
          <input name="name" value={formData.name} onChange={handleChange} className="glass-input rounded-lg px-3 py-2" placeholder="Name" />
        </div>

        <select name="category" value={formData.category} onChange={handleChange} className="glass-input rounded-lg px-3 py-2 w-full">
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <textarea name="description" value={formData.description} onChange={handleChange} className="glass-input rounded-lg px-3 py-2 w-full" rows={3} placeholder="Description" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input name="price" type="number" value={formData.price} onChange={handleChange} className="glass-input rounded-lg px-3 py-2" placeholder="Price (cents)" min={1} />
          <input name="costPrice" type="number" value={formData.costPrice} onChange={handleChange} className="glass-input rounded-lg px-3 py-2" placeholder="Cost Price (cents)" min={1} />
          <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} className="glass-input rounded-lg px-3 py-2" placeholder="Quantity" min={0} />
          <input name="minStockLevel" type="number" value={formData.minStockLevel} onChange={handleChange} className="glass-input rounded-lg px-3 py-2" placeholder="Min Stock" min={0} />
          <input name="unit" value={formData.unit} onChange={handleChange} className="glass-input rounded-lg px-3 py-2" placeholder="Unit" />
          <input name="supplier" value={formData.supplier} onChange={handleChange} className="glass-input rounded-lg px-3 py-2" placeholder="Supplier" />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-glass btn-glassPrimary px-5 py-2 rounded-lg">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
