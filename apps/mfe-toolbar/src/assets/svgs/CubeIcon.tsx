import React from "react";

interface CubeIconProps {
  className?: string;
}

const CubeIcon: React.FC<CubeIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6 8l6-4 6 4v8l-6 4-6-4V8z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6 8l6 4 6-4"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 12v8"
      />
    </svg>
  );
};

export default CubeIcon;
