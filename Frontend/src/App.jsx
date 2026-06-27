import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Collection from "./pages/Collection.jsx";
import Home from "./pages/Home.jsx";
import Jewelry from "./pages/Jewelry.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Registration.jsx";
import Feedback from "./pages/Feedback.jsx";
import Footer from "./components/Footer.jsx";
import Rings from "./pages/Rings.jsx";
import Kids from "./pages/Kids.jsx";

import Earrings from "./pages/Earrings.jsx";
import BraceletsBangles from "./pages/Braceletsbangles.jsx";
import Solitaries from "./pages/Solitaries.jsx";
import NecklacesPendants from "./pages/Necklacespendants.jsx";
import Gifting from "./pages/Gifting.jsx";
import Trending from "./pages/Trending.jsx";
import Rental from "./pages/Rental.jsx";
 import AdminRoute from "./components/AdminRoute";

// ✅ ADD THIS LINE
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Cart from "./pages/Cart.jsx";
import Payment from "./pages/Payment.jsx";
import Orders from "./pages/Orders.jsx";
import Profile from "./pages/Profile.jsx";
import Policies from "./pages/Policies";
import Review from "./pages/Reviews.jsx";

function Layout() {
  const location = useLocation();

  // Hide Navbar on Kids page
const hideNavbar =
  location.pathname === "/kids" ||
  location.pathname === "/admin";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Jewelry />
              <Collection />
              <Feedback />
              <Footer />
              
            </>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/rings" element={<Rings />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/earrings" element={<Earrings />} />
        <Route path="/bracelets-bangles" element={<BraceletsBangles />} />
        <Route path="/solitaries" element={<Solitaries />} />
        <Route path="/rental" element={<Rental />} />
        <Route path="/necklaces-pendants" element={<NecklacesPendants />} />
        <Route path="/gifting" element={<Gifting />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/reviews" element={<Review />} />
      

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/policies" element={<Policies />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;