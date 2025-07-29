const ObjectPanel = () => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", "cube");
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-slate-700 font-semibold text-sm uppercase tracking-wide border-b border-slate-300 pb-2">
        Shapes
      </h3>
      <div
        draggable="true"
        onDragStart={handleDragStart}
        className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-grab transition-colors duration-200 text-center shadow-sm"
      >
        <div className="text-2xl mb-1">🧊</div>
        <div className="text-slate-700 text-sm font-medium">Cube</div>
      </div>
    </div>
  );
};

export default ObjectPanel;
