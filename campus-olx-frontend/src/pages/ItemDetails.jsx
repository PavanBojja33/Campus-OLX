import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { itemAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSoldModal, setShowSoldModal] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await itemAPI.getItems({ limit: 1000 });
      const foundItem = res.data.items.find((i) => i._id === id);
      if (foundItem) {
        setItem(foundItem);
      } else {
        toast.error("Item not found");
        navigate("/marketplace");
      }
    } catch (error) {
      toast.error("Failed to load item");
      navigate("/marketplace");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleMarkAsSold = async () => {
    try {
      await itemAPI.markAsSold(id);
      toast.success("Item marked as sold");
      setShowSoldModal(false);
      fetchItem();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update item");
    }
  };

  const handleRemoveItem = async () => {
    try {
      await itemAPI.removeItem(id);
      toast.success("Item removed");
      setShowDeleteModal(false);
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleContactSeller = () => {
    if (!item?.seller) {
      toast.error("Seller information not available");
      return;
    }
    setShowContactModal(true);
  };

  // Check if current user is the owner (seller can be ObjectId string or populated object)
  const sellerId = item?.seller?._id || item?.seller;
  const currentUserId = user?.userId || user?._id;
  const isOwner = sellerId && currentUserId && sellerId.toString() === currentUserId.toString();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Marketplace
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-square">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[imageIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      imageIndex === idx
                        ? "border-primary-600 dark:border-primary-400"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <img src={img} alt={`${item.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h1>
                {item.category && (
                  <span className="px-3 py-1 text-sm font-semibold bg-primary-600 text-white rounded">
                    {item.category}
                  </span>
                )}
              </div>
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Description
                </h3>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {item.description || "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Department
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {item.department || "N/A"}
                  </p>
                </div>
                {item.semester && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Semester
                    </h3>
                    <p className="text-gray-900 dark:text-white">{item.semester}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Seller
                </h3>
                <div className="flex items-start gap-3">
                  {item.seller?.avatarUrl ? (
                    <img
                      src={item.seller.avatarUrl}
                      alt="Seller avatar"
                      className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white font-semibold">
                      {item.seller?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {item.seller?.name || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.seller?.department || "Campus Member"}
                    </p>
                    {item.seller?.bio && (
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {item.seller.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Listed On
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(item.createdAt)}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    item.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : item.status === "sold"
                      ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              {isOwner ? (
                <>
                  {item.status === "active" && (
                    <>
                      <Link to={`/edit-item/${id}`} className="flex-1">
                        <Button variant="primary" fullWidth>
                          Edit Item
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => setShowSoldModal(true)}
                      >
                        Mark as Sold
                      </Button>
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </>
              ) : (
                item.status === "active" && (
                  <Button variant="primary" fullWidth onClick={handleContactSeller}>
                    Contact Seller
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Seller"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            You can contact <strong>{item.seller?.name || "the seller"}</strong> at:
          </p>
          {item.seller?.email ? (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Email:</p>
              <a
                href={`mailto:${item.seller.email}`}
                className="text-primary-600 dark:text-primary-400 hover:underline break-all"
              >
                {item.seller.email}
              </a>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Email information is not available. Please check your campus directory.
            </p>
          )}
        </div>
      </Modal>

      {/* Mark as Sold Modal */}
      <Modal
        isOpen={showSoldModal}
        onClose={() => setShowSoldModal(false)}
        title="Mark as Sold"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to mark this item as sold?
          </p>
          <div className="flex gap-4 justify-end">
            <Button variant="ghost" onClick={() => setShowSoldModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleMarkAsSold}>
              Mark as Sold
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Item"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to remove this item? This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemoveItem}>
              Remove Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ItemDetails;
