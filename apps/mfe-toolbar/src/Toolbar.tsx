import React from "react";

const Toolbar = () => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    // Attach the type of object we are dragging
    event.dataTransfer.setData("text/plain", "cube");
  };

  return (
    <div className="flex flex-col space-y-2">
      <div
        draggable="true"
        onDragStart={handleDragStart}
        className="p-4 bg-gray-200 border rounded cursor-grab text-center font-bold"
      >
        Cube 🧊
      </div>
      {/* We can add more draggable items here later */}
    </div>
  );
};

export default Toolbar;
