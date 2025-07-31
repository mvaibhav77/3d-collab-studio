import React from "react";

interface ConeIconProps {
  className?: string;
}

const ConeIcon: React.FC<ConeIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <ellipse cx="12" cy="19" rx="7" ry="2" strokeWidth={1.5} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5 19L12 3l7 16"
      />
    </svg>
  );
};

export default ConeIcon;
