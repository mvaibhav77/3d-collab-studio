const ToolbarFallback = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <div className="text-neutral-500 text-sm">Loading Toolbar...</div>
      </div>
    </div>
  );
};

export default ToolbarFallback;
