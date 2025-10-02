import { useEffect, useMemo, useState } from "react";
import React from "react";
import { useSelector } from "react-redux";
import batteryImg1 from "../assets/battery.jpg";
import axios from "axios";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function ProductList({ showSeeMore = false, initialSearch = "" }) {
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);
  const [shop, setShop] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("All");
  const [search, setSearch] = useState(initialSearch);
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

  // Premium states
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    axios.get("http://localhost:8000/api/shops/")
      .then(res => {
        if (res.data.length > 0) setShop(res.data[0]);
      })
      .catch(err => console.error(err));
  }, []);

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

  // Update search when initialSearch prop changes
  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const filteredAndSortedProducts = useMemo(() => {
    let list = products;
    
    // Filtering
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

    // Sorting
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "stock":
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    if (showSeeMore) {
      list = list.slice(0, 8);
    }
    return list;
  }, [products, selectedCategoryId, selectedSubcategoryId, search, showSeeMore, sortBy]);

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

  // Skeleton loader component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg animate-pulse">
      <div className="relative h-60 bg-gray-200"></div>
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm border border-white/50 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-600">Premium Auto Parts</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Our Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover premium auto electrical components engineered for performance and reliability
          </p>
        </div>

        {/* Advanced Search & Filters */}
        {!showSeeMore && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products by name, brand, or category..."
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>

              {/* View Toggle & Sort */}
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 backdrop-blur-sm transition-all duration-300"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock">Stock Availability</option>
                </select>
              </div>
            </div>

            {/* Category & Subcategory Filters */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200/50">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value === "All" ? "All" : Number(e.target.value))}
                className="px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 backdrop-blur-sm transition-all duration-300"
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
                  className="px-4 py-2.5 bg-white/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 backdrop-blur-sm transition-all duration-300"
                >
                  <option value="All">All Subcategories</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {/* Results Summary */}
        {!showSeeMore && !loading && (
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredAndSortedProducts.length}</span> products
              {search && (
                <span> for "<span className="font-semibold text-gray-900">{search}</span>"</span>
              )}
            </p>
          </div>
        )}

        {/* Loading / Error States */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to load products</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Product Grid/List View */}
        {!loading && !error && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    shop={shop} 
                    isAuthenticated={isAuthenticated}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedProducts.map((product) => (
                  <ProductListItem 
                    key={product.id} 
                    product={product} 
                    isAuthenticated={isAuthenticated}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearch("");
                setSelectedCategoryId("All");
                setSelectedSubcategoryId("All");
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* View More Products Button */}
        {showSeeMore && filteredAndSortedProducts.length > 0 && (
          <div className="text-center mt-16">
            <a
              href="/products"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore All Products
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Enhanced Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeEditModal}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Edit Product</h3>
                  <p className="text-gray-600 mt-1">Update product details and inventory</p>
                </div>
                <button
                  onClick={closeEditModal}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={editForm.stock}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      name="category_id"
                      value={editForm.category_id}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory</label>
                    <select
                      name="subcategory_id"
                      value={editForm.subcategory_id}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select Subcategory</option>
                      {editSubcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                    <select
                      name="brand_id"
                      value={editForm.brand_id}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-300">
                    <input
                      type="file"
                      name="image"
                      onChange={handleFormChange}
                      accept="image/*"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                  >
                    {editLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </div>
                    ) : (
                      'Update Product'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeDeleteModal}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">Delete Product</h3>
                  <p className="text-gray-600 mt-1">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-gray-700">
                  Are you sure you want to delete <strong className="text-gray-900">"{deletingProduct.name}"</strong>? 
                  This will permanently remove the product from your inventory.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Yes, Delete'
                  )}
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
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

// Enhanced Product Card Component
const ProductCard = ({ product,shop, isAuthenticated, onEdit, onDelete }) => (
  <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
    <div className="relative overflow-hidden">
      <div className="aspect-w-1 aspect-h-1 w-full h-60">
        <img
          src={product.image || batteryImg1}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      {/* Premium Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          {product.categoryName}
        </div>
        {product.stock > 0 ? (
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            In Stock
          </div>
        ) : (
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Out of Stock
          </div>
        )}
      </div>

      {/* Admin Actions */}
      {isAuthenticated && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit(product)}
            className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
            title="Edit Product"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(product)}
            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
            title="Delete Product"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Quick Actions Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <a
            href={`tel:${shop?.p_num}`}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" />
            </svg>
          </a>
          <a
            href={
               shop ? `https://wa.me/977${shop?.whatsapp}?text=${encodeURIComponent(
                    `Hello Bishal Traders, I am interested in ${product?.name || ""}`
                  )}` : "#"
            }


            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 32 32">
              <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.813 5.13 2.352 7.267L4 29l7.012-2.293A12.93 12.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.91-.58-5.563-1.68l-.397-.25-4.162 1.36 1.36-4.06-.26-.41A9.97 9.97 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h3>
        {product.brandName && (
          <p className="text-sm text-gray-500 mt-1">by {product.brandName}</p>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-blue-600">Rs. {Number(product.price).toLocaleString()}</p>
          <p className="text-sm text-gray-500">{product.stock} in stock</p>
        </div>
      </div>

      <div className="flex gap-2">
        <a
          href={`"tel:${shop?.p_num}`}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" />
          </svg>
          Call
        </a>
        <a
          href={`https://wa.me/977${shop?.whatsapp}?text=Hello%20Bishal%20Traders,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 32 32">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.813 5.13 2.352 7.267L4 29l7.012-2.293A12.93 12.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.91-.58-5.563-1.68l-.397-.25-4.162 1.36 1.36-4.06-.26-.41A9.97 9.97 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  </div>
);

// List View Component
const ProductListItem = ({ product, shop,isAuthenticated, onEdit, onDelete }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-64 md:flex-shrink-0">
        <div className="relative h-48 md:h-full">
          <img
            src={product.image || batteryImg1}
            alt={product.name}
            className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {product.categoryName}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {product.name}
                </h3>
                {product.brandName && (
                  <p className="text-gray-500 mt-1">Brand: {product.brandName}</p>
                )}
              </div>
              
              {isAuthenticated && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => onEdit(product)}
                    className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 line-clamp-2 mb-4">
              {product.description || "Premium auto electrical component with guaranteed performance and reliability."}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Stock: {product.stock}
              </div>
              {product.subcategoryName && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {product.subcategoryName}
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:text-right mt-4 lg:mt-0 lg:ml-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              Rs. {Number(product.price).toLocaleString()}
            </div>
            <div className="flex gap-2">
              <a
                href={`"tel:${shop?.p_num}`}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" />
                </svg>
                Call
              </a>
              <a
                href={`https://wa.me/977${shop?.whatsapp}?text=Hello%20Bishal%20Traders,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.813 5.13 2.352 7.267L4 29l7.012-2.293A12.93 12.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.91-.58-5.563-1.68l-.397-.25-4.162 1.36 1.36-4.06-.26-.41A9.97 9.97 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductList;