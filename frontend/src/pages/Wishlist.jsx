import { useSelector } from "react-redux";
import WishlistItems from "../components/WishlistItem";
import { NavLink } from "react-router-dom";

function Wishlist() {
  const wishlistItems = useSelector((state) => state.wishlist);
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
      {wishlistItems.length > 0
        ? <div className="w-full">{wishlistItems.map((item) => <div key={item._id}><WishlistItems item={item} /><div className="w-full h-[2px] bg-slate-600" /></div>)}</div>
        : <div className="flex flex-col gap-4 w-full h-[75vh] items-center justify-center"><p className="font-bold text-2xl text-slate-900">Empty Wishlist</p><NavLink to="/"><span className="bg-green-500 rounded-xl py-2 px-8 text-white hover:bg-green-600 mt-2 font-semibold">Go to Home</span></NavLink></div>}
    </div>
  );
}

export default Wishlist;
