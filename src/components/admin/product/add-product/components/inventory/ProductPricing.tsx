"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProductData, ProductVariant } from "@/api/product";

export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

interface ProductVariantsPricingProps {
  formData: ProductData;
  handleChange: <K extends keyof ProductData>(
    key: K,
    value: ProductData[K]
  ) => void;
}

export default function ProductVariantsPricing({
  formData,
  handleChange,
}: ProductVariantsPricingProps) {
  const variants = formData.variants || [];

  const updateVariant = (index: number, updates: Partial<ProductVariant>) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], ...updates };
    handleChange("variants", newVariants);
  };

  if (variants.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 text-center text-muted-foreground">
          Select colors and/or sizes in the Attributes section to generate
          variants.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Variants Pricing & Stock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-4 bg-muted/30"
          >
            {/* Variant Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {variant.color && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: variant.hex || "#000" }}
                    />
                    <span>{variant.color}</span>
                  </div>
                )}
                {variant.size && (
                  <Badge variant="outline">{variant.size}</Badge>
                )}
              </div>
              <Badge variant="secondary">Variant #{index + 1}</Badge>
            </div>

            {/* SKU */}
            <div className="flex flex-col gap-2">
              <Label htmlFor={`sku-${index}`}>SKU</Label>
              <Input
                id={`sku-${index}`}
                value={variant.sku}
                onChange={(e) => updateVariant(index, { sku: e.target.value })}
                placeholder="Auto-generated SKU"
              />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`regular-${index}`}>Regular Price</Label>
                <Input
                  id={`regular-${index}`}
                  type="text"
                  value={usdFormatter.format(
                    parseInt(variant.regularPrice || "0", 10)
                  )}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\d]/g, "");
                    const num = cleaned ? parseInt(cleaned, 10) : 0;
                    updateVariant(index, { regularPrice: num.toString() });
                  }}
                  placeholder="$0"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={`discount-${index}`}>Discount Price</Label>
                <Input
                  id={`discount-${index}`}
                  type="text"
                  value={usdFormatter.format(
                    parseInt(variant.discountPrice || "0", 10)
                  )}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\d]/g, "");
                    let num = cleaned ? parseInt(cleaned, 10) : 0;
                    const regular = parseInt(variant.regularPrice || "0", 10);
                    if (num > regular) num = regular;
                    updateVariant(index, { discountPrice: num.toString() });
                  }}
                  placeholder="$0"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="flex flex-col gap-2">
              <Label htmlFor={`stock-${index}`}>Stock Quantity</Label>
              <Input
                id={`stock-${index}`}
                type="number"
                min={0}
                value={variant.stock ?? 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  updateVariant(index, { stock: val });
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
