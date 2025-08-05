import { useEffect, useState } from "react";
import { useGlobalStore } from "@repo/store";
import Avatar from "@repo/ui/avatar";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { logger } from "../lib/dev";

export default function Header() {
  const { sessionUsers, currentUserId } = useGlobalStore();
  const [showParticipants, setShowParticipants] = useState(false);

  // Generate a consistent color for each userId
  const getUserColor = (userId: string) => {
    // Simple hash function to generate a color from userId
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convert hash to hex color
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).slice(-2);
    }
    return color;
  };

  // Memoize user colors for stable rendering
  const userColors = useMemo(() => {
    const map: Record<string, string> = {};
    sessionUsers.forEach((user) => {
      map[user.id] = getUserColor(user.id);
    });
    return map;
  }, [sessionUsers]);

  const visibleUsers = sessionUsers.slice(0, 3);
  const extraCount = sessionUsers.length - visibleUsers.length;

  useEffect(() => {
    logger.info("Session users updated", sessionUsers);
  }, [sessionUsers]);

  return (
    <header className="bg-gradient-to-r from-primary-900 to-slate-700 text-white border-b border-slate-600 shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to={"/"} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">3D Collaborative Studio</h1>
              <p className="text-slate-300 text-sm">
                Build and collaborate in 3D space
              </p>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Participant Avatars */}
            <div
              className="flex items-center space-x-1 relative cursor-pointer"
              onMouseEnter={() => setShowParticipants(true)}
              onMouseLeave={() => setShowParticipants(false)}
            >
              {visibleUsers.map((user) => (
                <Avatar
                  key={user.id}
                  name={user.name}
                  color={userColors[user.id]}
                  size={32}
                  className={
                    user.id === currentUserId ? "ring-2 ring-success-400" : ""
                  }
                />
              ))}
              {extraCount > 0 && (
                <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-white text-xs font-bold border border-white/20">
                  +{extraCount}
                </div>
              )}
              {/* Tooltip/Popover for participant list */}
              {showParticipants && sessionUsers.length > 0 && (
                <div className="absolute top-10 right-0 z-50 bg-slate-800 text-white rounded-lg shadow-lg p-3 min-w-[180px] border border-slate-700 animate-fade-in">
                  <div className="font-semibold text-sm mb-2 text-slate-200">
                    Participants
                  </div>
                  <ul>
                    {sessionUsers.map((user) => (
                      <li
                        key={user.id}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Avatar
                          name={user.name}
                          color={userColors[user.id]}
                          size={24}
                        />
                        <span className="text-sm text-slate-100">
                          {user.name}
                        </span>
                        {user.id === currentUserId && (
                          <span className="ml-1 text-xs text-success-400">
                            (You)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
