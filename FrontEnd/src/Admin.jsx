import { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  Search,
  PlusCircle,
  Users,
  Package,
  FolderOpen,
  BarChart3,
  AlertCircle,
  CheckCircle,
  X,
  LogOut,
  Eye,
  EyeOff
} from "lucide-react";

// Axios API Wrapper
const api = {
  get: (url) => axios.get(url),
  post: (url, data) => axios.post(url, data),
  delete: (url) => axios.delete(url),
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-80`}>
      <Icon size={20} />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:bg-white/20 rounded p-1">
        <X size={18} />
      </button>
    </div>
  );
};

// Login Component
const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === "admin" && password === "admin@adim") {
      onLogin(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-12"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={18} />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <BarChart3 size={18} />
            Sign In
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">Demo Credentials:</p>
          <p className="text-sm text-gray-800 text-center font-medium mt-1">
            Username: admin<br />
            Password: admin@adim
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchUser, setSearchUser] = useState("");
  const [searchProvider, setSearchProvider] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load data
  const loadUsers = async () => {
    try {
      const res = await api.get("http://localhost:8080/admin/users");
      setUsers(res.data);
    } catch (error) {
      showToast("Failed to load users", "error");
    }
  };

  const loadProviders = async () => {
    try {
      const res = await api.get("http://localhost:8080/admin/providers");
      setProviders(res.data);
    } catch (error) {
      showToast("Failed to load providers", "error");
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("http://localhost:8080/admin/categories");
      setCategories(res.data);
    } catch (error) {
      showToast("Failed to load categories", "error");
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadUsers(), loadProviders(), loadCategories()]);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadAll();
    }
  }, [isLoggedIn]);

  // Delete actions
  const deleteUser = async (id) => {
    try {
      await api.delete(`http://localhost:8080/admin/user/${id}`);
      showToast("User deleted successfully");
      loadUsers();
    } catch (error) {
      showToast("Failed to delete user", "error");
    }
  };

  const deleteProvider = async (id) => {
    try {
      await api.delete(`http://localhost:8080/admin/provider/${id}`);
      showToast("Provider deleted successfully");
      loadProviders();
    } catch (error) {
      showToast("Failed to delete provider", "error");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`http://localhost:8080/admin/category/${id}`);
      showToast("Category deleted successfully");
      loadCategories();
    } catch (error) {
      showToast("Failed to delete category", "error");
    }
  };

  // Add category
  const addCategory = async () => {
    if (!newCategory.trim()) {
      showToast("Category cannot be empty", "error");
      return;
    }
    try {
      await api.post("http://localhost:8080/admin/category", {
        categoryName: newCategory,
      });
      showToast("Category created successfully");
      setNewCategory("");
      loadCategories();
    } catch (error) {
      showToast("Failed to create category", "error");
    }
  };

  // Show login form if not authenticated
  if (!isLoggedIn) {
    return <LoginForm onLogin={setIsLoggedIn} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                { id: "users", label: "Users", icon: Users },
                { id: "providers", label: "Providers", icon: Package },
                { id: "categories", label: "Categories", icon: FolderOpen },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium ${
                    tab === id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="p-8">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && tab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500">
                    <Users size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{users.length}</h3>
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-500">
                    <Package size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{providers.length}</h3>
                <p className="text-gray-500 text-sm font-medium">Total Providers</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-500">
                    <FolderOpen size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{categories.length}</h3>
                <p className="text-gray-500 text-sm font-medium">Total Categories</p>
              </div>
            </div>
          </div>
        )}

        {!loading && tab === "users" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">User Management</h2>
            <div className="mb-6 relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search users..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              {users
                .filter((u) => u.userName.toLowerCase().includes(searchUser.toLowerCase()))
                .map((u) => (
                  <div key={u.id} className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {u.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{u.userName}</p>
                        <p className="text-gray-500 text-sm">{u.mailID}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteUser(u.id)} className="p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="text-red-500" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!loading && tab === "providers" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Provider Management</h2>
            <div className="mb-6 relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search providers..."
                value={searchProvider}
                onChange={(e) => setSearchProvider(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              {providers
                .filter((p) => p.name.toLowerCase().includes(searchProvider.toLowerCase()))
                .map((p) => (
                  <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-gray-500 text-sm">{p.email}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteProvider(p.id)} className="p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="text-red-500" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!loading && tab === "categories" && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Category Management</h2>
            
            {/* Add Category */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
              <h3 className="font-semibold mb-3">Add New Category</h3>
              <div className="flex gap-3">
                <input
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter category name..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCategory()}
                />
                <button
                  onClick={addCategory}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                >
                  <PlusCircle />
                  Add
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6 relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search categories..."
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              />
            </div>

            {/* Category List */}
            <div className="space-y-3">
              {categories
                .filter((c) => c.categoryName.toLowerCase().includes(searchCategory.toLowerCase()))
                .map((c) => (
                  <div key={c.id} className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <FolderOpen className="text-white" />
                      </div>
                      <p className="font-semibold">{c.categoryName}</p>
                    </div>
                    <button onClick={() => deleteCategory(c.id)} className="p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="text-red-500" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}