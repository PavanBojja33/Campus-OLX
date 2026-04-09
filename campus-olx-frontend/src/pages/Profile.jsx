import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { itemAPI, userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import ItemCard from "../components/ItemCard";
import Modal from "../components/Modal";
import Button from "../components/Button";

function Profile() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [showSoldModal, setShowSoldModal] = useState({ open: false, itemId: null });
  const [showRemoveModal, setShowRemoveModal] = useState({ open: false, itemId: null });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    name: "",
    department: "",
    bio: "",
    phone: "",
    year: "",
    section: "",
    avatarFile: null,
    avatarPreview: "",
  });
  const { user, refetchUser } = useAuth();

  useEffect(() => {
    fetchMyItems();
  }, []);

  async function fetchMyItems() {
    try {
      const res = await itemAPI.getMyItems();
      setItems(res.data);
    } catch (error) {
      toast.error("Failed to load your items");
    } finally {
      setLoading(false);
    }
  }

  const handleMarkAsSold = async () => {
    try {
      await itemAPI.markAsSold(showSoldModal.itemId);
      toast.success("Item marked as sold");
      setShowSoldModal({ open: false, itemId: null });
      fetchMyItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as sold");
    }
  };

  const handleRemoveItem = async () => {
    try {
      await itemAPI.removeItem(showRemoveModal.itemId);
      toast.success("Item removed");
      setShowRemoveModal({ open: false, itemId: null });
      fetchMyItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleOpenEditProfile = () => {
    setProfileDraft({
      name: user?.name || "",
      department: user?.department || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      year: user?.year || "",
      section: user?.section || "",
      avatarFile: null,
      avatarPreview: user?.avatarUrl || "",
    });
    setShowEditProfile(true);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setProfileDraft((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: base64,
      }));
    } catch {
      toast.error("Failed to read image");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        name: profileDraft.name.trim(),
        department: profileDraft.department.trim(),
        bio: profileDraft.bio.trim(),
        phone: profileDraft.phone.trim(),
        year: profileDraft.year,
        section: profileDraft.section,
        avatarUrl: profileDraft.avatarPreview || "",
      };
      await userAPI.updateProfile(payload);
      toast.success("Profile updated");
      await refetchUser();
      setShowEditProfile(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const activeItems = items.filter((i) => i.status === "active" || !i.status);
  const soldItems = items.filter((i) => i.status === "sold");
  const removedItems = items.filter((i) => i.status === "removed");

  const data =
    activeTab === "active"
      ? activeItems
      : activeTab === "sold"
      ? soldItems
      : removedItems;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* PROFILE HEADER */}
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover border-2 border-primary-500"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {user?.name || "My Profile"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {user?.department || "Campus Member"} • Seller on Campus OLX
                  </p>
                  {user?.email && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {user.email}
                    </p>
                  )}
                  {/* New profile fields */}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {user?.phone && (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {user.phone}
                      </span>
                    )}
                    {user?.year && (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {user.year}
                      </span>
                    )}
                    {user?.section && (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Section {user.section}
                      </span>
                    )}
                  </div>
                  {user?.bio && (
                    <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 max-w-xl whitespace-pre-line">
                      {user.bio}
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={handleOpenEditProfile}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Active Items" value={activeItems.length} color="primary" />
          <StatCard label="Sold Items" value={soldItems.length} color="green" />
          <StatCard label="Removed Items" value={removedItems.length} color="red" />
        </div>

        {/* TABS */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex gap-6">
            <Tab
              label={`Active (${activeItems.length})`}
              active={activeTab === "active"}
              onClick={() => setActiveTab("active")}
            />
            <Tab
              label={`Sold (${soldItems.length})`}
              active={activeTab === "sold"}
              onClick={() => setActiveTab("sold")}
            />
            <Tab
              label={`Removed (${removedItems.length})`}
              active={activeTab === "removed"}
              onClick={() => setActiveTab("removed")}
            />
          </div>
        </div>

        {/* ITEMS GRID */}
        {data.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No items in this section
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {activeTab === "active"
                ? "Start selling by adding your first item!"
                : `You don't have any ${activeTab} items yet.`}
            </p>
            {activeTab === "active" && (
              <Link to="/add-item" className="inline-block mt-4">
                <Button variant="primary">Add Your First Item</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((item) => (
              <div key={item._id} className="relative">
                <Link to={`/item/${item._id}`}>
                  <ItemCard item={item} />
                </Link>
                {activeTab === "active" && (
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowSoldModal({ open: true, itemId: item._id });
                      }}
                      className="text-xs"
                    >
                      Mark Sold
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowRemoveModal({ open: true, itemId: item._id });
                      }}
                      className="text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mark as Sold Modal */}
      <Modal
        isOpen={showSoldModal.open}
        onClose={() => setShowSoldModal({ open: false, itemId: null })}
        title="Mark as Sold"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to mark this item as sold?
          </p>
          <div className="flex gap-4 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowSoldModal({ open: false, itemId: null })}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleMarkAsSold}>
              Mark as Sold
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Item Modal */}
      <Modal
        isOpen={showRemoveModal.open}
        onClose={() => setShowRemoveModal({ open: false, itemId: null })}
        title="Remove Item"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to remove this item? This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowRemoveModal({ open: false, itemId: null })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemoveItem}>
              Remove Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit profile modal */}
      <Modal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        title="Edit Profile"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {profileDraft.avatarPreview ? (
              <img
                src={profileDraft.avatarPreview}
                alt="Avatar preview"
                className="h-16 w-16 rounded-full object-cover border-2 border-primary-500"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-2xl">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                Profile picture (stored on server)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-sm text-gray-600 dark:text-gray-300"
              />

              {profileDraft.avatarPreview && (
                <button
                  type="button"
                  onClick={() =>
                    setProfileDraft((prev) => ({
                      ...prev,
                      avatarPreview: "",
                      avatarFile: null,
                    }))
                  }
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove Photo
                </button>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We encode and save as a URL string on the server.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={profileDraft.name}
                onChange={(e) => setProfileDraft((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <input
                type="text"
                value={profileDraft.department}
                onChange={(e) => setProfileDraft((prev) => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* New fields: Phone, Year, Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileDraft.phone}
                onChange={(e) => setProfileDraft((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <select
                value={profileDraft.year}
                onChange={(e) => setProfileDraft((prev) => ({ ...prev, year: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section
              </label>
              <select
                value={profileDraft.section}
                onChange={(e) => setProfileDraft((prev) => ({ ...prev, section: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short bio / description
            </label>
            <textarea
              rows={4}
              value={profileDraft.bio}
              onChange={(e) => setProfileDraft((prev) => ({ ...prev, bio: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Tell buyers a bit about yourself (course, interests, what you usually sell/buy, etc.)"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowEditProfile(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveProfile}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatCard({ label, value, color = "primary" }) {
  const colors = {
    primary: "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    red: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center">
      <p className={`text-4xl font-bold mb-2 ${colors[color]}`}>{value}</p>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 px-1 font-medium transition-colors ${
        active
          ? "border-b-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400"
          : "text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
      }`}
    >
      {label}
    </button>
  );
}

export default Profile;
