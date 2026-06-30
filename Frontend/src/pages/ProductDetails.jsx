import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);

      const found = res.data.find(
        (p) =>
          p.productId?.toLowerCase() ===
          productId?.toLowerCase()
      );

      setProduct(found || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const userId = localStorage.getItem("userId");

    const currentCart =
      JSON.parse(
        localStorage.getItem(`lolakk_cart_${userId}`)
      ) || [];

    const cartItem = {
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image.startsWith("http")
        ? item.image
        : `${API_URL}${item.image}`,
      qty: 1,
    };

    const existingIndex = currentCart.findIndex(
      (c) => c.id === item._id
    );

    let updatedCart;

    if (existingIndex > -1) {
      updatedCart = [...currentCart];
      updatedCart[existingIndex].qty += 1;
    } else {
      updatedCart = [...currentCart, cartItem];
    }

    localStorage.setItem(
      `lolakk_cart_${userId}`,
      JSON.stringify(updatedCart)
    );

    setNotification({
      message: `${item.name} added to cart`,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl text-white mb-4">
          Product Not Found
        </h2>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-amber-500 text-black rounded-xl"
        >
          Back Home
        </button>
      </div>
    );
  }

  return (
    <>
    <button
  onClick={() => navigate(-1)}
  className="fixed top-28 right-6 z-50
  w-10 h-10 rounded-full
  bg-white/10 backdrop-blur-md
  border border-white/20
  text-white hover:text-amber-400
  hover:border-amber-500
  transition"
>
  ✕
</button>
    <section className="pt-32 pb-24 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <img
            src={
              product.image.startsWith("http")
                ? product.image
                : `${API_URL}${product.image}`
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">
          <p className="text-amber-400 uppercase tracking-[0.3em] text-xs mb-3">
            LOLAKK Luxury
          </p>

          <h1 className="text-4xl md:text-5xl text-white serif">
            {product.name}
          </h1>

          <p className="text-amber-500 mt-3">
            Product ID: {product.productId}
          </p>

          <p className="text-gray-400 mt-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8">
            <span className="text-5xl text-amber-400">
              ₹{product.price}
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => addToCart(product)}
              className="w-full py-4 rounded-2xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingBag size={20} />
                Add To Cart
              </span>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="w-full py-4 rounded-2xl border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black transition"
            >
              Go To Cart
            </button>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-amber-400 text-lg">✦</p>
                <p className="text-xs text-gray-500">
                  Premium Quality
                </p>
              </div>

              <div>
                <p className="text-amber-400 text-lg">✦</p>
                <p className="text-xs text-gray-500">
                  Luxury Finish
                </p>
              </div>

              <div>
                <p className="text-amber-400 text-lg">✦</p>
                <p className="text-xs text-gray-500">
                  Elegant Design
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-black border border-amber-500 px-4 py-3 rounded-lg z-50">
          {notification.message}
        </div>
      )}
    </section>
    </>
  );
}