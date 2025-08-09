import { forwardRef, Suspense, useEffect, useState, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import type { Group } from "@repo/three-wrapper";
import { GLTFLoader } from "@repo/three-wrapper";
import { storage } from "../lib/appwrite";
import { modelCache } from "../lib/cache";
import { useGlobalStore } from "@repo/store";

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || "3d-models";

const ModelPlaceholder = () => (
  <mesh>
    <boxGeometry args={[2, 2, 2]} />
    <meshStandardMaterial color="lightgray" wireframe />
  </mesh>
);

const ModelContent = ({ url }: { url: string }) => {
  const gltf = useLoader(GLTFLoader, url);
  const scene = useMemo(() => gltf.scene.clone(), [gltf]);
  return <primitive object={scene} />;
};

interface CustomModelProps {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  model: { appwriteId: string };
  onSelect: () => void;
}

const CustomModel = forwardRef<Group, CustomModelProps>((props, ref) => {
  // 1. Destructure props to separate our logic from Three.js group props
  const { id, model, onSelect, ...groupProps } = props;
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const updateObject = useGlobalStore((state) => state.updateObject);

  useEffect(() => {
    let objectUrl: string;

    const loadModel = async () => {
      try {
        const cachedModel = await modelCache.get(model.appwriteId);

        if (cachedModel) {
          const blob = new Blob([cachedModel], { type: "model/gltf-binary" });
          objectUrl = URL.createObjectURL(blob);
          setModelUrl(objectUrl);
        } else {
          // 2. Get the URL string from Appwrite synchronously
          const fileUrl = storage.getFileView(BUCKET_ID, model.appwriteId);

          // 3. Fetch the binary data from that URL
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch model: ${response.statusText}`);
          }
          const fileBuffer = await response.arrayBuffer(); // This is the correct ArrayBuffer

          // 4. Cache the fetched data
          await modelCache.set(model.appwriteId, fileBuffer);

          const blob = new Blob([fileBuffer], { type: "model/gltf-binary" });
          objectUrl = URL.createObjectURL(blob);
          setModelUrl(objectUrl);
        }

        // 5. Update the object state to remove the loading indicator
        updateObject(id, { loading: false });
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };

    loadModel();

    return () => {
      // Clean up the created Blob URL to prevent memory leaks
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [model.appwriteId, id, updateObject]);

  return (
    // 6. Spread only the valid props for the <group> component
    <group {...groupProps} ref={ref} onClick={onSelect}>
      <Suspense fallback={<ModelPlaceholder />}>
        {modelUrl ? <ModelContent url={modelUrl} /> : <ModelPlaceholder />}
      </Suspense>
    </group>
  );
});

CustomModel.displayName = "CustomModel";

export default CustomModel;
