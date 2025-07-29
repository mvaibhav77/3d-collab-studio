import React from "react";

const Toolbar: React.FC = () => {
  return (
    <div style={{ border: "2px dashed red", padding: "1rem" }}>
      <h2 style={{ color: "red" }}>I am the Toolbar MFE!</h2>
      <p>
        This entire component is being served from mfe-toolbar running on its
        own port.
      </p>
      <button onClick={() => alert("Button clicked in toolbar MFE!")}>
        A Button from the Toolbar
      </button>
    </div>
  );
};

export default Toolbar;
