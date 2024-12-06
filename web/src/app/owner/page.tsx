'use client'
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ownerT } from "@/types/owner-types";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OwnersPage />
    </QueryClientProvider>
  );
}

function OwnersPage() {
  // Fetch owners from the backend
  const { isLoading, error, data } = useQuery({
    queryKey: ["ownerData"],
    queryFn: async (): Promise<ownerT[]> => {
      const response = await axios.get("http://localhost:4000/owner");
      return response.data;
    },
  });

  if (isLoading) return "Loading...";

  if (error instanceof Error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>Owners List</h1>
      <ul>
        {data?.map((owner) => (
          <li key={owner.ownerCnic}>
            <h2>{owner.businessName}</h2>
            <p>Owner Name: {owner.ownerName}</p>
            <p>Business Address: {owner.businessAddress}</p>
            <p>Business Number: {owner.businessNumber}</p>
            <p>Subscription Plan: {owner.subscription.subscriptionPlan || "N/A"}</p>
            <ul>
              {owner.menus.map((menu, menuIndex) => (
                <li key={menuIndex}>
                  <h3>Menu Categories:</h3>
                  <ul>
                    {menu.categories.map((category, catIndex) => (
                      <li key={catIndex}>
                        <p>Category Name: {category.categoryName}</p>
                        <p>Category Discount: {category.categoryDiscount || "None"}</p>
                        <ul>
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <p>Item Name: {item.itemName}</p>
                              <p>Item Price: {item.itemPrice}</p>
                              <p>Item Discount: {item.itemDiscount || "None"}</p>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}