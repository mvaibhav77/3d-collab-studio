import React from "react";
import { ChevronLeft, ChevronRight } from "@repo/ui/icons";
import type { SessionHistoryItem } from "@repo/types";

interface SessionHistoryCardProps {
  title: string;
  subtitle?: string;
  sessions: SessionHistoryItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSessionClick: (session: SessionHistoryItem) => void;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptySubtitle?: string;
  formatLastVisited: (date: Date) => string;
  sessionNameClass?: string;
  sessionHoverClass?: string;
  paginationColorClass?: string;
}

const SessionHistoryCard: React.FC<SessionHistoryCardProps> = ({
  title,
  subtitle,
  sessions,
  currentPage,
  totalPages,
  onPageChange,
  onSessionClick,
  emptyIcon,
  emptyTitle,
  emptySubtitle,
  formatLastVisited,
  sessionNameClass = "",
  sessionHoverClass = "",
  paginationColorClass = "",
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Gradient header, icon only in header */}
      <div className="px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-600">
        <h2 className="text-2xl font-bold text-white flex items-center">
          {emptyIcon}
          {title}
        </h2>
        {subtitle && <p className="text-white mt-1">{subtitle}</p>}
      </div>
      <div className="p-8">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            {/* Only show icon in header, not here */}
            <p className="text-gray-500 text-lg font-medium">{emptyTitle}</p>
            {emptySubtitle && (
              <p className="text-gray-400 text-sm mt-1">{emptySubtitle}</p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onSessionClick(session)}
                  className={`group p-4 border-2 border-gray-100 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${sessionHoverClass}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`font-bold text-gray-800 transition-colors ${sessionNameClass}`}
                      >
                        {session.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        {/* Clock icon */}
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formatLastVisited(session.lastVisited)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className={`flex items-center justify-between mt-6 pt-4 border-t border-gray-200 ${paginationColorClass}`}
              >
                <button
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    onPageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SessionHistoryCard;
