import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Cart() {
  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAddressWarning, setShowAddressWarning] = useState(false);
  const [processingItem, setProcessingItem] = useState(null);
  const [internationalOrders,setInternationalOrders] = useState([]);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const cartKey = `lolakk_cart_${userId}`;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${API}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAddresses(data.address || []);
      } catch (err) {
        console.error("Address fetch error:", err);
      }
    };

    if (token) fetchAddresses();
  }, []);

    useEffect(() => {
    if (token) {
      fetchInternationalOrders();
    }
  }, []);

  useEffect(() => {
    try {
      const rawData = localStorage.getItem(cartKey);

      if (rawData) {
        const parsed = JSON.parse(rawData);

        const normalizedCart = parsed.map((item) => ({
          ...item,
          id: item.id || item._id,
          qty: Number(item.qty) > 0 ? Number(item.qty) : 1,
          price: Number(item.price) || 0,
          isRental: item.isRental || false,
        }));

        setCart(normalizedCart);
      }
    } catch (error) {
      console.error("Cart loading error:", error);
      localStorage.removeItem(cartKey);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, isInitialized]);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
  if (window.confirm("Remove this item from cart?")) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }
};

const fetchInternationalOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API}/api/orders/pending-international`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    setInternationalOrders(data);

  } catch(err){
    console.log(err);
  }
};


const payInternationalOrder = async(order)=>{

  try{

    const razorpayOrder = await fetch(
      `${API}/api/payments/create-order`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          amount:order.total,
          customerName:order.customerName,
          customerEmail:order.customerEmail,
          customerPhone:order.shippingAddress.phone
        })
      }
    );


    const data = await razorpayOrder.json();


    const options = {

      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount:data.amount,

      currency:"INR",

      name:"LOLAKK",

      order_id:data.id,


      handler:async function(response){

        const verify = await fetch(
          `${API}/api/payments/verify-payment`,
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({

              ...response,

              userId:userId,

              orderId:order._id,

              amount:order.total

            })
          }
        );


        const result = await verify.json();


        if(result.success){

          alert("Payment successful");

          setCart([]);

          localStorage.removeItem(cartKey);

          fetchInternationalOrders();

        }

      }

    };


    const rzp = new window.Razorpay(options);

    rzp.open();


  }catch(err){

    console.log(err);

  }

};

  // =========================
  // PAYMENT FIXED
  // =========================
const proceedToPayment = async (
  itemsToPay,
  isSingleItem = false,
  itemId = null
) => {
    if (loading) return;

    try {
      setProcessingItem(itemId);
      setLoading(true);

      const res = await fetch(`${API}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = await res.json();

      const addr =
        user.address?.find((a) => a.isDefault) || user.address?.[0];

      console.log("SELECTED ADDRESS:", addr);

     if (!addr) {
  setShowAddressWarning(true);
  setLoading(false);
  return;
}

// International orders
if (addr.country !== "India") {
  const confirmed = window.confirm(
    "International shipping charges vary by country.\n\nClick OK to submit your order. Our team will calculate the shipping cost and notify you once your order is ready for payment."
  );

  if (!confirmed) {
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`${API}/api/orders/international`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user._id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: addr.phone,
        items: itemsToPay,
        shippingAddress: addr,
      }),
    });

    const data = await response.json();

   if (data.success) {
  alert(
    "Your international order has been received.\nWe'll calculate shipping charges and notify you once it's ready for payment."
  );

  // Keep cart items until payment is completed
  await fetchInternationalOrders();
   setCart([]);

  return;
}

    alert(data.message);
    return;
  } catch (err) {
    console.log(err);
    alert("Unable to submit order.");
    return;
  }
}

     const productTotal = itemsToPay.reduce(
  (acc, item) => acc + item.price * item.qty,
  0
);

const deliveryCharge =
  addr.country === "India"
    ? addr.state === "Kerala"
      ? 100
      : 200
    : 0; // Change this if you want international shipping later

const orderTotal = productTotal + deliveryCharge;

      // CREATE RAZORPAY ORDER
     const orderResponse = await fetch(
  `${API}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  amount: orderTotal,

  customerName: user.name || "Guest User",
  customerEmail: user.email || "",
  customerPhone: addr.phone || "",
}),
        }
      );

     const orderText = await orderResponse.text();

console.log(
  "CREATE ORDER RESPONSE:",
  orderText
);

const orderData = JSON.parse(orderText);

      console.log("ORDER RESPONSE:", orderData);

     

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Order failed");
      }

      // OPEN RAZORPAY
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LOLAKK",
        order_id: orderData.id,

        handler: async function (response) {
          try {

            const orderItems = itemsToPay.map((item) => ({
  productId: item.productId || item._id || item.id,
  name: item.name,
  quantity: item.qty || item.quantity || 1,
  price: item.price,
  image: item.image,
  size: item.selectedSize || item.size || "",
}));

            const verifyResponse = await fetch(
  `${API}/api/payments/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },

                
                body: JSON.stringify({
  ...response,

  userId: user._id,

  items: orderItems,
  shippingAddress: addr,

  customerName: user.name || "Guest User",
  customerEmail: user.email || "",
  customerPhone: addr.phone || "",

  amount: orderTotal,
   deliveryCharge,
}),
              }
            );

            const verifyText =
  await verifyResponse.text();

