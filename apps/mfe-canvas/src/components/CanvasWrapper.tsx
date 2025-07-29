import { useRef, useState } from "react";

export default function DragDropCanvas({
  children,
  onObjectDrop,
}: {
  children: React.ReactNode;
  onObjectDrop: (
    objectType: string,
    worldPosition: [number, number, number]
  ) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const objectType = event.dataTransfer.getData("text/plain");

    if (objectType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Convert screen coordinates to normalized device coordinates (-1 to 1)
      const ndcX = (x / rect.width) * 2 - 1;
      const ndcY = -(y / rect.height) * 2 + 1;

      // Convert to 3D world coordinates - place on ground plane (y = 0)
      const worldPosition: [number, number, number] = [ndcX * 10, 0, ndcY * 10];

      onObjectDrop(objectType, worldPosition);
    }
  };

  return (
    <div
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        border: isDragOver ? "2px dashed #00ff00" : "none",
        transition: "border 0.2s ease-in-out",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}
