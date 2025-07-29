import React, { useState, useRef, useCallback } from "react";

interface ResizableSidebarProps {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  className?: string;
}

const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
  children,
  minWidth = 200,
  maxWidth = 500,
  defaultWidth = 320,
  className = "",
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback(() => {
    setIsResizing(true);

    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newWidth = mouseMoveEvent.clientX;

      // Apply constraints
      const constrainedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
      setSidebarWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [minWidth, maxWidth]);

  return (
    <div className="flex">
      {/* Resizable Sidebar */}
      <aside
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className={`flex flex-col bg-surface-50 border-r border-surface-200 shadow-sm relative ${className}`}
      >
        {children}

        {/* Resize Handle */}
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary-400 transition-colors duration-150 ${
            isResizing
              ? "bg-primary-500"
              : "bg-transparent hover:bg-primary-300"
          }`}
          onMouseDown={startResizing}
        >
          {/* Visual indicator for resize handle */}
          <div className="absolute inset-y-0 right-0 w-0.5 bg-surface-300" />
        </div>
      </aside>
    </div>
  );
};

export default ResizableSidebar;
