import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  loading = false,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-4 py-2 rounded-md font-semibold text-white
        bg-blue-600 hover:bg-blue-700
        disabled:bg-gray-400 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
        transition
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 mx-auto text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
