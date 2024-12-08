"use client";

import { ownerT, Restaurant } from "@/types/owner-types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type params = {
  page: String;
};

export default function Menu(params: params) {

  const fetchRestaurant = async (): Promise<Restaurant[]> => {
    const response = await axios.get(
      `http://localhost:4000/owner/restaurants/${params.params.page}`
    );
    return response.data;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["restaurant"],
    queryFn: fetchRestaurant,
  });

  console.log(data);

  return (
    <>
      <div>
        <h1>Restaurant Details</h1>
        <h2>Restaurant name: {data.restaurantName}</h2>
        <div>Restaurant image: {data.restaurantImage}</div>
        <div>Restaurant Address: {data.restaurantAddress}</div>
      </div>
    </>
  );
}
