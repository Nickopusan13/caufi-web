"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import type { ProductData } from "@/api/product"; // or "@/utils/api" if ProductCreate is there

const shippingOptions = [
  {
    title: "Delivered by Vendor",
    desc: "You’ll be responsible for product delivery. Any damage or delay during shipping may cost you a Damage fee.",
    value: "Vendor",
  },
  {
    title: "Delivered by Caufi",
    desc: "Your product, Our responsibility. For a measly fee, we will handle the delivery process for you.",
    value: "Caufi",
  },
] as const;

interface ShippingProps {
  formData: Pick<ProductData, "shippingType">;
  handleChange: <K extends keyof ProductData>(
    key: K,
    value: ProductData[K]
  ) => void;
}

export default function Shipping({ formData, handleChange }: ShippingProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-sm font-semibold text-foreground">Shipping Type</h2>

        <RadioGroup
          value={formData.shippingType || ""}
          onValueChange={(value) =>
            handleChange("shippingType", value as ProductData["shippingType"])
          }
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {shippingOptions.map((option) => (
            <Tooltip key={option.value}>
              <TooltipTrigger asChild>
                <div
                  className={`relative flex flex-col gap-2 rounded-lg border p-4 transition-all hover:border-primary hover:shadow-sm cursor-pointer ${
                    formData.shippingType === option.value
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={option.value}
                      id={`shipping-${option.value}`}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={`shipping-${option.value}`}
                      className="font-medium leading-none cursor-pointer"
                    >
                      {option.title}
                    </Label>
                  </div>

                  <p className="text-sm text-muted-foreground pl-7">
                    {option.desc}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{option.desc}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </RadioGroup>
      </div>
    </TooltipProvider>
  );
}
