import { useGlobalStore } from "@repo/store";
import ObjectPanel from "./components/ObjectPanel";
import TransformPanel from "./components/TransformPanel";

const Toolbar = () => {
  // Get the selected object ID from the global store
  const { selectedObjectId } = useGlobalStore();

  return (
    <div className="flex-1 grow p-4 bg-slate-100 border-r border-slate-300 shadow-lg h-100">
      {/* Conditionally render based on whether an object is selected */}
      {selectedObjectId ? <TransformPanel /> : <ObjectPanel />}
    </div>
  );
};

export default Toolbar;
