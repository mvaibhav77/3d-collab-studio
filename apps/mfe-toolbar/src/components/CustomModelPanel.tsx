import React, { useEffect } from 'react';
import { useGlobalStore } from '@repo/store';
import { socket } from '../socket';
import type { CustomModel } from '@repo/types';

const CustomModelPanel = () => {
  const { customModels, addCustomModel } = useGlobalStore();

  // Set up the socket listener
  useEffect(() => {
    const onModelAdded = (model: CustomModel) => {
      addCustomModel(model);
    };

    socket.on('session:model_added', onModelAdded);

    return () => {
      socket.off('session:model_added', onModelAdded);
    };
  }, [addCustomModel]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, model: CustomModel) => {
    // When dragging, we'll pass the whole model object as a string
    // The canvas will then parse this to get the appwriteId
    event.dataTransfer.setData("application/json", JSON.stringify(model));
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-slate-700 font-semibold text-sm uppercase tracking-wide border-b border-slate-300 pb-2">
        Uploaded Models
      </h3>
      {customModels.length === 0 ? (
        <p className="text-slate-500 text-xs text-center p-4">No models uploaded for this session yet.</p>
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
              <div className="text-slate-700 text-xs font-medium truncate">{model.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomModelPanel;