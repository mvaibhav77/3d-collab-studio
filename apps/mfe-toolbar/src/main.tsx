import { createRoot } from "react-dom/client";
import "./index.css";
import Toolbar from "./Toolbar.tsx";

createRoot(document.getElementById("root")!).render(
  <div>
    <Toolbar />
  </div>
);
