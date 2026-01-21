import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
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
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link
      to={`/item/${item._id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {item.category && (
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-primary-600 text-white rounded">
            {item.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {item.title}
        </h3>
        <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          {formatPrice(item.price)}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{item.department || "N/A"}</span>
          <span>{formatDate(item.createdAt)}</span>
        </div>
        {item.seller && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Seller: {item.seller.name || "Anonymous"}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ItemCard;
