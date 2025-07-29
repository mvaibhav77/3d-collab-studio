const CanvasFallback = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <div className="text-neutral-700 text-lg font-medium">
          Loading 3D Canvas...
        </div>
        <div className="text-neutral-500 text-sm mt-2">
          Preparing your collaborative workspace
        </div>
      </div>
    </div>
  );
};

export default CanvasFallback;
