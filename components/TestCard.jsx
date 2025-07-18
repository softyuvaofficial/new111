import React from "react";

export default function TestCard({
  title,
  description,
  totalQuestions,
  durationMinutes,
  price,
  isFree = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow flex flex-col justify-between"
    >
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600 text-sm line-clamp-3">{description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-gray-500 text-sm">
        <span>{totalQuestions} Questions</span>
        <span>{durationMinutes} mins</span>
        <span>
          {isFree ? (
            <span className="text-green-600 font-semibold">Free</span>
          ) : (
            <span className="font-semibold">₹{price}</span>
          )}
        </span>
      </div>
    </div>
  );
}
