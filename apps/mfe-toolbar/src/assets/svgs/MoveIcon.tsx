import React from "react";

interface MoveIconProps {
  className?: string;
}

const MoveIcon: React.FC<MoveIconProps> = ({ className = "w-4 h-4" }) => {
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
        strokeWidth={2}
        d="M8 12h8m-4-4v8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2l3 3m-3-3l-3 3"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 22l3-3m-3 3l-3-3"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2 12l3-3m-3 3l3 3"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M22 12l-3-3m3 3l-3 3"
      />
    </svg>
  );
};

export default MoveIcon;
