"use client";

import { useCallback, useMemo, useState } from "react";
import { Product, ProductCategory } from "@/types/inventory";
import { useAppDispatch } from "@/hooks/useRedux";
import { createProduct, editProduct } from "@/store/productSlice";

export interface ProductFormValues {
  sku: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  costPrice: number;
  quantity: number;
  minStockLevel: number;
  unit: string;
  supplier: string;
  imageUrl: string;
}

export interface ProductFormErrors {
  sku?: string;
  name?: string;
  price?: string;
  costPrice?: string;
  quantity?: string;
  minStockLevel?: string;
  submit?: string;
}

const SKU_PATTERN = /^[A-Z]+-\d+$/;

const getInitialValues = (initialValues?: Partial<Product>): ProductFormValues => ({
  sku: initialValues?.sku ?? "",
  name: initialValues?.name ?? "",
  category: initialValues?.category ?? "other",
  description: initialValues?.description ?? "",
  price: initialValues?.price ?? 0,
  costPrice: initialValues?.costPrice ?? 0,
  quantity: initialValues?.quantity ?? 0,
  minStockLevel: initialValues?.minStockLevel ?? 0,
  unit: initialValues?.unit ?? "pcs",
  supplier: initialValues?.supplier ?? "",
  imageUrl: initialValues?.imageUrl ?? "",
});

export function useProductForm(initialValues?: Partial<Product>) {
  const dispatch = useAppDispatch();

  const initial = useMemo(() => getInitialValues(initialValues), [initialValues]);
  const [values, setValues] = useState<ProductFormValues>(initial);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const validate = useCallback((nextValues: ProductFormValues): ProductFormErrors => {
    const nextErrors: ProductFormErrors = {};

    if (!nextValues.name.trim() || nextValues.name.trim().length < 2) {
      nextErrors.name = "Name is required and must be at least 2 characters";
    }

    if (!nextValues.sku.trim()) {
      nextErrors.sku = "SKU is required";
    } else if (!SKU_PATTERN.test(nextValues.sku.trim())) {
      nextErrors.sku = "SKU must match format like ELEC-001";
    }

    if (nextValues.price <= 0) {
      nextErrors.price = "Price must be a positive number";
    }

    if (nextValues.costPrice <= 0) {
      nextErrors.costPrice = "Cost price must be a positive number";
    }

    if (!Number.isInteger(nextValues.quantity) || nextValues.quantity < 0) {
      nextErrors.quantity = "Quantity must be a non-negative integer";
    }

    if (!Number.isInteger(nextValues.minStockLevel) || nextValues.minStockLevel < 0) {
      nextErrors.minStockLevel = "Min stock level must be a non-negative integer";
    }

    return nextErrors;
  }, []);

  const handleChange = useCallback(
    <K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined, submit: undefined }));
    },
    [],
  );

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return false;
    }

    const payload = {
      sku: values.sku.trim(),
      name: values.name.trim(),
      category: values.category,
      description: values.description.trim(),
      price: values.price,
      costPrice: values.costPrice,
      quantity: values.quantity,
      minStockLevel: values.minStockLevel,
      unit: values.unit.trim() || "pcs",
      supplier: values.supplier.trim() || undefined,
      imageUrl: values.imageUrl.trim() || undefined,
    };

    try {
      if (initialValues?.id) {
        await dispatch(editProduct({ id: initialValues.id, data: payload })).unwrap();
      } else {
        await dispatch(createProduct(payload)).unwrap();
      }
      return true;
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err instanceof Error ? err.message : "Failed to save product",
      }));
      return false;
    }
  }, [dispatch, initialValues?.id, validate, values]);

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
  }, [initial]);

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initial),
    [initial, values],
  );

  return {
    values,
    handleChange,
    errors,
    handleSubmit,
    reset,
    isDirty,
  };
}
