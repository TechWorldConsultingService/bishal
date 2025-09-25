import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slice/userSlice";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { apiGet, apiPost, apiDelete, apiPostForm, apiPut } from "../utils/api";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [activeTab, setActiveTab] = useState("products");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesAll, setSubcategoriesAll] = useState([]);
  const [subcategoriesFiltered, setSubcategoriesFiltered] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [productQuery, setProductQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: "", price: "", stock: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadAll() {
    try {
      setLoading(true);
      setError("");
      const [cats, subs, brs, prods] = await Promise.all([
        apiGet('/api/categories/'),
        apiGet('/api/subcategories/'),
        apiGet('/api/brands/'),
        apiGet('/api/products/'),
      ]);
      setCategories(cats);
      setSubcategories(subs);
      setSubcategoriesAll(subs);
      setSubcategoriesFiltered([]);
      setBrands(brs);
      setProducts(prods);
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  async function handleAddCategory(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    if (!name) return;
    await apiPost('/api/categories/', { name });
    form.reset();
    loadAll();
  }

  async function handleAddSubcategory(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const category_id = Number(form.category_id.value);
    if (!name || !category_id) return;
    await apiPost('/api/subcategories/', { name, category_id });
    form.reset();
    loadAll();
  }

  async function handleAddBrand(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    if (!name) return;
    await apiPost('/api/brands/', { name });
    form.reset();
    loadAll();
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData();
    fd.append('name', form.name.value.trim());
    fd.append('description', form.description.value.trim());
    fd.append('price', String(Number(form.price.value || 0)));
    fd.append('stock', String(Number(form.stock.value || 0)));
    if (form.category_id.value) fd.append('category_id', String(Number(form.category_id.value)));
    if (form.subcategory_id.value) fd.append('subcategory_id', String(Number(form.subcategory_id.value)));
    if (form.brand_id.value) fd.append('brand_id', String(Number(form.brand_id.value)));
    if (form.image.files[0]) fd.append('image', form.image.files[0]);
    await apiPostForm('/api/products/create/', fd);
    form.reset();
    loadAll();
  }

  async function handleDeleteProduct(id) {
    await apiDelete(`/api/products/${id}/delete/`);
    loadAll();
  }

  function startEdit(p){
    setEditingId(p.id);
    setEditDraft({ name: p.name, price: String(p.price), stock: String(p.stock) });
  }

  function cancelEdit(){
    setEditingId(null);
    setEditDraft({ name: "", price: "", stock: "" });
  }

  async function saveEdit(id){
    await apiPut(`/api/products/${id}/update/`, {
      name: editDraft.name,
      price: Number(editDraft.price || 0),
      stock: Number(editDraft.stock || 0),
    });
    cancelEdit();
    loadAll();
  }

  const tabs = [
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'categories', label: 'Categories', icon: '📂' },
    { id: 'subcategories', label: 'Subcategories', icon: '📁' },
    { id: 'brands', label: 'Brands', icon: '🏷️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-blue-100">Welcome back, {user?.firstName || user?.username || "Admin"}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
              <a href="/products" className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2">
                <span>👁️</span>
                <span>View Products</span>
              </a>
              <button onClick={() => dispatch(logout())} className="bg-red-500/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm hover:shadow-md'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
            <button 
              onClick={loadAll} 
              className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span>⏳</span>
            <span>Loading...</span>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">➕</span>
                <h3 className="text-xl font-semibold text-gray-800">Add Category</h3>
              </div>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                  <input 
                    name="name" 
                    placeholder="Enter category name" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    required
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Create Category
                </button>
              </form>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📂</span>
                <h3 className="text-xl font-semibold text-gray-800">Categories ({categories.length})</h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {categories.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <span className="font-medium text-gray-800">{c.name}</span>
                    <span className="text-sm text-gray-500">ID: {c.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subcategories Tab */}
        {activeTab === 'subcategories' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">➕</span>
                <h3 className="text-xl font-semibold text-gray-800">Add Subcategory</h3>
              </div>
              <form onSubmit={handleAddSubcategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory Name</label>
                  <input 
                    name="name" 
                    placeholder="Enter subcategory name" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
                  <select 
                    name="category_id" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Create Subcategory
                </button>
              </form>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📁</span>
                <h3 className="text-xl font-semibold text-gray-800">Subcategories ({subcategories.length})</h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {subcategories.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div>
                      <span className="font-medium text-gray-800">{s.name}</span>
                      {s.category && (
                        <span className="text-sm text-gray-500 ml-2">({s.category.name})</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">ID: {s.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">➕</span>
                <h3 className="text-xl font-semibold text-gray-800">Add Brand</h3>
              </div>
              <form onSubmit={handleAddBrand} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                  <input 
                    name="name" 
                    placeholder="Enter brand name" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    required
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Create Brand
                </button>
              </form>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🏷️</span>
                <h3 className="text-xl font-semibold text-gray-800">Brands ({brands.length})</h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {brands.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <span className="font-medium text-gray-800">{b.name}</span>
                    <span className="text-sm text-gray-500">ID: {b.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">➕</span>
                <h3 className="text-xl font-semibold text-gray-800">Add Product</h3>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input 
                    name="name" 
                    placeholder="Enter product name" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    name="description" 
                    placeholder="Enter product description" 
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input 
                      name="price" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                    <input 
                      name="stock" 
                      type="number" 
                      placeholder="0" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <input 
                    name="image" 
                    type="file" 
                    accept="image/*" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    name="category_id" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    onChange={(e)=>{
                      const val = Number(e.target.value);
                      if (!val) {
                        setSubcategoriesFiltered([]);
                        return;
                      }
                      const filtered = subcategoriesAll.filter(s=>s.category && s.category.id===val);
                      setSubcategoriesFiltered(filtered);
                    }}
                  >
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <select 
                    name="subcategory_id" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select subcategory</option>
                    {subcategoriesFiltered.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select 
                    name="brand_id" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Create Product
                </button>
              </form>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📦</span>
                <h3 className="text-xl font-semibold text-gray-800">Products ({products.length})</h3>
              </div>
              <div className="mb-4">
                <input
                  value={productQuery}
                  onChange={(e)=>setProductQuery(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {products.filter(p => p.name.toLowerCase().includes(productQuery.toLowerCase())).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-1 pr-4">
                      {editingId === p.id ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            value={editDraft.name}
                            onChange={(e)=>setEditDraft(d=>({...d,name:e.target.value}))}
                            className="px-3 py-2 border rounded"
                          />
                          <input
                            type="number"
                            value={editDraft.price}
                            onChange={(e)=>setEditDraft(d=>({...d,price:e.target.value}))}
                            className="px-3 py-2 border rounded"
                          />
                          <input
                            type="number"
                            value={editDraft.stock}
                            onChange={(e)=>setEditDraft(d=>({...d,stock:e.target.value}))}
                            className="px-3 py-2 border rounded"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="font-semibold text-gray-800 mb-1">{p.name}</div>
                          <div className="text-sm text-gray-600">
                            {p.category?.name || 'No Category'} 
                            {p.subcategory && ` > ${p.subcategory.name}`}
                            {p.brand && ` | ${p.brand.name}`}
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            Rs. {Number(p.price).toLocaleString()} | Stock: {p.stock}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {editingId === p.id ? (
                        <>
                          <button onClick={()=>saveEdit(p.id)} className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
                          <button onClick={cancelEdit} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(p)} className="px-3 py-2 bg-yellow-500 text-white rounded">Edit</button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)} 
                            className="px-3 py-2 bg-red-600 text-white rounded"
                            title="Delete product"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;