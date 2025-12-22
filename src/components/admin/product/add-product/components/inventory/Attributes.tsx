"use client";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { motifs, materials, colors, size, categories } from "./Item"; // your static data
import type { ProductData, ProductVariant } from "@/api/product";

interface AttributesProps {
  formData: ProductData;
  handleChange: <K extends keyof ProductData>(
    key: K,
    value: ProductData[K]
  ) => void;
}

export default function Attributes({
  formData,
  handleChange,
}: AttributesProps) {
  // Helper to update variants when color/size changes
  const updateVariants = (
    newColors: { color: string; hex: string }[],
    newSizes: { size: string }[]
  ) => {
    const currentVariants = formData.variants || [];

    // Generate all combinations of selected colors + sizes
    const newVariants: ProductVariant[] = [];

    for (const color of newColors) {
      for (const sizeObj of newSizes) {
        const size = sizeObj.size;

        // Check if variant already exists (to preserve price/stock if edited)
        const existing = currentVariants.find(
          (v) => v.color === color.color && v.size === size
        );

        newVariants.push({
          id: existing?.id || 0, // keep server ID if exists
          regularPrice: existing?.regularPrice || "0",
          discountPrice: existing?.discountPrice || "0",
          size,
          stock: existing?.stock || 0,
          color: color.color,
          hex: color.hex,
          sku: existing?.sku || `SKU-${color.color}-${size}`.toUpperCase(),
        });
      }
    }

    // Also handle cases where only color or only size is selected
    if (newColors.length > 0 && newSizes.length === 0) {
      newColors.forEach((color) => {
        const existing = currentVariants.find(
          (v) => v.color === color.color && !v.size
        );
        newVariants.push({
          id: existing?.id || 0,
          regularPrice: existing?.regularPrice || "0",
          discountPrice: existing?.discountPrice || "0",
          size: undefined,
          stock: existing?.stock || 0,
          color: color.color,
          hex: color.hex,
          sku: existing?.sku || `SKU-${color.color}`.toUpperCase(),
        });
      });
    } else if (newSizes.length > 0 && newColors.length === 0) {
      newSizes.forEach((s) => {
        const existing = currentVariants.find(
          (v) => v.size === s.size && !v.color
        );
        newVariants.push({
          id: existing?.id || 0,
          regularPrice: existing?.regularPrice || "0",
          discountPrice: existing?.discountPrice || "0",
          size: s.size,
          stock: existing?.stock || 0,
          color: undefined,
          hex: undefined,
          sku: existing?.sku || `SKU-${s.size}`.toUpperCase(),
        });
      });
    }

    handleChange("variants", newVariants);
  };

  // Selected colors
  const selectedColors = formData.variants
    .filter((v) => v.color)
    .map((v) => ({ color: v.color!, hex: v.hex! }));

  // Selected sizes
  const selectedSizes = formData.variants
    .filter((v) => v.size)
    .map((v) => ({ size: v.size! }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Motif - Single Select */}
      <div className="flex flex-col gap-2">
        <Label>Motif</Label>
        <Select
          value={formData.motif || ""}
          onValueChange={(val) => handleChange("motif", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Motif" />
          </SelectTrigger>
          <SelectContent>
            {motifs.map((motif) => (
              <SelectItem key={motif} value={motif}>
                {motif}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category - Single Select */}
      <div className="flex flex-col gap-2">
        <Label>Category</Label>
        <Select
          value={formData.category || ""}
          onValueChange={(val) => handleChange("category", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Materials - Multi Checkbox */}
      <div className="flex flex-col gap-2">
        <Label>Materials</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between w-full">
              {formData.materials?.length > 0
                ? formData.materials.map((m) => m.material).join(", ")
                : "Select Materials"}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-h-60 overflow-auto p-2">
            {materials.map((material) => (
              <label
                key={material}
                className="flex items-center gap-2 p-2 hover:bg-zinc-100 cursor-pointer rounded"
              >
                <Checkbox
                  checked={formData.materials?.some(
                    (m) => m.material === material
                  )}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...(formData.materials || []), { material }]
                      : (formData.materials || []).filter(
                          (m) => m.material !== material
                        );
                    handleChange("materials", updated);
                  }}
                />
                <span>{material}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Colors - Multi Checkbox with Color Preview */}
      <div className="flex flex-col gap-2">
        <Label>Colors</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between w-full">
              {selectedColors.length > 0
                ? selectedColors.map((c) => c.color).join(", ")
                : "Select Colors"}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-h-60 overflow-auto p-2">
            {colors.map((color) => (
              <label
                key={color.color}
                className="flex items-center justify-between gap-2 p-2 hover:bg-zinc-100 cursor-pointer rounded"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedColors.some(
                      (c) => c.color === color.color
                    )}
                    onCheckedChange={(checked) => {
                      const newColors = checked
                        ? [
                            ...selectedColors,
                            { color: color.color, hex: color.hex },
                          ]
                        : selectedColors.filter((c) => c.color !== color.color);
                      updateVariants(newColors, selectedSizes);
                    }}
                  />
                  <span>{color.color}</span>
                </div>
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color.hex }}
                />
              </label>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Sizes - Multi Checkbox */}
      <div className="flex flex-col gap-2 md:col-span-2">
        <Label>Sizes</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between w-full">
              {selectedSizes.length > 0
                ? selectedSizes.map((s) => s.size).join(", ")
                : "Select Sizes"}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-h-60 overflow-auto p-2">
            {size.map((s) => (
              <label
                key={s}
                className="flex items-center gap-2 p-2 hover:bg-zinc-100 cursor-pointer rounded"
              >
                <Checkbox
                  checked={selectedSizes.some((sz) => sz.size === s)}
                  onCheckedChange={(checked) => {
                    const newSizes = checked
                      ? [...selectedSizes, { size: s }]
                      : selectedSizes.filter((sz) => sz.size !== s);
                    updateVariants(selectedColors, newSizes);
                  }}
                />
                <span>{s}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Note: You can add a separate Variants table/editor later to edit price/stock/SKU */}
    </div>
  );
}
