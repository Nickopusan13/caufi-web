// app/cart/page.tsx or components/ProductCart.tsx
"use client";

import { useGetCart, useDeleteCart, useUpdateUserCart } from "@/hooks/useCart";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import EmptyCart from "./EmptyCart";

const MotionCard = motion.create(Card);

export default function ProductCart() {
  const deleteMutation = useDeleteCart();
  const updateMutation = useUpdateUserCart();
  const { data: cart, isLoading } = useGetCart();

  const handleUpdate = (variantId: number, quantity: number) => {
    if (quantity < 1) return;
    updateMutation.mutate({ variantId, quantity });
  };

  const handleDelete = (cartItemId: number) => {
    deleteMutation.mutate(cartItemId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Your Cart ({cart.totalItems}{" "}
          {cart.totalItems === 1 ? "item" : "items"})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.cartItems.map((item, index) => {
                // THIS IS THE KEY: Use the variant that was added to cart
                const variant = item.variant;
                const product = item.product;

                const regularPrice = parseFloat(variant.regularPrice);
                const discountPrice = variant.discountPrice
                  ? parseFloat(variant.discountPrice)
                  : null;
                const priceToUse = discountPrice ?? regularPrice;
                const savings = discountPrice
                  ? regularPrice - discountPrice
                  : 0;
                const isLowStock = variant.stock
                  ? item.quantity >= variant.stock - 5 &&
                    item.quantity < variant.stock
                  : false;
                const isMaxStock = variant.stock
                  ? item.quantity >= variant.stock
                  : false;

                return (
                  <MotionCard
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="relative w-full sm:w-48 h-64 sm:h-48 shrink-0"
                      >
                        <Image
                          src={
                            product.images[0]?.imageUrl || "/placeholder.jpg"
                          }
                          alt={product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {variant.color} • Size {variant.size}
                          </p>
                          {variant.sku && (
                            <p className="text-xs text-gray-400 mt-1">
                              SKU: {variant.sku}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${priceToUse.toFixed(2)}
                          </span>
                          {savings > 0 && (
                            <>
                              <span className="text-lg text-gray-500 line-through">
                                ${regularPrice.toFixed(2)}
                              </span>
                              <span className="text-sm font-medium text-green-600">
                                Save ${savings.toFixed(2)}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleUpdate(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleUpdate(item.id, item.quantity + 1)
                              }
                              disabled={isMaxStock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>

                        {/* Stock Warnings */}
                        {isLowStock && (
                          <p className="text-sm text-orange-600 font-medium">
                            Only {variant.stock! - item.quantity} left in stock!
                          </p>
                        )}
                        {isMaxStock && (
                          <p className="text-sm text-red-600 font-medium">
                            Maximum stock reached
                          </p>
                        )}
                      </div>

                      {/* Item Total */}
                      <div className="text-right sm:ml-auto">
                        <p className="text-sm text-gray-500">Item total</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${(priceToUse * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </MotionCard>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6 bg-white dark:bg-zinc-900 border shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.cartItems.map((item) => {
                  const v = item.variant;
                  const price = v.discountPrice
                    ? parseFloat(v.discountPrice)
                    : parseFloat(v.regularPrice);
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.product.name} ({v.color} • {v.size})
                      </span>
                      <span className="font-medium">
                        ${(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${cart.cartTotal}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span className="font-medium">FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-4">
                  <span className="text-2xl font-bold">Total</span>
                  <span className="text-3xl font-bold">${cart.cartTotal}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-8 h-14 text-lg font-semibold"
              >
                Proceed to Checkout
              </Button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Free shipping • 30-day returns • Secure payment
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
