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
  X
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

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div
      className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-80 animate-slide-in`}
    >
      <Icon size={20} />
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="hover:bg-white/20 rounded p-1 transition-colors"
      >
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
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ---------------- LOADING DATA ----------------
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

  // ---------------- DELETE ACTIONS ----------------
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

  // ---------------- ADD CATEGORY ----------------
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

  // ---------------- COMPONENTS ----------------
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
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>

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
                className={`px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all ${
                  tab === id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ---------------- Dashboard ---------------- */}
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

      {/* ---------------- Users ---------------- */}
      {tab === "users" && (
        <Section title="User Management">
          <div className="mb-6 relative w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none"
              placeholder="Search users..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {users
              .filter((u) =>
                u.userName.toLowerCase().includes(searchUser.toLowerCase())
              )
              .map((u) => (
                <div
                  key={u.id}
                  className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {u.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{u.userName}</p>
                      <p className="text-gray-500 text-sm">{u.mailID}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="text-red-500" />
                  </button>
                </div>
              ))}
          </div>
        </Section>
      )}

      {/* ---------------- Providers ---------------- */}
      {tab === "providers" && (
        <Section title="Provider Management">
          <div className="mb-6 relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border rounded-xl"
              placeholder="Search providers..."
              value={searchProvider}
              onChange={(e) => setSearchProvider(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {providers
              .filter((p) =>
                p.name.toLowerCase().includes(searchProvider.toLowerCase())
              )
              .map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-gray-500 text-sm">{p.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteProvider(p.id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="text-red-500" />
                  </button>
                </div>
              ))}
          </div>
        </Section>
      )}

      {/* ---------------- Categories ---------------- */}
      {tab === "categories" && (
        <Section title="Category Management">
          {/* Add Category */}
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
            <h3 className="font-semibold mb-3">Add New Category</h3>
            <div className="flex gap-3">
              <input
                className="flex-1 px-4 py-3 border rounded-xl"
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border rounded-xl"
              placeholder="Search categories..."
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {categories
              .filter((c) =>
                c.categoryName
                  .toLowerCase()
                  .includes(searchCategory.toLowerCase())
              )
              .map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-xl shadow-sm border flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <FolderOpen className="text-white" />
                    </div>
                    <p className="font-semibold">{c.categoryName}</p>
                  </div>

                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="text-red-500" />
                  </button>
                </div>
              ))}
          </div>
        </Section>
      )}
    </div>
  );
}