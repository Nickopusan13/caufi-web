"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ProductData } from "@/api/product";
import { useState } from "react";

interface ProductStockProps {
  formData: Pick<ProductData, "stock" | "stockType">;
  handleChange: <K extends keyof ProductData>(
    key: K,
    value: ProductData[K]
  ) => void;
}

const stockTypeOptions = [
  { value: "units", label: "Units (pcs)" },
  { value: "kg", label: "Kilograms" },
  { value: "meters", label: "Meters" },
  { value: "liters", label: "Liters" },
  { value: "boxes", label: "Boxes" },
] as const;

export default function ProductStock({
  formData,
  handleChange,
}: ProductStockProps) {
  // Local state for clean input handling
  const [stockInput, setStockInput] = useState<string>(
    formData.stock.toString()
  );

  const handleStockChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    const value = cleaned === "" ? 0 : parseInt(cleaned, 10);
    setStockInput(cleaned);
    handleChange("stock", value);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="product-stock">Stock Quantity</Label>
        <Input
          id="product-stock"
          required
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          min={0}
          value={stockInput}
          onChange={(e) => handleStockChange(e.target.value)}
          className="text-right"
          placeholder="0"
        />
        <p className="text-xs text-muted-foreground">
          Enter the current available stock (whole numbers only)
        </p>
      </div>

      {/* Stock Type */}
      <div className="flex flex-col gap-2">
        <Label>Stock Type</Label>
        <RadioGroup
          value={formData.stockType || "units"}
          onValueChange={(value) =>
            handleChange("stockType", value as ProductData["stockType"])
          }
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {stockTypeOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`stock-type-${option.value}`}
              />
              <Label
                htmlFor={`stock-type-${option.value}`}
                className="text-sm font-medium cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Stock Info */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Current Stock:</span>
          <span className="font-medium">
            {formData.stock.toLocaleString()} {formData.stockType || "units"}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Last Restocked:</span>
          <span className="text-muted-foreground">
            {/* Replace with real data from your API */}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
