import { useEffect, useState } from "react";
import { Trash2, Search, PlusCircle, Users, Package, FolderOpen, BarChart3, AlertCircle, CheckCircle, X } from "lucide-react";

// Axios-like wrapper for fetch
const api = {
  get: async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return { data: await res.json() };
  },
  post: async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return { data: await res.json() };
  },
  delete: async (url) => {
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return { data: await res.json() };
  }
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
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-80 animate-slide-in`}>
      <Icon size={20} />
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:bg-white/20 rounded p-1 transition-colors">
        <X size={18} />
      </button>
    </div>
  );
};

export default function Admin() {
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
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load all data
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
    loadAll();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    try {
      await api.delete(`http://localhost:8080/admin/user/${id}`);
      showToast("User deleted successfully");
      loadUsers();
    } catch (error) {
      showToast("Failed to delete user", "error");
    }
  };

  // Delete provider
  const deleteProvider = async (id) => {
    try {
      await api.delete(`http://localhost:8080/admin/provider/${id}`);
      showToast("Provider deleted successfully");
      loadProviders();
    } catch (error) {
      showToast("Failed to delete provider", "error");
    }
  };

  // Delete category
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
      showToast("Category name cannot be empty", "error");
      return;
    }

    try {
      await api.post("http://localhost:8080/admin/category", {
        categoryName: newCategory
      });
      showToast("Category created successfully");
      setNewCategory("");
      loadCategories();
    } catch (error) {
      showToast("Failed to create category", "error");
    }
  };

  const Section = ({ title, children }) => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{title}</h2>
      {children}
    </div>
  );

  const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <h3 className="text-4xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex gap-2">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                { id: "users", label: "Users", icon: Users },
                { id: "providers", label: "Providers", icon: Package },
                { id: "categories", label: "Categories", icon: FolderOpen }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    tab === id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      {tab === "dashboard" && (
        <Section title="Dashboard Overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={Users}
              value={users.length}
              label="Total Users"
              color="bg-blue-500"
            />
            <StatCard
              icon={Package}
              value={providers.length}
              label="Total Providers"
              color="bg-purple-500"
            />
            <StatCard
              icon={FolderOpen}
              value={categories.length}
              label="Total Categories"
              color="bg-green-500"
            />
          </div>
        </Section>
      )}

      {/* Users */}
      {tab === "users" && (
        <Section title="User Management">
          <div className="mb-6">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search users..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {users
              .filter((u) => u.userName.toLowerCase().includes(searchUser.toLowerCase()))
              .map((u) => (
                <div key={u.id} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {u.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{u.userName}</p>
                      <p className="text-sm text-gray-500">{u.mailID}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-2.5 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <Trash2 className="text-gray-400 group-hover:text-red-500 transition-colors" size={20} />
                  </button>
                </div>
              ))}
          </div>
        </Section>
      )}

      {/* Providers */}
      {tab === "providers" && (
        <Section title="Provider Management">
          <div className="mb-6">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search providers..."
                value={searchProvider}
                onChange={(e) => setSearchProvider(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {providers
              .filter((p) => p.name.toLowerCase().includes(searchProvider.toLowerCase()))
              .map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteProvider(p.id)}
                    className="p-2.5 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <Trash2 className="text-gray-400 group-hover:text-red-500 transition-colors" size={20} />
                  </button>
                </div>
              ))}
          </div>
        </Section>
      )}

      {/* Categories */}
      {tab === "categories" && (
        <Section title="Category Management">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Add New Category</h3>
            <div className="flex gap-3">
              <input
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCategory()}
              />
              <button
                onClick={addCategory}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-sm"
              >
                <PlusCircle size={20} />
                Add Category
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search categories..."
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {categories
              .filter((c) => c.categoryName.toLowerCase().includes(searchCategory.toLowerCase()))
              .map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <FolderOpen className="text-white" size={20} />
                    </div>
                    <p className="font-semibold text-gray-900">{c.categoryName}</p>
                  </div>

                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="p-2.5 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <Trash2 className="text-gray-400 group-hover:text-red-500 transition-colors" size={20} />
                  </button>
                </div>
              ))}
          </div>
        </Section>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}