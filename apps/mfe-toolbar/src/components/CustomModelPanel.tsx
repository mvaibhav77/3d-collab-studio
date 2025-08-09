import React, { Suspense } from "react";
import { useGlobalStore } from "@repo/store";
import type { CustomModel } from "@repo/types";
import CustomModelFallback from "./CustomModelsFallback";

const CustomModelPanelContent = () => {
  const { customModels } = useGlobalStore();

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    model: CustomModel
  ) => {
    const dragData = {
      type: "customModel",
      model,
    };
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-slate-700 font-semibold text-sm uppercase tracking-wide border-b border-slate-300 pb-2">
        Uploaded Models
      </h3>
      {customModels.length === 0 ? (
        <p className="text-slate-500 text-xs text-center p-4">
          No models uploaded for this session yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {customModels.map((model) => (
            <div
              key={model.id}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, model)}
              className="group p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-grab text-center shadow-sm"
            >
              <div className="text-2xl mb-1">📦</div>
              <div className="text-slate-700 text-xs font-medium truncate">
                {model.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomModelPanel = () => (
  <Suspense fallback={<CustomModelFallback />}>
    <CustomModelPanelContent />
  </Suspense>
);

export default CustomModelPanel;
