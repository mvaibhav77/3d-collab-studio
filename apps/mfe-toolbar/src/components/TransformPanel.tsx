import { useGlobalStore } from "@repo/store";
import { socket } from "../socket";

const TransformPanel = () => {
  const {
    selectedObjectId,
    objects,
    updateObject,
    transformMode,
    setTransformMode,
  } = useGlobalStore();

  const baseButtonClass = "w-full text-white font-bold py-2 px-4 rounded";
  const activeButtonClass = "bg-blue-700";
  const inactiveButtonClass = "bg-blue-500 hover:bg-blue-600";

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-bold text-center mb-2">Transform</h3>
      <button
        onClick={() => setTransformMode("translate")}
        className={`${baseButtonClass} ${transformMode === "translate" ? activeButtonClass : inactiveButtonClass}`}
      >
        Move
      </button>
      <button
        onClick={() => setTransformMode("rotate")}
        className={`${baseButtonClass} ${transformMode === "rotate" ? activeButtonClass : inactiveButtonClass}`}
      >
        Rotate
      </button>
      <button
        onClick={() => setTransformMode("scale")}
        className={`${baseButtonClass} ${transformMode === "scale" ? activeButtonClass : inactiveButtonClass}`}
      >
        Scale
      </button>
      {/* Color Selector */}
      {selectedObjectId && (
        <input
          type="color"
          value={objects[selectedObjectId]?.color || "#ffffff"}
          onChange={(e) => {
            const newColor = e.target.value;
            updateObject(selectedObjectId, { color: newColor });
            socket.emit("object:color_change", {
              id: selectedObjectId,
              color: newColor,
            });
          }}
          className="w-full p-2 border border-gray-300 rounded"
        />
      )}
    </div>
  );
};

export default TransformPanel;
