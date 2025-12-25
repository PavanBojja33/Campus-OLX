import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    semester: "",
    department: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(e) {
    setImages(e.target.files);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!form.title || !form.price) {
        toast.error("Please fill all required fields");
        return;
    }

    if (Number(form.price) <= 0) {
        toast.error("Price must be greater than 0");
        return;
    }


    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }

      await api.post("/items/add", data);
      navigate("/marketplace");
    } catch (err) {
      setError("Failed to add item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-xl p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          Add Item
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded text-sm">
              {error}
            </div>
          )}

          <input
            name="title"
            placeholder="Item Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="category"
            placeholder="Category (Book / Lab / Drafting)"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="semester"
            placeholder="Semester"
            value={form.semester}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />

          <div className="flex gap-2 mt-2">
            {Array.from(images).map((img, i) => (
                <img
                key={i}
                src={URL.createObjectURL(img)}
                className="h-20 w-20 object-cover rounded border"
                />
            ))}
            </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
