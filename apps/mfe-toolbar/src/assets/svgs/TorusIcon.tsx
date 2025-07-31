import React from "react";

interface TorusIconProps {
  className?: string;
}

const TorusIcon: React.FC<TorusIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
      <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
    </svg>
  );
};

export default TorusIcon;
