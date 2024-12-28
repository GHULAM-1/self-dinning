"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type CartItem = {
  itemName: string;
  quantity: number;
  restaurantId: string;
  category: string;
  item: string;
  itemPrice: number;
  itemDiscount: number;
};

type CartData = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

type CartProps = {
  params: {
    userId: string;
  };
};

function Cart({ params }: CartProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch cart data
  const fetchCart = async (): Promise<CartData> => {
    const response = await axios.get(
      `http://localhost:4000/user/cart/${params.userId}`
    );
    return response.data;
  };

  const { isLoading, data } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async (item: CartItem) => {
      const payload = {
        restaurantId: item.restaurantId,
        category: item.category,
        item: item.item,
        quantity: 1,
        itemDiscount: 0,
      };
      return axios.post(
        `http://localhost:4000/user/cart/${params.userId}`,
        payload
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error adding item:", error);
    },
  });

  // Remove item mutation with new DELETE endpoint
  const removeItemMutation = useMutation({
    mutationFn: async (item: CartItem) => {
      return axios.delete(
        `http://localhost:4000/user/cart/${params.userId}/${item.restaurantId}/${item.item}/${item.category}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error removing item:", error);
    },
  });

  const handleAddItem = (item: CartItem) => {
    addItemMutation.mutate(item);
  };

  const handleRemoveItem = (item: CartItem) => {
    removeItemMutation.mutate(item);
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {data?.items?.map((item: CartItem) => (
        <div 
          key={`${item.restaurantId}-${item.category}-${item.item}`}
          className="border-2 border-zinc-300 rounded-md p-4 flex flex-col gap-2"
        >
          <div className="font-medium">Item: {item.itemName}</div>
          <div>Quantity: {item.quantity}</div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAddItem(item)}
              disabled={addItemMutation.isPending}
              className="bg-white text-black rounded-md px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
            <button
              onClick={() => handleRemoveItem(item)}
              disabled={removeItemMutation.isPending}
              className="bg-white text-black rounded-md px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
            >
              -
            </button>
          </div>
        </div>
      ))}
      <div className="mt-4 text-lg">
        <div>Total Items: {data?.totalItems || 0}</div>
        <div>Total Bill: ${data?.totalPrice?.toFixed(2) || "0.00"}</div>
      </div>
    </div>
  );
}

export default Cart;