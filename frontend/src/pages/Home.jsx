import { useEffect, useState } from "react";
import Product from "../components/Product";
import Spinner from "../components/Spinner";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = `${process.env.REACT_APP_BASE_URL}/getProducts`;

  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(API_URL, { method: "GET", credentials: "include" });
        if (!response.ok) throw new Error("Unable to fetch products");
        const result = await response.json();
        if (active) setItems(result.data || []);
      } catch (error) {
        console.error("Product fetch error:", error);
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => { active = false; };
  }, [API_URL]);

  return (
    <div className="flex justify-evenly flex-wrap max-w-[1080px] mx-auto p-5">
      {loading ? <Spinner /> : items.length > 0
        ? items.map((item) => <Product key={item._id} item={item} />)
        : <div className="flex justify-center items-center font-bold text-2xl text-slate-900 h-[75vh]">No Products Found</div>}
    </div>
  );
};

export default Home;
