"use client";
import { Category, ownerT, Restaurant } from "@/types/owner-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Types } from "mongoose";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    queryKey: ["restaurant"], // Unique query key for restaurants
    queryFn: fetchRestaurant,
  });

  // Using useQuery for fetching categories
  const {
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
    data: categoriesData,
  } = useQuery({
    queryKey: ["cuisines"], // Unique query key for cuisines
    queryFn: fetchCategories,
  });

  // console.log("restaurant: ", categoriesData);
  console.log("loading: ", isCategoriesLoading, isRestaurantLoading)

  if (isRestaurantLoading || isCategoriesLoading) {
    return <span>Loading...</span>;
  }

  if (isRestaurantError || isCategoriesError) {
    return <span>Error:</span>;
  }
  if (!isMounted) {
    return null; // Prevent server-side rendering issues
  }

  return (
    <>
      {!(isCategoriesLoading && isRestaurantLoading) ? <div className="p-1">
        <div className="flex overflow-x-auto mb-10">
          {restaurantData?.map((owner, index) => (
            <div className="mx-6 bg-slate-700" key={index}>
              <button onClick={() => router.push(`/restaurant/${owner._id}`)}>
                {owner.restaurantName}
              </button>
            </div>
          ))}
        </div>
        <div className="flex overflow-x-auto">
          {categoriesData?.map((cat, index) => (
            <div className="mx-6 bg-slate-700" key={index}>
              <button onClick={() => router.push(`/cuisines/${cat._id}`)}>
                {cat.categoryName}
              </button>
            </div>
          ))}
        </div>
      </div> : <div className="p-2">Loading...</div>}
    </>
  );
}
