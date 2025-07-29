const ObjectPanel = () => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", "cube");
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-bold text-center mb-2">Shapes</h3>
      <div
        draggable="true"
        onDragStart={handleDragStart}
        className="p-4 bg-gray-200 border rounded cursor-grab text-center font-bold"
      >
        Cube 🧊
      </div>
    </div>
  );
};

export default ObjectPanel;