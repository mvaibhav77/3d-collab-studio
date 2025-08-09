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
    const data = event.dataTransfer.getData("text/plain");
    // Removed console.log for production cleanup
    if (data && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Convert screen coordinates to normalized device coordinates (-1 to 1)
      const ndcX = (x / rect.width) * 2 - 1;
      const ndcY = -(y / rect.height) * 2 + 1;

      // For 3D canvas, place objects at a reasonable distance from center
      // This creates a more natural distribution around the origin
      const scaleFactor = 8;
      const worldPosition: [number, number, number] = [
        ndcX * scaleFactor,
        0, // Place on ground plane
        ndcY * scaleFactor,
      ];

      onObjectDrop(data, worldPosition);
    }
  };

  return (
    <div
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        border: isDragOver ? "2px dashed #00ff00" : "1px solid #e0e0e0",
        transition: "border 0.2s ease-in-out",
        backgroundColor: isDragOver ? "#f0fff0" : "#fafafa",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}
