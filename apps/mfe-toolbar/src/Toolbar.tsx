import { useGlobalStore } from "@repo/store";
import ObjectPanel from "./components/ObjectPanel";
import TransformPanel from "./components/TransformPanel";

const Toolbar = () => {
  // Get the selected object ID from the global store
  const { selectedObjectId } = useGlobalStore();

  return (
    <div className="p-2 bg-gray-100 rounded-lg">
      {/* Conditionally render based on whether an object is selected */}
      {selectedObjectId ? <TransformPanel /> : <ObjectPanel />}
    </div>
  );
};

export default Toolbar;
