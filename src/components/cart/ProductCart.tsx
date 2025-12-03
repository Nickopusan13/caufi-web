"use client";

import { useGetCart, useDeleteCart, useUpdateUserCart } from "@/hooks/useCart";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const MotionCard = motion.create(Card);

export default function ProductCart() {
  const deleteMutation = useDeleteCart();
  const updateMutation = useUpdateUserCart();
  const { data: cart, isLoading } = useGetCart();
  const handleUpdate = (productId: number, quantity: number) => {
    updateMutation.mutate({
      productId: productId,
      quantity: quantity,
    });
  };
  const handleDelete = (itemId: number) => {
    deleteMutation.mutate(itemId);
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-600">
          {`Looks like you haven't added anything yet.`}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Your Cart ({cart.totalItems}{" "}
          {cart.totalItems === 1 ? "item" : "items"})
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            className="lg:col-span-2 space-y-6 max-h-screen md:max-h-400 overflow-y-auto pr-4 scrollbar-thin"
            data-lenis-prevent
            data-lenis-prevent-touch
          >
            <AnimatePresence mode="popLayout">
              {cart.cartItems.map((item, index) => {
                const product = item.product;
                const regularPrice = parseFloat(product.regularPrice);
                const discountPrice = product.discountPrice
                  ? parseFloat(product.discountPrice)
                  : null;
                const priceToUse = discountPrice || regularPrice;
                const savings = discountPrice
                  ? regularPrice - discountPrice
                  : 0;
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
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl line-clamp-1 font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.color} • Size {item.size}
                          </p>
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
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleUpdate(item.productId, item.quantity - 1)
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
                                handleUpdate(item.productId, item.quantity + 1)
                              }
                              disabled={item.quantity >= product.stock}
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
                        {item.quantity >= product.stock - 5 &&
                          item.quantity < product.stock && (
                            <p className="text-sm text-orange-600">
                              Only {product.stock - item.quantity} left in
                              stock!
                            </p>
                          )}
                        {item.quantity >= product.stock && (
                          <p className="text-sm text-red-600 font-medium">
                            Maximum stock reached
                          </p>
                        )}
                      </div>
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
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6 bg-white dark:bg-gray-900 border shadow-lg max-h-screen md:max-h-400">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>
              <div
                className="space-y-5 max-h-50 overflow-y-auto scrollbar-none"
                data-lenis-prevent
                data-lenis-prevent-touch
              >
                {cart.cartItems.map((item, idx) => {
                  const product = item.product;
                  const displayPrice = product.discountPrice
                    ? parseFloat(product.discountPrice)
                    : parseFloat(product.regularPrice);
                  return (
                    <div
                      key={idx}
                      className="flex gap-4 pb-5 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={
                            product.images[0]?.imageUrl || "/placeholder.jpg"
                          }
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.color} • Size {item.size}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ${displayPrice.toFixed(2)} × {item.quantity}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${(displayPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        {product.discountPrice && (
                          <p className="text-xs text-green-600 font-medium mt-1">
                            You save $
                            {(
                              parseFloat(product.regularPrice) - displayPrice
                            ).toFixed(2)}{" "}
                            per item
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-6" />
              <div className="space-y-4 text-lg">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium">${cart.cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${cart.cartTotal}
                  </span>
                </div>
                {cart.cartItems.some((i) => i.product.discountPrice) && (
                  <p className="text-sm text-green-600 font-medium text-center">
                    🎉 You’re saving a total of $
                    {cart.cartItems
                      .reduce((acc, item) => {
                        const reg = parseFloat(item.product.regularPrice);
                        const disc = item.product.discountPrice
                          ? parseFloat(item.product.discountPrice)
                          : reg;
                        return acc + (reg - disc) * item.quantity;
                      }, 0)
                      .toFixed(2)}{" "}
                    on this order!
                  </p>
                )}
              </div>
              <Button
                size="lg"
                className="w-full mt-8 text-lg h-14 font-semibold"
              >
                Proceed to Checkout
              </Button>
              <div className="mt-6 space-y-2 text-center text-sm text-gray-500 dark:text-gray-400">
                <p className="flex items-center justify-center gap-2">
                  <span>Free standard shipping</span>
                </p>
                <p>
                  30-day returns • Secure checkout • Carbon-neutral delivery
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
