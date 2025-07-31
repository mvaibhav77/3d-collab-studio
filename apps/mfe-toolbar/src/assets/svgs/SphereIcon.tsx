import React from "react";

interface SphereIconProps {
  className?: string;
}

const SphereIcon: React.FC<SphereIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 12h18"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3c2.5 3 2.5 9 0 18"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3c-2.5 3-2.5 9 0 18"
      />
    </svg>
  );
};

export default SphereIcon;
