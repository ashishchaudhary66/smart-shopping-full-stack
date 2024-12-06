import { useEffect, useState } from "react";
import Product from "../components/Product";
import Spinner from "../components/Spinner";
import Cookies from 'js-cookie';
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Home = () => {
  const[items,setItems]=useState([]);
  const[loading,setLoading]=useState(false);
  const login = useSelector((state) => state.login.value);
  const API_URL = `${process.env.REACT_APP_BASE_URL}/getProducts`;
  async function fetchData(){
    const token = Cookies.get("token");
    if (login && !token) {
      toast.error("No token found. Please log in.");
      return;
    }
    try {
      setLoading(true);
      const output=await fetch(API_URL,{
        method:'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const response=await output.json();
      const jsonData=login?response.data : response;
      setItems(jsonData)
    } catch (error) {
      console.log("error while fetching data ",error)
      setItems([])
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchData();
  },[login])

  return (
    <div className="flex justify-evenly flex-wrap max-w-[1080px] mx-auto p-5">
        {
          loading?<Spinner/>:(
            items && items.length>0?(
              items.map((item,index)=>(
                <Product key={item.id} item={item} index={index}/>
              ))
            ):(
              <div className="flex justify-center items-center font-bold text-2xl text-slate-900 h-[75vh]">No Post Found</div>
            )
          )
        }
    </div>
  )
};

export default Home;
