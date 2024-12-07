'use client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { ownerT } from "../types/owner-types";
import { Types } from "mongoose";

import { ObjectId } from "mongodb"; // Import ObjectId

type OwnerWithoutId = Omit<ownerT, "_id">;

const fakePayload: OwnerWithoutId = {
  ownerName: "Ahmed Khan",
  ownerCnic: 3520123456789,
  acounts: [
    {
      accountName: "Business Account",
      accountNumber: 1234567890,
      bankName: "HBL Bank"
    },
    {
      accountName: "Personal Savings",
      accountNumber: 9876543210,
      bankName: "Meezan Bank"
    }
  ],
  subscription: {
    subscriptionPlan: "premium",
    subscriptionStarts: new Date("2024-01-15"),
    subscriptionEnds: new Date("2025-01-15")
  },
  restaurants: [
    {
      restaurantName: "Spice Route",
      restaurantImage: "/images/spice-route.jpg",
      restaurantAddress: "123 Main Street, Lahore, Punjab",
      restaurantDetails: "Traditional Pakistani cuisine with a modern twist",
      restaurantOrders: [], // Assuming these would be ObjectIds from Order model
      restaurantReview: [],
      branchName: "Main Branch",
      branchCode: "SR-LHR-001",
      openingTime: new Date("2024-01-01T10:00:00"),
      closingTime: new Date("2024-01-01T22:00:00"),
      isClosed: false,
      menu: {
        categories: [
          {
            categoryName: "Appetizers",
            categoryImage: "/images/appetizers.jpg",
            isDisabledCategory: false,
            categoryDiscount: 10,
            items: [
              {
                itemName: "Samosa Chaat",
                itemImage: "/images/samosa-chaat.jpg",
                itemPrice: 250,
                itemDesc: "Crispy samosas topped with yogurt, chutneys, and spices",
                label: "Signature",
                isDiabledItem: false,
                itemDiscount: 5
              },
              {
                itemName: "Chicken Tikka Bites",
                itemImage: "/images/chicken-tikka-bites.jpg",
                itemPrice: 300,
                itemDesc: "Tender chicken pieces marinated in traditional spices",
                label: "Chef's Special",
                isDiabledItem: false
              }
            ]
          },
          {
            categoryName: "Main Course",
            categoryImage: "/images/main-course.jpg",
            isDisabledCategory: false,
            items: [
              {
                itemName: "Butter Chicken",
                itemImage: "/images/butter-chicken.jpg",
                itemPrice: 550,
                itemDesc: "Classic creamy chicken curry served with naan",
                isDiabledItem: false
              }
            ]
          }
        ]
      }
    }
  ]
};


const OwnersPage = () => {
  const queryClient = useQueryClient();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<ownerT | null>(null);
  const [updatedName, setUpdatedName] = useState("");

  const createOwner = useMutation({
    mutationFn: (newOwner: OwnerWithoutId) => {
      return axios.post("http://localhost:4000/owner", newOwner);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner"] });
    },
  });

  const updateOwner = useMutation({
    mutationFn: async ({ _id, ownerName }: { _id: Types.ObjectId; ownerName: string }) => {
      return axios.patch(`http://localhost:4000/owner/${_id}`, { ownerName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner"] });
      setIsPopupOpen(false); // Close the popup after success
    },
  });

  const deleteOwner = useMutation({
    mutationFn: async (_id: Types.ObjectId) => {
      return axios.delete(`http://localhost:4000/owner/${_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner"] }); // Revalidate data
    },
  });

  const fetchOwners = async (): Promise<ownerT[]> => {
    const response = await axios.get("http://localhost:4000/owner");
    return response.data;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["owner"],
    queryFn: fetchOwners,
  });

  const handleEditClick = (owner: ownerT) => {
    setSelectedOwner(owner);
    setUpdatedName(owner.ownerName);
    setIsPopupOpen(true);
  };

  const handleUpdateOwner = () => {
    if (selectedOwner) {
      updateOwner.mutate({ _id: selectedOwner._id, ownerName: updatedName });
    }
  };

  const handleDeleteOwner = (ownerId: Types.ObjectId) => {
    deleteOwner.mutate(ownerId);
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <h1>Owners List</h1>
      <ul>
        {data?.map((owner, index) => (
          <li key={owner._id.toString()} className="border-[2px] border-green-500">
            <h1 className="font-bold text-yellow-500">{index}</h1>
            <h2>{owner.businessName}</h2>
            <p>Owner Name: {owner.ownerName}</p>
            <p>Business Address: {owner.businessAddress}</p>
            <p>Business Number: {owner.businessNumber}</p>
            {/* <p>Subscription Plan: {owner.subscription.subscriptionPlan || "N/A"}</p> */}
            <div className="flex gap-2 mt-2">
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => handleEditClick(owner)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={() => handleDeleteOwner(owner._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        <button
          className="bg-red-500"
          onClick={() => {
            createOwner.mutate(fakePayload);
          }}
        >
          Create Todo
        </button>
      </ul>

      {/* Popup for editing owner */}
      {isPopupOpen && selectedOwner && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2>Edit Owner</h2>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              className="border p-2 w-full"
              placeholder="New Owner Name"
            />
            <div className="mt-4 flex gap-2">
              <button
                className="bg-green-500 text-white p-2 rounded"
                onClick={handleUpdateOwner}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnersPage;