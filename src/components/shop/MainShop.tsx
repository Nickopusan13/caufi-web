"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, Filter } from "lucide-react";
import { useProducts } from "@/hooks/useProduct";
import ProductItem from "@/components/ProductItem";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const categoryList = [
  { name: "All Products", value: "" },
  { name: "Men", value: "Men" },
  { name: "Women", value: "Women" },
  { name: "Bag", value: "Bag" },
  { name: "Shoes", value: "Shoes" },
];

const sortOptions = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
  { label: "Best Selling", value: "bestselling" },
];

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";
  const priceRange = searchParams.get("price") || "0-500";
  const currentPage = Number(searchParams.get("page")) || 1;
  const [minPrice, maxPrice] = priceRange.split("-").map(Number);
  const [priceValue, setPriceValue] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  useEffect(() => {
    const [newMin, newMax] = priceRange.split("-").map(Number);
    setPriceValue([newMin, newMax]);
  }, [priceRange]);

  const updateFilters = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === "" || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const { data, isLoading } = useProducts({
    category: currentCategory || undefined,
    minPrice: priceValue[0] === 0 ? undefined : priceValue[0],
    maxPrice: priceValue[1] === 500 ? undefined : priceValue[1],
    // sort: currentSort || undefined,
    page: currentPage,
    limit: 20,
    onlyActive: true,
  });
  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;
  const categoryCounts = data?.categoryCounts ?? { "": 0 };
  const categories = categoryList.map((cat) => ({
    ...cat,
    count: categoryCounts[cat.value] ?? 0,
  }));
  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {categories.find((c) => c.value === currentCategory)?.name ||
                    "Shop"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat.value}>
                      <button
                        onClick={() => updateFilters({ category: cat.value })}
                        className={`w-full text-left flex justify-between items-center px-3 py-2 rounded-md transition ${
                          currentCategory === cat.value
                            ? "bg-black text-white"
                            : "hover:bg-zinc-950"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-sm opacity-70">
                          ({cat.count})
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Price Range</h3>
                <Slider
                  value={priceValue}
                  onValueChange={(value) =>
                    setPriceValue(value as [number, number])
                  }
                  onValueCommit={(value) => {
                    updateFilters({ price: `${value[0]}-${value[1]}` });
                  }}
                  max={500}
                  step={10}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceValue[0]}</span>
                  <span>${priceValue[1]}</span>
                </div>
              </div>
            </div>
          </aside>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">
                {currentCategory
                  ? categories.find((c) => c.value === currentCategory)?.name
                  : "All Products"}
              </h1>
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <div className="space-y-8 mt-8">
                      <div>
                        <h3 className="font-semibold text-lg mb-4">
                          Categories
                        </h3>
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() =>
                              updateFilters({ category: cat.value })
                            }
                            className={`block w-full text-left px-4 py-3 rounded-md mb-2 ${
                              currentCategory === cat.value
                                ? "bg-black text-white"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {cat.name} ({cat.count})
                          </button>
                        ))}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-4">
                          Price Range
                        </h3>
                        <Slider
                          value={priceValue}
                          onValueChange={(value) =>
                            setPriceValue(value as [number, number])
                          }
                          onValueCommit={(v) =>
                            updateFilters({ price: `${v[0]}-${v[1]}` })
                          }
                          max={500}
                          step={10}
                        />
                        <p className="text-center mt-3 text-sm">
                          ${priceValue[0]} – ${priceValue[1]}
                        </p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {sortOptions.find((o) => o.value === currentSort)
                        ?.label || "Sort by"}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => updateFilters({ sort: option.value })}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No products found. Try adjusting your filters.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <ProductItem cloths={products} />
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1)
                                updateFilters({ page: currentPage - 1 });
                            }}
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === i + 1}
                              onClick={(e) => {
                                e.preventDefault();
                                updateFilters({ page: i + 1 });
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages)
                                updateFilters({ page: currentPage + 1 });
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
