import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    if (start > 2) {
      range.push("...");
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages - 1) {
      range.push("...");
    }

    return [1, ...range, totalPages];
  };

  if (totalPages === 1) {
    return (
      <div className="flex justify-center my-4">
        <button
          className="flex items-center justify-center w-10 h-10 px-4 py-2 mx-1 text-white rounded-full bg-cyan-700"
          disabled
        >
          1
        </button>
      </div>
    );
  }

  const paginationRange = getPaginationRange();

  return (
    <div className="flex justify-center my-4">
      <button
        className="px-4 py-2 mx-1 font-bold text-white text-gray-500 rounded-full"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {paginationRange.map((page, index) => (
        <button
          key={index}
          className={`px-4 py-2 mx-1 rounded-full w-10 h-10 flex items-center justify-center ${
            page === currentPage
              ? "bg-cyan-700 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => page !== "..." && onPageChange(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}
      <button
        className="px-4 py-2 mx-1 font-bold text-white text-gray-500 rounded-full"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
