export default function Pagination({ currentPage, totalCount, pageSize, onPageChange }) {
  const totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages === 0) return null;

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-indigo-500 text-white disabled:opacity-50"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => goToPage(i + 1)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i + 1 ? "bg-indigo-700 text-white" : "bg-indigo-300 text-indigo-900"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-indigo-500 text-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
