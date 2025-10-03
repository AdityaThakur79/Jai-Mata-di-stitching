import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleDot, Circle, Loader2, Search } from "lucide-react";
import { useGetAllOrdersQuery } from "@/features/api/orderApi";

const ORDER_STEPS = [
  "pending",
  "confirmed",
  "in_progress",
  "measurement_taken",
  "cutting",
  "stitching",
  "quality_check",
  "ready_for_delivery",
  "out_for_delivery",
  "delivered",
  "completed",
];

const pretty = (s) =>
  s && typeof s === 'string' 
    ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : '';

export default function TrackOrder() {
  const [inputSearch, setInputSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("orderNumber"); // orderNumber, contact, email

  const {
    data: orderData,
    error,
    isLoading,
    isError,
    isSuccess,
  } = useGetAllOrdersQuery(
    {
      page: 1,
      limit: 10,
      search: searchQuery,
    },
    {
      skip: !searchQuery,
    }
  );

  const handleTrackOrder = () => {
    if (inputSearch.trim()) {
      setSearchQuery(inputSearch.trim());
    }
  };

  // Find the actual order since getAllOrders returns an array
  const order = orderData?.orders?.[0] || null;
  const currentIndex = order ? ORDER_STEPS.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 pt-24">
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold mb-4 text-gray-800">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Search by order number, contact number, or email
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Examples: JMD-202510-202511-0001, +919876543210, or email@example.com
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Type:
            </label>
            <div className="flex gap-2">
              {[
                { value: "orderNumber", label: "Order Number" },
                { value: "contact", label: "Contact" },
                { value: "email", label: "Email" },
                { value: "any", label: "Any" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSearchType(option.value)}
                  className={`px-8 py-3 rounded-lg font-medium transition-all ${
                    searchType === option.value
                      ? "bg-orange-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={
                  searchType === "orderNumber"
                    ? "Enter order number (e.g., JMD-202510-202511-0001)"
                    : searchType === "contact"
                    ? "Enter contact number (e.g., +919876543210)"
                    : searchType === "email"
                    ? "Enter email address (e.g., john@example.com)"
                    : "Enter order number, contact, or email"
                }
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                className="h-14 text-lg border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl px-6"
                onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
              />
            </div>
            <Button 
              onClick={handleTrackOrder} 
              disabled={!inputSearch.trim() || isLoading}
              className="h-14 px-8 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5" />
                  Track Order
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {isError && searchQuery && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl mb-8">
            <div className="flex items-center">
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  {error?.data?.message || "Order not found"}
                </h3>
                <p className="text-red-700 mt-1">
                  Please check your search term and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {isSuccess && searchQuery && orderData?.orders?.length === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-xl mb-8">
            <div className="flex items-center">
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800">
                  No orders found
                </h3>
                <p className="text-yellow-700 mt-1">
                  Try searching with a different term (order number, contact, or email).
                </p>
              </div>
            </div>
          </div>
        )}

        {isSuccess && order && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Order Header */}
            <div className="border-b-2 border-gray-100 pb-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center md:text-left">
                  <p className="text-base font-medium text-gray-500 mb-2">Order Number</p>
                  <p className="text-2xl font-bold text-gray-800">{order.orderNumber}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-base font-medium text-gray-500 mb-2">Client Name</p>
                  <p className="text-xl font-semibold text-gray-700">
                    {order.client?.name || order.clientDetails?.name || 'N/A'}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-base font-medium text-gray-500 mb-2">Order Type</p>
                  <p className="text-xl font-semibold text-gray-700 capitalize">
                    {pretty(order.orderType || "N/A")}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional Order Info */}
            {(order.client?.mobile || order.clientDetails?.mobile || order.client?.email || order.clientDetails?.email) && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(order.client?.mobile || order.clientDetails?.mobile) && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Contact</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {order.client?.mobile || order.clientDetails?.mobile}
                      </p>
                    </div>
                  )}
                  {(order.client?.email || order.clientDetails?.email) && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {order.client?.email || order.clientDetails?.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-center text-gray-700 mb-8">
                Order Status Timeline
              </h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-8 right-8 top-8 h-2 bg-gradient-to-r from-orange-200 to-orange-400 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(
                        0,
                        (currentIndex / (ORDER_STEPS.length - 1)) * 100
                      )}%`,
                    }}
                  ></div>
                </div>

                {/* Status Steps */}
                <div className="relative">
                  <div className="grid grid-cols-11 gap-2 items-start">
                    {ORDER_STEPS.map((step, index) => {
                      const isActive = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      const isCompleted = index < currentIndex;
                      
                      // Use different icons based on state
                      let Icon;
                      if (isCompleted) {
                        Icon = CheckCircle2; // Completed steps
                      } else if (isCurrent) {
                        Icon = CircleDot; // Current step (highlighted circle)
                      } else {
                        Icon = Circle; // Future steps
                      }

                      return (
                        <div
                          key={step}
                          className="flex flex-col items-center justify-start"
                        >
                          {/* Icon */}
                          <div
                            className={`
                              relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 mb-4
                              ${
                                isActive
                                  ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-600 text-white shadow-lg transform scale-110"
                                  : "bg-white border-gray-300 text-gray-400"
                              }
                              ${
                                isCurrent
                                  ? "animate-pulse shadow-xl ring-4 ring-orange-200"
                                  : ""
                              }
                            `}
                          >
                            <Icon
                              className={`w-8 h-8 ${
                                isActive ? "text-white" : "text-gray-400"
                              }`}
                            />
                          </div>

                          {/* Label */}
                          <div className="text-center">
                            <p
                              className={`text-sm font-bold leading-tight ${
                                isActive ? "text-orange-700" : "text-gray-500"
                              }`}
                            >
                              {pretty(step)}
                            </p>
                            {isCurrent && (
                              <div className="mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                                Current Status
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {(order.expectedDeliveryDate || order.totalAmount) && (
              <div className="bg-gray-50 rounded-xl p-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.expectedDeliveryDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Expected Delivery
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {new Date(order.expectedDeliveryDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                  {order.totalAmount && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Total Amount
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


