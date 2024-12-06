
"use client"
import axios from "axios";
import { env } from "process";
import { useState } from "react";

export default function Owner() {
    const [data, setData] = useState<string>();
    const fetch = async ()  => {
        const doc = await axios.get("http://localhost:4000/owner"); 
    }
    console.log(process.env.BASE_URL_OWNER);
    fetch();
  return (
    <>
      <div>Owner</div>
    </>
  );
}
