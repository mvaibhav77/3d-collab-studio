import React from "react";
import {
  CubeIcon,
  SphereIcon,
  CylinderIcon,
  ConeIcon,
  TorusIcon,
  InfoIcon,
} from "../assets/svgs";

const ObjectPanel = () => {
  const shapes = [
    {
      type: "cube",
      name: "Cube",
      color: "#3b82f6",
      icon: <CubeIcon />,
    },
    {
      type: "sphere",
      name: "Sphere",
      color: "#10b981",
      icon: <SphereIcon />,
    },
    {
      type: "cylinder",
      name: "Cylinder",
      color: "#f59e0b",
      icon: <CylinderIcon />,
    },
    {
      type: "cone",
      name: "Cone",
      color: "#ef4444",
      icon: <ConeIcon />,
    },
    {
      type: "torus",
      name: "Torus",
      color: "#8b5cf6",
      icon: <TorusIcon />,
    },
  ];

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    shapeType: string,
  ) => {
    event.dataTransfer.setData("text/plain", shapeType);
  };

  return (
    <div className="flex flex-col space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-700 font-semibold text-sm uppercase tracking-wide">
            Shape Library
          </h3>
          <div className="h-px bg-gradient-to-r from-primary-200 to-transparent flex-1 ml-3" />
        </div>
        <p className="text-slate-500 text-xs">
          Drag and drop shapes onto the canvas to create objects
        </p>
      </div>

      {/* Shapes Grid */}
      <div className="grid grid-cols-2 gap-3">
        {shapes.map((shape) => (
          <div
            key={shape.type}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, shape.type)}
            className="group relative p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl cursor-grab transition-all duration-200 text-center shadow-sm hover:shadow-md active:scale-95"
          >
            {/* Color indicator */}
            <div
              className="absolute top-3 right-3 w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
              style={{ backgroundColor: shape.color }}
            />

            {/* Shape icon */}
            <div
              className="text-slate-600 mb-3 group-hover:scale-110 group-hover:text-slate-800 transition-all duration-200 flex justify-center"
              style={{ color: shape.color }}
            >
              {shape.icon}
            </div>

            {/* Shape name */}
            <div className="text-slate-700 text-xs font-medium group-hover:text-slate-900 transition-colors">
              {shape.name}
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-50/50 to-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Usage instruction */}
      <div className="text-center py-4 px-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
        <div className="flex items-center justify-center mb-2">
          <InfoIcon className="w-4 h-4 text-primary-500 mr-2" />
          <p className="text-xs text-slate-600 font-medium">Getting Started</p>
        </div>
        <p className="text-xs text-slate-500">
          Select and drag any primitive shape to the 3D canvas to begin modeling
        </p>
      </div>
    </div>
  );
};

export default ObjectPanel;
