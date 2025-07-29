import { createRoot } from "react-dom/client";
import "./index.css";
import Scene from "./Scene.tsx";

createRoot(document.getElementById("root")!).render(
  <div>
    <h1>This is the mfe-canvas application.</h1>
    <div className="canvs-container h-screen w-screen">
      <Scene />
    </div>
  </div>
);
