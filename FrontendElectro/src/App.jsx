import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import ProductPreview from "./Components/ProductList";
import Footer from "./Components/Footer";
import Products from "./Pages/Products";

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
      <Route
        path="*"
        element={
          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
              fontSize: "1.5rem",
            }}
          >
            404 Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default App;