console.log(
  "VERIFY PAYMENT RESPONSE:",
  verifyText
);

const verifyData =
  JSON.parse(verifyText);

         if (verifyData.success) {
  if (isSingleItem) {
    const purchasedId = itemsToPay[0].id;

    const updatedCart = cart.filter(
      (item) => item.id !== purchasedId
    );

    setCart(updatedCart);

    localStorage.setItem(
      cartKey,
      JSON.stringify(updatedCart)
    );
  } else {
    setCart([]);
    localStorage.removeItem(cartKey);
  }

  navigate("/");
} else {
              alert("Payment Failed");
            }
          } catch (err) {
            console.log(err);
            alert("Verification Error");
          }
        },
      };



      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
      setProcessingItem(null);
    }
  };

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const defaultAddress =
  addresses.find((a) => a.isDefault) || addresses[0];

 const deliveryCharge =
  cart.length > 0
    ? defaultAddress
      ? defaultAddress.country === "India"
        ? defaultAddress.state === "Kerala"
          ? 100
          : 200
        : 0 // International (change later if needed)
      : 100
    : 0;

const grandTotal = cartTotal + deliveryCharge;



  if (!isInitialized) return null;

  return (
 <section className="pt-36 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto text-white bg-black min-h-screen">
     <div className="text-center mb-10 md:mb-16">
       <h1 className="text-3xl md:text-4xl serif gold-gradient mb-3">
          Your Collection
        </h1>
        
      </div>

 

     {internationalOrders.length > 0 ? (

  <div>
    {internationalOrders.map((order)=>(

      <div
        key={order._id}
        className="bg-zinc-900 border border-amber-500 p-5 rounded-xl mb-4"
      >

        <h3 className="text-amber-400 text-lg font-semibold">
          International Order
        </h3>


        <p className="text-gray-300 mt-2">
          Order ID: {order._id}
        </p>


        <p className="text-gray-300">
          Status:
          <span className="text-amber-400 ml-2">
            {order.status}
          </span>
        </p>


        {order.status === "Awaiting Shipping Quote" && (

          <p className="text-yellow-400 mt-3">
            Waiting for delivery charge confirmation
          </p>

        )}


        {order.status === "Ready For Payment" && (

          <>

          <p className="text-green-400 mt-3">
            Delivery charge confirmed
          </p>


          <p className="text-white mt-2">
            Delivery Charge:
            ₹{order.deliveryCharge}
          </p>


          <button
            onClick={()=>payInternationalOrder(order)}
            className="mt-3 bg-amber-500 text-black px-5 py-2 rounded"
          >
            Pay Now ₹{order.total}
          </button>

          </>

        )}

      </div>

    ))}
  </div>


) : cart.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-white/10">
          <ShoppingBag size={52} className="mx-auto mb-4 text-gray-500" />
          <p className="text-xl text-gray-500">Your cart is empty</p>

          <button
            onClick={() => navigate("/")}
            className="mt-5 text-amber-500 underline"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
  key={item.id}
  className="flex gap-3 p-3 rounded-2xl bg-zinc-900 border border-white/10 shadow-lg"
>
                <img
  src={item.image}
  alt={item.name}
  className="w-28 h-28 md:w-32 md:h-32md:w-32 md:h-32 object-contain bg-zinc-900 rounded-xl p-2 border border-white/10 shrink-0"
/>
               

           <div className="flex-1 min-w-0">
             <h2 className="text-sm md:text-xl font-semibold text-white line-clamp-2">
  {item.name}
</h2>

               <p className="text-amber-400 font-bold text-base mt-1">
                    ₹{item.price}
                  </p>

                <div className="flex items-center gap-2 mt-3">

  <button
    onClick={() => updateQty(item.id, -1)}
    className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center"
  >
    <Minus size={14} />
  </button>

  <span className="font-semibold text-base min-w-[24px] text-center">
  {item.qty}
</span>

  <button
    onClick={() => updateQty(item.id, 1)}
    className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center"
  >
    <Plus size={14} />
  </button>

  
</div>
                </div>
<div className="text-right ml-auto flex flex-col justify-between">

  <button
    onClick={() => removeItem(item.id)}
    className="self-end mb-2 text-red-400 hover:text-red-300"
  >
    <Trash2 size={18} />
  </button>
                  <p className="text-gray-400 text-sm">
  Product: ₹{item.price * item.qty}
</p>

{defaultAddress?.country === "India" ? (
  <>
    <p className="text-gray-400 text-sm">
      Delivery: ₹{deliveryCharge}
    </p>

    <p className="text-amber-400 font-bold text-base mt-1">
      Total: ₹{item.price * item.qty + deliveryCharge}
    </p>
  </>
) : (
  <>
    <p className="text-yellow-400 text-xs">
      Shipping charges will be calculated after order confirmation.
    </p>

    <p className="text-amber-400 font-bold text-base mt-1">
      Product: ₹{item.price * item.qty}
    </p>
  </>
)}

                  <button
                   disabled={processingItem === item.id}
                    onClick={() =>
  proceedToPayment([item], true, item.id)
}
                  className="mt-2 px-4 py-2 bg-amber-500 text-black rounded-lg text-sm font-semibold"
                  >
                   {processingItem === item.id
  ? "Processing..."
  : "Checkout"}
                  </button>
                </div>
              </div>
            ))}
          </div>

       <div className="glass p-4 md:p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-md h-fit lg:sticky lg:top-32 mb-28 md:mb-0 border border-amber-500/20">
           <h2 className="text-xl font-bold mb-4 text-amber-400">
  Order Summary
