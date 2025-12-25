function ItemSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow animate-pulse">
      <div className="h-40 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded mt-4"></div>
      <div className="h-3 bg-gray-200 rounded mt-2 w-1/2"></div>
    </div>
  );
}

export default ItemSkeleton;
