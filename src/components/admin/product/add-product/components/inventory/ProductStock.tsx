"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import type { ProductData } from "@/api/product";

interface ProductStockProps {
  formData: Pick<ProductData, "stock" | "stockType">;
  handleChange: <K extends keyof ProductData>(
    key: K,
    value: ProductData[K]
  ) => void;
}

const stockTypes = [
  { value: "units", label: "Units" },
  { value: "kg", label: "Kilograms" },
  { value: "meters", label: "Meters" },
  { value: "pieces", label: "Pieces" },
  { value: "liters", label: "Liters" },
  // Add more as needed
] as const;

export default function ProductStock({
  formData,
  handleChange,
}: ProductStockProps) {
  const [currentStockInput, setCurrentStockInput] = useState<string>(
    formData.stock.toString()
  );
  const handleStockChange = (rawValue: string) => {
    const cleaned = rawValue.replace(/[^\d]/g, "").slice(0, 10);
    const numericValue = cleaned === "" ? 0 : parseInt(cleaned, 10);
    setCurrentStockInput(cleaned);
    handleChange("stock", numericValue);
  };
  const handleStockTypeChange = (value: string) => {
    handleChange("stockType", value as ProductData["stockType"]);
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
          placeholder="0"
          value={currentStockInput}
          onChange={(e) => handleStockChange(e.target.value)}
          className="text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <p className="text-xs text-muted-foreground">
          Enter the current stock amount (non-negative numbers only)
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Stock Type</Label>
        <RadioGroup
          value={formData.stockType || ""}
          onValueChange={handleStockTypeChange}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"
        >
          {stockTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={type.value}
                id={`stock-type-${type.value}`}
              />
              <Label
                htmlFor={`stock-type-${type.value}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2 text-sm border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Current Stock:</span>
          <span className="font-semibold">
            {formData.stock.toLocaleString()} {formData.stockType || "units"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Available:</span>
          <span className="font-semibold text-green-600">
            {formData.stock.toLocaleString()} {formData.stockType || "units"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Last Updated:</span>
          <span className="text-xs opacity-70">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
