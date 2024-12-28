"use client";

import { Category, ownerT, Restaurant } from "@/types/owner-types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type params = {
  id: String;
};

export default function Cuisines(params: params) {
  const fetchCuisines = async (): Promise<Category[]> => {
    const response = await axios.get(
      `http://localhost:4000/owner/cuisines/${params.params.id}`
    );
    console.log("response: ", response.data);
    return response.data;
  };
  const router = useRouter();

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["cuisines"],
    queryFn: fetchCuisines,
  });
  // i have hardcoded user for now 
  const addToCart = (item) => {
    console.log("item: ", item, data);
    const payload = {
      restaurantId: data?.id,
      category: data?.cuisine?._id,
      item: item._id,
      quantity: 1,
      itemDiscount: 0
    }

















    //user is hardcoded for now
    axios.post(`http://localhost:4000/user/cart/674a6259039dd7c37215aca4`, payload)
  }
  // console.log("params: ",params.params.id);

  return (
    <>
      <div className="flex flex-col p-3 border-2 border-gray-200 rounded-md">
        <h1>Restaurant Details</h1>
        <h2>Restaurant name: {data?.restaurantName}</h2>
        <div>Restaurant image: {data?.restaurantImage}</div>
        <div>Restaurant Address: {data?.restaurantAddress}</div>
        <br />
        <div>Cuisine Details</div>
        <div>Cuisine name: {data?.cuisine?.categoryName}</div>
        <div>All items: </div>
        {data?.cuisine?.items?.map((item, index) => (
          <div key={index} className="flex flex-row">
            <div>
              Item {index + 1} : {item?.itemName}
            </div>
            <button className="border-green-500 bg-white mx-5 text-black p-2 rounded-md" onClick={() => {addToCart(item)}} >Add to cart</button>
          </div>
        ))}
      </div>
      
    </>
  );
}
