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

  const baseButtonClass =
    "w-full text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200";
  const activeButtonClass = "bg-primary-600 shadow-md";
  const inactiveButtonClass = "bg-primary-500 hover:bg-primary-600";

  return (
    <div className="flex flex-col space-y-3">
      <h3 className="text-slate-700 font-semibold text-sm uppercase tracking-wide border-b border-slate-300 pb-2">
        Transform
      </h3>
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
          className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      )}
    </div>
  );
};

export default TransformPanel;
