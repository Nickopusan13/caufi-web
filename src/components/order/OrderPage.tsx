"use client";

import { UserAddressOut } from "@/api/user";
import { useGetCurrentUser } from "@/hooks/useLogin";
import { motion } from "framer-motion";
import { useState } from "react";

export default function OrderPage() {
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const { data: user, isLoading } = useGetCurrentUser();
  const [selectedAddress, setSelectedAddress] = useState<UserAddressOut | null>(
    null
  );
  const cartItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      quantity: 1,
      image: "/headphones.jpg",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 249.99,
      quantity: 2,
      image: "/watch.jpg",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border rounded-lg px-4 py-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="border rounded-lg px-4 py-3 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="same"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded"
                />
                <label htmlFor="same" className="ml-3 text-lg font-medium">
                  Billing address same as shipping
                </label>
              </div>
              {!sameAsShipping && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                >
                  {/* Repeat similar inputs for billing */}
                  <input
                    type="text"
                    placeholder="Billing Address"
                    className="border rounded-lg px-4 py-3 md:col-span-2"
                  />
                  {/* ... more fields */}
                </motion.div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      className="h-5 w-5 text-blue-600"
                      defaultChecked
                    />
                    <span className="ml-3">Credit / Debit Card</span>
                  </label>
                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="border rounded-lg px-4 py-3"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="border rounded-lg px-4 py-3"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="border rounded-lg px-4 py-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-4 border-b"
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16" />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Place Order
              </motion.button>

              <p className="text-sm text-center text-gray-500 mt-4">
                Secure checkout • 30-day returns • Free shipping over $50
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
