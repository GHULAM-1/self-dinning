"use client";

import { Category, ownerT, Restaurant } from "@/types/owner-types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type params = {
  id: String;
};

export default function Cuisines(params: params) {

  const fetchCuisines = async (): Promise<Category[]> => {
    const response = await axios.get(
      `http://localhost:4000/owner/cuisines/${params.params.id}`
    );
    return response.data;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["cuisines"],
    queryFn: fetchCuisines,
  });

  console.log(data);
// console.log("params: ",params.params.id);

  return (
    <>
      <div>
        <h1>Restaurant Details</h1>
        <h2>Restaurant name: {data?.restaurantName}</h2>
        <div>Restaurant image: {data?.restaurantImage}</div>
        <div>Restaurant Address: {data?.restaurantAddress}</div>
        <br/>
        <div>Cuisine Details</div>
        <div>Cuisine name: {data?.cuisine.categoryName}</div>
        <div>All items: </div>
        {data?.cuisine.items.map((item, index) => (
            <div>Item {index + 1} : {item.itemName}</div>
        ))}
      </div>
    </>
  );
}
