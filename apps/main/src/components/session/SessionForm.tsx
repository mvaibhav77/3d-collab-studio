import React from "react";
import {
  User,
  FileText,
  Link as LinkIcon,
  Loader2,
  ArrowRight,
} from "@repo/ui/icons";

interface SessionFormProps {
  userName: string;
  setUserName: (v: string) => void;
  sessionName?: string;
  setSessionName?: (v: string) => void;
  sessionInput?: string;
  setSessionInput?: (v: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  submitLabel: string;
  submitIcon?: React.ReactNode;
  userNameLabel?: string;
  sessionNameLabel?: string;
  sessionInputLabel?: string;
  sessionInputAdornment?: React.ReactNode;
  disabled?: boolean;
  urlSessionId?: string;
}

const SessionForm: React.FC<SessionFormProps> = ({
  userName,
  setUserName,
  sessionName,
  setSessionName,
  sessionInput,
  setSessionInput,
  isLoading,
  onSubmit,
  submitLabel,
  submitIcon,
  userNameLabel = "Your Name",
  sessionNameLabel = "Session Name",
  sessionInputLabel = "Session URL or ID",
  sessionInputAdornment,
  disabled = false,
  urlSessionId,
}) => {
  return (
    <div className="space-y-6">
      {/* User Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {userNameLabel}
        </label>
        <div className="relative">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your display name"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            disabled={isLoading || disabled}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <User className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Session Name Input (for create) */}
      {typeof sessionName !== "undefined" && setSessionName && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {sessionNameLabel}
          </label>
          <div className="relative">
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g., 'My 3D House Project'"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
              disabled={isLoading || disabled}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Session Input (for join) */}
      {typeof sessionInput !== "undefined" && setSessionInput && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {sessionInputLabel}
          </label>
          <div className="relative">
            <input
              type="text"
              value={sessionInput}
              onChange={(e) => setSessionInput(e.target.value)}
              placeholder="Paste session URL or enter session ID"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              disabled={isLoading || disabled}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              {sessionInputAdornment || (
                <LinkIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          {urlSessionId && (
            <p className="text-sm text-blue-600 mt-2">
              Session ID pre-filled from URL
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={
          isLoading ||
          disabled ||
          !userName.trim() ||
          (typeof sessionName !== "undefined" && !sessionName.trim()) ||
          (typeof sessionInput !== "undefined" && !sessionInput.trim())
        }
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            {submitLabel}...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {submitIcon || <ArrowRight className="w-5 h-5 mr-2" />}
            {submitLabel}
          </div>
        )}
      </button>
    </div>
  );
};

export default SessionForm;
