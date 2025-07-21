const SkeletonCard = () => {
  return (
    <div className="max-w-xl w-64 rounded overflow-hidden shadow-lg m-4 animate-pulse">
      <div className="placeholder-image bg-gray-300 h-64"></div>
      <div className="px-6 py-4">
        <div className="flex justify-between">
          <div className="placeholder-button bg-gray-300 w-10 h-10 rounded-full"></div>
          <div className="placeholder-button bg-gray-300 w-10 h-10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
