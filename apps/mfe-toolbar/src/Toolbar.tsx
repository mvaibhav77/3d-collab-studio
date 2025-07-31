import { useGlobalStore } from "@repo/store";
import ObjectPanel from "./components/ObjectPanel";
import TransformPanel from "./components/TransformPanel";

const Toolbar = () => {
  // Get the selected object ID from the global store
  const { selectedObjectId } = useGlobalStore();

  return (
    <div className="flex-1 grow bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 shadow-sm h-full overflow-y-auto">
      <div className="p-4 h-full">
        {/* Conditionally render based on whether an object is selected */}
        {selectedObjectId ? <TransformPanel /> : <ObjectPanel />}
      </div>
    </div>
  );
};

export default Toolbar;
