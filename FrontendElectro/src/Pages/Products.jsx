// src/pages/Products.jsx
import React from "react";
import ProductList from "../Components/ProductList.jsx";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

function Products() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Product List Section */}
      <ProductList showSeeMore={false} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Products;
