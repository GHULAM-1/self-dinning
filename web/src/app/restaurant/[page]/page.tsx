"use client";

import { ownerT } from "@/types/owner-types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type params = {
  page: String;
};

export default function Menu(params: params) {
  // console.log(params.params.page);

  const fetchOwners = async (): Promise<ownerT[]> => {
    const response = await axios.get(
      `http://localhost:4000/owner/${params.params.page}`
    );
    return response.data;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["owner"],
    queryFn: fetchOwners,
  });

  console.log(data);

  return (
    <>
      <div>
        <h1>Restaurant Menu</h1>
        {/* Render Categories from the menus */}
        {/* <div>{data?.menus[0]?.categories[0]?.categoryName}</div> */}
        {/* {data?.menus?.map((categories) => (
          <>
            {console.log("categories: ", categories)}
            <div key={categories.categories._id} className="category">
              <div className="items">
                {categories.categories?.map((obj) => (
                  <>
                    {console.log("object: ", obj)}
                    <div key={obj._id} className="menu-item">
                      <h2>{categories?.categories[0]?.categoryName}</h2>
                      <h3>{item.itemName}</h3>
                      <p>{item.description}</p>
                      <p>Price: {item.price}</p>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </>
        ))} */}
      </div>
    </>
  );
}
