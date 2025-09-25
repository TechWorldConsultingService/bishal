import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import ProductPreview from "./Components/ProductList";
import Footer from "./Components/Footer";
import Products from "./Pages/Products";
import ShopLogin from "./Pages/ShopLogin"
import AdminDashboard from "./Pages/AdminDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Hero />
            <ProductPreview showSeeMore={true} />
            <Footer />
          </>
        }
      />
      <Route path="/products" element={<Products />} />
      <Route path="/shoplogin" element={<ShopLogin />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
