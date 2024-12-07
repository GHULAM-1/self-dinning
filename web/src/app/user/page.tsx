"use client";
import { ownerT } from "@/types/owner-types";
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

  const createOwner = useMutation({
    mutationFn: (newOwner: OwnerWithoutId) => {
      return axios.post("http://localhost:4000/owner", newOwner);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner"] });
    },
  });

  const updateOwner = useMutation({
    mutationFn: async ({
      _id,
      ownerName,
    }: {
      _id: Types.ObjectId;
      ownerName: string;
    }) => {
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
  if (!isMounted) {
    return null; // Prevent server-side rendering issues
  }

  return (
    <>
      <div className="flex overflow-x-auto ">
        {data?.map((owner, index) => (
          <div className="mx-6 bg-slate-700" key={index}>
            <button onClick={() => router.push(`/menu/${owner._id}`)}>
              {owner.businessName}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
