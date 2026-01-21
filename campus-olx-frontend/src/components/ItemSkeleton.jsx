function ItemSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse border border-gray-200 dark:border-gray-700">
      <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mt-2 w-1/2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mt-2 w-2/3"></div>
    </div>
  );
}

export default ItemSkeleton;
