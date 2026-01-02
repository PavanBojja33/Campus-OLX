import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Profile | Campus OLX";
    fetchMyItems();
  }, []);

  async function fetchMyItems() {
    try {
      const res = await api.get("/items/my");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }

  const activeItems = items.filter(
    (i) => i.status === "active" || !i.status
  );
  const soldItems = items.filter((i) => i.status === "sold");
  const removedItems = items.filter((i) => i.status === "removed");

  const data =
    activeTab === "active"
      ? activeItems
      : activeTab === "sold"
      ? soldItems
      : removedItems;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* PROFILE HEADER */}
      <div className="bg-white p-6 rounded-lg shadow flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
          U
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Profile
          </h1>
          <p className="text-gray-500 text-sm">
            Campus Market Seller Dashboard
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="flex gap-6 mt-6">
        <Stat label="Active" value={activeItems.length} />
        <Stat label="Sold" value={soldItems.length} />
        <Stat label="Removed" value={removedItems.length} />
      </div>

      {/* TABS */}
      <div className="flex gap-6 mt-8 border-b">
        <Tab
          label="Active"
          active={activeTab === "active"}
          onClick={() => setActiveTab("active")}
        />
        <Tab
          label="Sold"
          active={activeTab === "sold"}
          onClick={() => setActiveTab("sold")}
        />
        <Tab
          label="Removed"
          active={activeTab === "removed"}
          onClick={() => setActiveTab("removed")}
        />
      </div>

      {/* ITEMS GRID */}
      {loading ? (
        <p className="mt-6 text-gray-500">Loading...</p>
      ) : data.length === 0 ? (
        <p className="mt-6 text-gray-500">
          No items in this section
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow"
            >
              {item.images?.[0] && (
                <img
                  src={item.images[0]}
                  className="h-32 w-full object-cover rounded"
                />
              )}

              <h3 className="font-semibold mt-2">
                {item.title}
              </h3>

              <p className="text-blue-600 font-bold">
                ₹{item.price}
              </p>

              {/* ACTIONS ONLY FOR ACTIVE */}
              {activeTab === "active" && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() =>
                      api.put(`/items/sold/${item._id}`).then(fetchMyItems)
                    }
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Mark Sold
                  </button>

                  <button
                    onClick={() =>
                      api.put(`/items/remove/${item._id}`).then(fetchMyItems)
                    }
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center w-28">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 font-medium ${
        active
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-500 hover:text-blue-600"
      }`}
    >
      {label}
    </button>
  );
}

export default Profile;
