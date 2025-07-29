import { useGlobalStore } from "@repo/store";

const TransformPanel = () => {
  const { transformMode, setTransformMode } = useGlobalStore();

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
    </div>
  );
};

export default TransformPanel;
