import React from "react";

interface AvatarProps {
  name: string;
  color: string;
  size?: number;
  className?: string;
}

// Utility to get initials from name
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  color,
  size = 32,
  className = "",
}) => {
  const initials = getInitials(name);
  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white border border-white/20 shadow ${className}`}
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        fontSize: size * 0.5,
        minWidth: size,
        minHeight: size,
      }}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
