import React from "react";

interface CylinderIconProps {
  className?: string;
}

const CylinderIcon: React.FC<CylinderIconProps> = ({
  className = "w-6 h-6",
}) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <ellipse cx="12" cy="5" rx="7" ry="2" strokeWidth={1.5} />
      <ellipse cx="12" cy="19" rx="7" ry="2" strokeWidth={1.5} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5 5v14"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 5v14"
      />
    </svg>
  );
};

export default CylinderIcon;
