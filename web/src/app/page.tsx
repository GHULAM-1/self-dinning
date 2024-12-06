'use client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { ownerT } from "../types/owner-types";
import { Types } from "mongoose";

import { ObjectId } from "mongodb"; // Import ObjectId

type OwnerWithoutId = Omit<ownerT, "_id">;

const fakePayload: OwnerWithoutId = {
  ownerName: "waheed6969",
  ownerCnic: 1234567890123,
  businessImage: "https://via.placeholder.com/150",
  businessName: "John's Cafe",
  businessAddress: "123 Main Street, Cityville",
  businessNumber: "555-1234",
  ownerOrders: [],
  openingTime: new Date(),
  closingTime: new Date(),
  acounts: [
    {
      accountName: "John's Bank Account",
      accountNumber: 12345678,
      bankName: "City Bank",
    },
  ],
  subscription: {
    subscriptionPlan: "Premium",
    subscriptionStarts: new Date(),
    subscriptionEnds: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  },
  menus: [
    {
      categories: [
        {
          categoryName: "Beverages",
          categoryImage: "https://via.placeholder.com/100",
          isDisabledCategory: false,
          items: [
            {
              itemName: "Coffee",
              itemImage: "https://via.placeholder.com/50",
              itemPrice: 5,
              itemDesc: "Hot brewed coffee",
            },
          ],
        },
      ],
    },
  ],
  ownerReviews: [],
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
            <p>Subscription Plan: {owner.subscription.subscriptionPlan || "N/A"}</p>
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