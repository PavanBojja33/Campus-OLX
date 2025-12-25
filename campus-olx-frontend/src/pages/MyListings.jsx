import { useEffect, useState } from "react";
import api from "../services/api";

function MyListings() {
  const [data, setData] = useState({
    active: [],
    sold: [],
    removed: []
  });

  // STEP 3 GOES HERE 👇 (FETCH MY LISTINGS)
  useEffect(() => {
    fetchMyItems();
  }, []);

  function fetchMyItems() {
    api.get("/items/my").then(res => setData(res.data));
  }

  async function deleteItem(id) {
    await api.delete(`/items/${id}`);
    fetchMyItems(); // refresh lists
  }

  async function markSold(id) {
    await api.put(`/items/sold/${id}`);
    fetchMyItems(); // refresh lists
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold">My Listings</h1>

      {/* ACTIVE ITEMS */}
      <h2 className="text-xl font-semibold mt-6">Active Items</h2>
      {data.active.length === 0 && (
        <p className="text-gray-500 mt-2">No active listings</p>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-4">
        {data.active.map(item => (
          <div key={item._id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-gray-600">₹{item.price}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => markSold(item._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Sold
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SOLD ITEMS */}
      <h2 className="text-xl font-semibold mt-10">Sold Items</h2>
      {data.sold.length === 0 && (
        <p className="text-gray-500 mt-2">No sold items</p>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-4">
        {data.sold.map(item => (
          <div key={item._id} className="bg-white p-4 rounded shadow opacity-70">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-gray-600">₹{item.price}</p>
            <p className="text-green-600 mt-2">✔ Sold</p>
          </div>
        ))}
      </div>

      {/* REMOVED ITEMS */}
      <h2 className="text-xl font-semibold mt-10">Removed Items</h2>
      {data.removed.length === 0 && (
        <p className="text-gray-500 mt-2">No removed items</p>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-4">
        {data.removed.map(item => (
          <div key={item._id} className="bg-white p-4 rounded shadow opacity-50">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-gray-600">₹{item.price}</p>
            <p className="text-red-500 mt-2">✖ Removed</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListings;
