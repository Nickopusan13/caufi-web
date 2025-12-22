"use client";

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo } from "react";

export default memo(function BasicInformation({
  formData,
  handleChange,
}: {
  formData: {
    name: string;
    productSummary: string;
    manufacturerName: string;
  };
  handleChange: (key: string, value: string) => void;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="product-name">Product Name:</Label>
              <Input
                required
                value={formData.name}
                autoComplete="off"
                onChange={(e) => handleChange("name", e.target.value)}
                type="text"
                id="product-name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="product-summary">Product Summary:</Label>
              <Input
                required
                value={formData.productSummary}
                autoComplete="off"
                onChange={(e) => handleChange("productSummary", e.target.value)}
                type="text"
                id="product-summary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="manufacturer-name">Manufacturer Name:</Label>
              <Input
                required
                value={formData.manufacturerName}
                autoComplete="off"
                onChange={(e) =>
                  handleChange("manufacturerName", e.target.value)
                }
                type="text"
                id="manufacturer-name"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
