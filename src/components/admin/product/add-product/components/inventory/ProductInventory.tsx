"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { memo } from "react";
import { settings } from "./Item";
import Attributes from "./Attributes";
import ProductStock from "./ProductStock";
import ProductVariantsPricing from "./ProductPricing";
import Shipping from "./Shipping";
import type { ProductData } from "@/api/product";
import { useState } from "react";

interface InventoryProps {
  formData: ProductData;
  handleChange: <K extends keyof ProductData>(
    key: K,
    value: ProductData[K]
  ) => void;
}

export default memo(function ProductInventory({
  formData,
  handleChange,
}: InventoryProps) {
  const [activeTab, setActiveTab] = useState<string>("Attributes");

  const renderContent = () => {
    switch (activeTab) {
      case "Attributes":
        return <Attributes formData={formData} handleChange={handleChange} />;
      case "Stock":
        return <ProductStock formData={formData} handleChange={handleChange} />;
      case "Pricing":
        return (
          <ProductVariantsPricing
            formData={formData}
            handleChange={handleChange}
          />
        );
      case "Shipping":
        return <Shipping formData={formData} handleChange={handleChange} />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Select a section
          </div>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>
          Manage stock, pricing, shipping, and attributes
        </CardDescription>
      </CardHeader>

      <CardContent className="flex h-[500px] overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-48 border-r border-border flex flex-col">
          {settings.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveTab(item.title)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50
                ${
                  activeTab === item.title
                    ? "bg-muted/70 border-r-2 border-primary"
                    : "text-muted-foreground"
                }
              `}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
      </CardContent>
    </Card>
  );
});
