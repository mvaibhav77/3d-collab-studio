import { useState } from "react";
import { useGlobalStore } from "@repo/store";
import ObjectPanel from "./components/ObjectPanel";
import TransformPanel from "./components/TransformPanel";
import UploadPanel from "./components/UploadPanel"; // Import the new component

const Toolbar: React.FC = () => {
  const { selectedObjectId } = useGlobalStore();
  const [activeTab, setActiveTab] = useState<"shapes" | "uploads">("shapes");

  if (selectedObjectId) {
    return (
      <div className="flex-1 grow p-4 bg-slate-100 border-r border-slate-300 shadow-lg h-full">
        <TransformPanel />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 grow p-4 bg-slate-100 border-r border-slate-300 shadow-lg h-full">
      {/* Tabbing UI */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("shapes")}
          className={`py-2 px-4 text-sm font-medium ${activeTab === "shapes" ? "border-b-2 border-primary-500 text-primary-600" : "text-slate-500"}`}
        >
          Shapes
        </button>
        <button
          onClick={() => setActiveTab("uploads")}
          className={`py-2 px-4 text-sm font-medium ${activeTab === "uploads" ? "border-b-2 border-primary-500 text-primary-600" : "text-slate-500"}`}
        >
          Uploads
        </button>
      </div>

      {/* Conditional Panel Display */}
      {activeTab === "shapes" && <ObjectPanel />}
      {activeTab === "uploads" && <UploadPanel />}
    </div>
  );
};

export default Toolbar;
