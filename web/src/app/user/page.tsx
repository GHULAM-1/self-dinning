"use client";

import { Category, ownerT, Restaurant } from "@/types/owner-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Types } from "mongoose";

export default function User() {
  const queryClient = useQueryClient();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<ownerT | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  type OwnerWithoutId = Omit<ownerT, "_id">;
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchRestaurant = async (): Promise<Restaurant[]> => {
    const response = await axios.get(`http://localhost:4000/owner/restaurants`);
    return response.data;
  };

  const fetchCategories = async (): Promise<any[]> => {
    const response = await axios.get("http://localhost:4000/owner/cuisines");
    return response.data;
  };

  const {
    isLoading: isRestaurantLoading,
    isError: isRestaurantError,
    error: restaurantError,
    data: restaurantData,
  } = useQuery({
    queryKey: ["restaurant"],
    queryFn: fetchRestaurant,
  });

  const {
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
    data: categoriesData,
  } = useQuery({
    queryKey: ["cuisines"],
    queryFn: fetchCategories,
  });

  console.log("loading: ", isCategoriesLoading, isRestaurantLoading);

  if (isRestaurantLoading || isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isRestaurantError || isCategoriesError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        An error occurred while loading the data
      </div>
    );
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {!(isCategoriesLoading && isRestaurantLoading) ? (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white-800">Restaurants</h2>
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
              {Array.isArray(restaurantData) && restaurantData.length > 0 ? (
                restaurantData.map((owner, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(`/restaurant/${owner._id}`)}
                    className="min-w-[200px] p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-gray-800 flex items-center justify-center"
                  >
                    {owner.restaurantName}
                  </button>
                ))
              ) : (
                <div className="text-gray-500">No restaurants found</div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white-800">Cuisines</h2>
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
              {Array.isArray(categoriesData) && categoriesData.length > 0 ? (
                categoriesData.map((cat, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(`/cuisines/${cat._id}`)}
                    className="min-w-[200px] p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-gray-800 flex items-center justify-center"
                  >
                    {cat.categoryName}
                  </button>
                ))
              ) : (
                <div className="text-gray-500">No cuisines found</div>
              )}
            </div>
          </section>

          <div className="mt-8">
            <button
              onClick={() => router.push(`/user/cart/674a6259039dd7c37215aca4`)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
            >
              View Cart
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}