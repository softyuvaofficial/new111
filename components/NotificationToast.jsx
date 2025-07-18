import React, { useEffect } from "react";

export default function NotificationToast({ message, type = "info", onClose }) {
  // Auto close after 3.5 seconds
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-400",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 max-w-xs rounded shadow-lg text-white px-4 py-3 flex items-center space-x-3 ${
        bgColors[type] || bgColors.info
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-1">{message}</div>
      <button
        onClick={onClose}
        className="focus:outline-none"
        aria-label="Close notification"
      >
        <svg
          className="w-5 h-5 text-white hover:text-gray-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
