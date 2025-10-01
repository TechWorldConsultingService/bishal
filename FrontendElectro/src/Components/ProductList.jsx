// src/components/ProductList.jsx
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import batteryImg1 from "../assets/battery.jpg";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function ProductList({ showSeeMore = false }) {
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Edit/Delete states
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    subcategory_id: "",
    brand_id: "",
    image: null
  });
  const [brands, setBrands] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editSubcategories, setEditSubcategories] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const [prodRes, catRes, brandRes] = await Promise.all([
          fetch(`${BACKEND_BASE_URL}/api/products/`),
          fetch(`${BACKEND_BASE_URL}/api/categories/`),
          fetch(`${BACKEND_BASE_URL}/api/brands/`),
        ]);
        if (!prodRes.ok) throw new Error("Failed to load products");
        if (!catRes.ok) throw new Error("Failed to load categories");
        if (!brandRes.ok) throw new Error("Failed to load brands");
        const prodJson = await prodRes.json();
        const catJson = await catRes.json();
        const brandJson = await brandRes.json();

        if (!Array.isArray(prodJson)) {
          throw new Error("Unexpected products response");
        }
        const normalizedProducts = prodJson.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          price: Number(p.price || 0),
          stock: p.stock || 0,
          categoryId: p.category?.id ?? null,
          categoryName: p.category?.name || "Uncategorized",
          subcategoryId: p.subcategory?.id ?? null,
          subcategoryName: p.subcategory?.name || null,
          brandId: p.brand?.id ?? null,
          brandName: p.brand?.name || null,
          image: p.image || null,
        }));

        if (isMounted) {
          setProducts(normalizedProducts);
          setCategories(catJson);
          setBrands(brandJson);
        }
      } catch (e) {
        if (isMounted) setError(e.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchSubcategories() {
      if (selectedCategoryId === "All") {
        setSubcategories([]);
        setSelectedSubcategoryId("All");
        return;
      }
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/categories/${selectedCategoryId}/subcategories/`);
        if (!res.ok) throw new Error("Failed to load subcategories");
        const data = await res.json();
        if (isMounted) {
          setSubcategories(data);
          setSelectedSubcategoryId("All");
        }
      } catch {
        if (isMounted) setSubcategories([]);
      }
    }
    fetchSubcategories();
    return () => {
      isMounted = false;
    };
  }, [selectedCategoryId]);

  // Fetch subcategories for edit form when category changes
  useEffect(() => {
    let isMounted = true;
    async function fetchEditSubcategories() {
      if (!editForm.category_id || editForm.category_id === "") {
        setEditSubcategories([]);
        return;
      }
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/categories/${editForm.category_id}/subcategories/`);
        if (!res.ok) throw new Error("Failed to load subcategories");
        const data = await res.json();
        if (isMounted) {
          setEditSubcategories(data);
        }
      } catch {
        if (isMounted) setEditSubcategories([]);
      }
    }
    fetchEditSubcategories();
    return () => {
      isMounted = false;
    };
  }, [editForm.category_id]);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategoryId !== "All") {
      list = list.filter((p) => p.categoryId === selectedCategoryId);
    }
    if (selectedSubcategoryId !== "All") {
      list = list.filter((p) => p.subcategoryId === selectedSubcategoryId);
    }
    if (!showSeeMore && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (showSeeMore) {
      list = list.slice(0, 8);
    }
    return list;
  }, [products, selectedCategoryId, selectedSubcategoryId, search, showSeeMore]);

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category_id: product.categoryId || "",
      subcategory_id: product.subcategoryId || "",
      brand_id: product.brandId || "",
      image: null
    });
  };

  // Handle delete product
  const handleDeleteProduct = (product) => {
    setDeletingProduct(product);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingProduct) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/products/${deletingProduct.id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== deletingProduct.id));
        setDeletingProduct(null);
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
      // Reset subcategory when category changes
      ...(name === 'category_id' && { subcategory_id: "" })
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      formData.append('stock', editForm.stock);
      if (editForm.category_id) formData.append('category_id', editForm.category_id);
      if (editForm.subcategory_id) formData.append('subcategory_id', editForm.subcategory_id);
      if (editForm.brand_id) formData.append('brand_id', editForm.brand_id);
      if (editForm.image) formData.append('image', editForm.image);

      const response = await fetch(`${BACKEND_BASE_URL}/api/products/${editingProduct.id}/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => 
          p.id === editingProduct.id 
            ? { 
                ...p, 
                name: updatedProduct.name,
                description: updatedProduct.description || "",
                price: Number(updatedProduct.price || 0),
                stock: updatedProduct.stock || 0,
                categoryId: updatedProduct.category?.id ?? null,
                categoryName: updatedProduct.category?.name || "Uncategorized",
                subcategoryId: updatedProduct.subcategory?.id ?? null,
                subcategoryName: updatedProduct.subcategory?.name || null,
                brandId: updatedProduct.brand?.id ?? null,
                brandName: updatedProduct.brand?.name || null,
                image: updatedProduct.image || p.image
              }
            : p
        ));
        setEditingProduct(null);
        setEditForm({
          name: "",
          description: "",
          price: "",
          stock: "",
          category_id: "",
          subcategory_id: "",
          brand_id: "",
          image: null
        });
        setEditSubcategories([]);
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Close modals
  const closeEditModal = () => {
    setEditingProduct(null);
    setEditForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      subcategory_id: "",
      brand_id: "",
      image: null
    });
    setEditSubcategories([]);
  };

  const closeDeleteModal = () => {
    setDeletingProduct(null);
  };

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent inline-block">
          Our Products
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Discover our wide range of high-quality auto electrical products for
          all your vehicle needs
        </p>
      </div>

      {/* Search Bar (only in Products page) */}
      {!showSeeMore && (
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Loading / Error */}
      {loading && (
        <div className="text-center text-gray-600 mb-8">Loading products...</div>
      )}
      {error && (
        <div className="text-center text-red-600 mb-8">{error}</div>
      )}

      {/* Category & Subcategory Filters */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value === "All" ? "All" : Number(e.target.value))}
          className="px-5 py-2.5 rounded-full font-medium transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {selectedCategoryId !== "All" && (
          <select
            value={selectedSubcategoryId}
            onChange={(e) => setSelectedSubcategoryId(e.target.value === "All" ? "All" : Number(e.target.value))}
            className="px-5 py-2.5 rounded-full font-medium transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
          >
            <option value="All">All Subcategories</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Battery Subcategory Buttons */}
      {/* {category === "Battery" && (
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {batterySubcategories.map((subcat) => (
            <button
              key={subcat}
              onClick={() => setSubcategory(subcat)}
              className={`px-4 py-1.5 rounded-full font-medium transition-all duration-300 text-sm ${
                subcategory === subcat
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
              }`}
            >
              {subcat}
            </button>
          ))}
        </div>
      )} */}

      {/* Product Grid with improved styling */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image || batteryImg1}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-white rounded-lg shadow-sm px-2 py-1 text-xs font-semibold text-blue-600">
                {product.categoryName}
              </div>
              
              {/* Edit and Delete Icons for authenticated users */}
              {isAuthenticated && (
                <div className="absolute top-3 left-3 flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                    title="Edit Product"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                    title="Delete Product"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-blue-600 font-bold">Rs. {Number(product.price).toLocaleString()}</p>

              <div className="flex flex-col gap-1 sm:flex-row sm:gap-2 mt-4">
                <a
                  href="tel:9763258057"
                  className="w-full sm:flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-2 py-2 text-xs rounded-lg shadow-sm hover:bg-blue-600 transition-all duration-300 group sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce"
                  >
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" />
                  </svg>
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-center">
                    Call
                  </span>
                </a>
                <a
                  href={`https://wa.me/9779763258057?text=Hello%20Bishal%20Traders,%20I%20am%20interested%20in%20${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 flex items-center justify-center gap-1 bg-green-500 text-white px-2 py-2 text-xs rounded-lg shadow-sm hover:bg-green-600 transition-all duration-300 group sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce"
                  >
                    <path
                      fill="#fff"
                      d="M16 3C9.373 3 4 8.373 4 15c0 2.637.813 5.13 2.352 7.267L4 29l7.012-2.293A12.93 12.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.91-.58-5.563-1.68l-.397-.25-4.162 1.36 1.36-4.06-.26-.41A9.97 9.97 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.13-.61.14-.18.27-.7.9-.86 1.09-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43.98 2.81 1.12 3 .14.19 2.09 3.20 5.08 4.36.71.25 1.26.40 1.69.51.71.18 1.36.16 1.87.10.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"
                    />
                  </svg>
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-center">
                    WhatsApp
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Products Button at the End (conditionally rendered) */}
      {showSeeMore && (
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group"
          >
            View More Products
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeEditModal}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Edit Product</h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={editForm.stock}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category_id"
                      value={editForm.category_id}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                    <select
                      name="subcategory_id"
                      value={editForm.subcategory_id}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Subcategory</option>
                      {editSubcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <select
                      name="brand_id"
                      value={editForm.brand_id}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleFormChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {editLoading ? 'Updating...' : 'Update Product'}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0  bg-opacity-10 flex items-center justify-center z-50 p-4" onClick={closeDeleteModal}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "<strong>{deletingProduct.name}</strong>"? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductList;
