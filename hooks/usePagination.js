import { useState, useMemo } from "react";

export default function usePagination({ totalItems, itemsPerPage = 10, initialPage = 1 }) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the indices for slicing data arrays
  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
  const endIndex = useMemo(() => Math.min(startIndex + itemsPerPage, totalItems), [startIndex, itemsPerPage, totalItems]);

  // Helper to jump to page safely
  const goToPage = (page) => {
    if (page < 1) setCurrentPage(1);
    else if (page > totalPages) setCurrentPage(totalPages);
    else setCurrentPage(page);
  };

  // Move to next page
  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  // Move to previous page
  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
  };
}