</h2>

{defaultAddress && (
  <div className="mb-4 p-3 rounded-xl bg-zinc-800 border border-white/10">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold text-amber-400">
        Delivery Address
      </h3>

      <button
        onClick={() => navigate("/profile")}
        className="text-xs text-amber-400 hover:underline"
      >
        Change
      </button>
    </div>

    <p className="text-white text-sm font-medium">
      {defaultAddress.name}
    </p>

    <p className="text-gray-400 text-xs mt-1">
      {defaultAddress.fullAddress}
    </p>

    <p className="text-gray-500 text-xs">
      {defaultAddress.district}, {defaultAddress.state}
    </p>

    <p className="text-gray-500 text-xs">
      PIN: {defaultAddress.pincode}
    </p>

    <p className="text-gray-500 text-xs">
      Phone: {defaultAddress.phone}
    </p>
  </div>
)}

            <p>Items: {cart.length}</p>
           <p>Subtotal: ₹{cartTotal}</p>

{defaultAddress?.country === "India" ? (
  <>
    <p>Delivery Charge: ₹{deliveryCharge}</p>

    <hr className="my-3 border-white/10" />

    <p className="font-bold text-amber-500 text-lg">
      Total: ₹{grandTotal}
    </p>
  </>
) : (
  <>
    <div className="mt-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3">
      <p className="text-yellow-300 text-sm">
        Shipping charges for international orders vary by destination.
      </p>

      <p className="text-gray-300 text-xs mt-2">
        Submit your order now. Our team will calculate the shipping cost and notify you before payment.
      </p>
    </div>

    <hr className="my-3 border-white/10" />

    <p className="font-bold text-amber-500 text-lg">
      Product Total: ₹{cartTotal}
    </p>
  </>
)}

            {showAddressWarning && (
  <div className="mb-6 p-5 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
    <h2 className="text-red-400 font-bold text-lg mb-2">
      Delivery Address Required
    </h2>

    <p className="text-gray-300 text-sm mb-4">
      Please add a delivery address before proceeding to payment.
    </p>

    <button
      onClick={() => navigate("/profile")}
      className="bg-amber-500 text-black px-5 py-2 rounded-lg font-bold hover:bg-amber-400 transition"
    >
      Add Address
    </button>

    <button
      onClick={() => setShowAddressWarning(false)}
      className="ml-3 text-gray-400 hover:text-white text-sm underline"
    >
      Dismiss
    </button>
  </div>
)}

            <button
  disabled={loading || cart.length === 0}
  onClick={() => proceedToPayment(cart, false)}
  className="hidden md:block w-full mt-4 bg-amber-600 py-3 rounded-xl font-bold"
>
              {loading
  ? "Processing..."
  : defaultAddress?.country === "India"
  ? "Pay All"
  : "Submit Order"}
            </button>
          </div>
        </div>
      )}

      {cart.length > 0 && (
 <div className="fixed bottom-0 left-0 right-0 md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-amber-500/20 p-4 z-50">
    <button
      disabled={loading || cart.length === 0}
      onClick={() => proceedToPayment(cart, false)}
     className="w-full bg-amber-500 text-black py-4 rounded-2xl font-bold text-lg shadow-lg"
    >
      {loading
  ? "Processing..."
  : defaultAddress?.country === "India"
  ? `Pay ₹${grandTotal}`
  : "Submit Order"}
    </button>
  </div>
)}

    </section>
  );
}