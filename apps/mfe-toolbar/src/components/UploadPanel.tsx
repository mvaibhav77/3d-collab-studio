import React, { useState } from "react";
import { storage, ID } from "../lib/appwrite"; // Import our Appwrite service
import { useGlobalStore } from "@repo/store";
import CustomModelPanel from "./CustomModelPanel";
import { apiClient } from "../lib/api";

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || "3d-models";

const UploadPanel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [modelName, setModelName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const { sessionId, addCustomModel } = useGlobalStore();

  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !modelName) {
      setError("Please select a file and provide a name.");
      return;
    }

    setStatus("uploading");
    setError(null);

    // 1. Upload to Appwrite
    try {
      if (sessionId === null) {
        throw new Error(
          "Session ID is not set. Please create or join a session first."
        );
      }

      console.log(BUCKET_ID, ID.unique(), file);
      // main upload to Appwrite Storage
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file);

      // Save model details to the database
      const model = await apiClient.add3dModel(sessionId, modelName, response.$id);
      
      addCustomModel(model);
      setStatus("success");
      setFile(null);
      setModelName("");
    } catch (e) {
      console.error("Failed to upload file:", e);
      setError("Upload failed. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-4 p-1">
        <h3 className="text-slate-700 font-semibold text-sm uppercase tracking-wide border-b border-slate-300 pb-2">
          Upload Model
        </h3>

        <div className="space-y-2">
          <label
            htmlFor="modelName"
            className="text-sm font-medium text-slate-600"
          >
            Model Name
          </label>
          <input
            id="modelName"
            type="text"
            placeholder="e.g., 'Vintage Chair'"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="file-upload"
            className="text-sm font-medium text-slate-600"
          >
            Model File (.glb)
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".glb"
            onChange={handleFileChange}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={status === "uploading"}
          className="w-full text-white font-bold py-2 px-4 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400"
        >
          {status === "uploading" ? "Uploading..." : "Upload"}
        </button>

        {status === "success" && (
          <p className="text-green-600 text-sm">Upload successful!</p>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
      <CustomModelPanel />
    </div>
  );
};

export default UploadPanel;
