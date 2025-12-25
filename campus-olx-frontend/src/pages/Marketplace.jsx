import { useEffect, useState } from "react";
import api from "../services/api";
import ItemSkeleton from "../components/ItemSkeleton";

function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    semester: "",
    department: "",
    category: "",
  });

  // 🔹 Page title (professional)
  useEffect(() => {
    document.title = "Marketplace | Campus OLX";
  }, []);

  // 🔹 Fetch when filters change
  useEffect(() => {
    fetchItems();
  }, [filters]);

  async function fetchItems() {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/items", {
        params: {
          semester: filters.semester || undefined,
          department: filters.department || undefined,
          category: filters.category || undefined,
        },
      });
      setItems(res.data.items || res.data);
    } catch {
        toast.error("Server not reachable. Try again later.");      
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  // 🔍 Search-as-you-type (safe)
  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-gray-800">
        Marketplace
      </h1>

      {/* FILTER BAR */}
      <div className="bg-white p-3 rounded-md shadow mt-4 flex flex-wrap gap-3 items-center">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm w-full sm:w-48"
        />

        {/* CATEGORY */}
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">Category</option>
          <option value="Book">Book</option>
          <option value="Lab">Lab</option>
          <option value="Drafting">Drafting</option>
        </select>

        {/* SEMESTER */}
        <select
          value={filters.semester}
          onChange={(e) =>
            setFilters({ ...filters, semester: e.target.value })
          }
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">Semester</option>
          {[1,2,3,4,5,6,7,8].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* DEPARTMENT */}
        <select
          value={filters.department}
          onChange={(e) =>
            setFilters({ ...filters, department: e.target.value })
          }
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
        </select>

        {/* CLEAR */}
        <button
          onClick={() => {
            setFilters({ semester: "", department: "", category: "" });
            setSearch("");
          }}
          className="text-sm text-gray-600 hover:text-blue-600 transition"
        >
          Clear
        </button>
      </div>

      {/* LOADING SKELETON */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, i) => (
            <ItemSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <p className="mt-6 text-red-500">{error}</p>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredItems.length === 0 && (
        <div className="mt-10 text-center text-gray-500">
          <p className="text-lg">No items found</p>
          <p className="text-sm mt-2">
            Try changing filters or search keywords.
          </p>
        </div>
      )}

      {/* ITEMS GRID */}
      {!loading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow hover:scale-[1.02] hover:shadow-md transition-all"
            >
              {item.images?.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="h-40 w-full object-cover rounded"
                />
              )}

              <h2 className="mt-3 font-semibold text-gray-800">
                {item.title}
              </h2>

              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {item.description || "No description provided"}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {item.department} • Semester {item.semester}
              </p>

              <p className="text-blue-600 font-bold mt-2">
                ₹{item.price}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Seller: {item.seller?.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Marketplace;
