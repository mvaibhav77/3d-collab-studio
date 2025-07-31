import { useGlobalStore } from "@repo/store";
import { socket } from "../socket";
import { MoveIcon, RotateIcon, ScaleIcon } from "../assets/svgs";

const TransformPanel = () => {
  const {
    selectedObjectId,
    objects,
    updateObject,
    transformMode,
    setTransformMode,
  } = useGlobalStore();

  const transformModes = [
    {
      id: "translate" as const,
      label: "Move",
      description: "Translate position",
      icon: <MoveIcon />,
    },
    {
      id: "rotate" as const,
      label: "Rotate",
      description: "Rotate orientation",
      icon: <RotateIcon />,
    },
    {
      id: "scale" as const,
      label: "Scale",
      description: "Resize dimensions",
      icon: <ScaleIcon />,
    },
  ];

  return (
    <div className="flex flex-col space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-700 font-semibold text-sm uppercase tracking-wide">
            Transform Tools
          </h3>
          <div className="h-px bg-gradient-to-r from-primary-200 to-transparent flex-1 ml-3" />
        </div>
        <p className="text-slate-500 text-xs">
          Select a transform mode to modify the selected object
        </p>
      </div>

      {/* Transform Mode Buttons */}
      <div className="space-y-2">
        {transformModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setTransformMode(mode.id)}
            className={`
              group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl 
              transition-all duration-200 ease-out font-medium text-sm
              ${
                transformMode === mode.id
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 scale-[1.02]"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }
            `}
          >
            <div
              className={`
              flex items-center justify-center w-8 h-8 rounded-lg transition-colors
              ${
                transformMode === mode.id
                  ? "bg-white/20"
                  : "bg-primary-100 text-primary-600 group-hover:bg-primary-200"
              }
            `}
            >
              {mode.icon}
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">{mode.label}</span>
              <span
                className={`text-xs ${
                  transformMode === mode.id
                    ? "text-white/80"
                    : "text-slate-500 group-hover:text-slate-600"
                }`}
              >
                {mode.description}
              </span>
            </div>
            {transformMode === mode.id && (
              <div className="absolute inset-0 rounded-xl bg-white/10 pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {/* Color Selector */}
      {selectedObjectId && (
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="text-slate-700 font-medium text-sm">Object Color</h4>
            <div className="h-px bg-gradient-to-r from-secondary-200 to-transparent flex-1 ml-3" />
          </div>

          <div className="relative">
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
              className="w-full h-12 rounded-xl border-2 border-slate-200 hover:border-slate-300 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: objects[selectedObjectId]?.color || "#ffffff",
              }}
            />
            <div className="absolute inset-2 rounded-lg pointer-events-none border border-black/10" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Current color:</span>
            <code className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
              {objects[selectedObjectId]?.color || "#ffffff"}
            </code>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransformPanel;
