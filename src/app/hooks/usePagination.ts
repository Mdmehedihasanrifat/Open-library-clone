import { useState, useEffect } from 'react';

interface PaginationOptions<T> {
  data: T[];
  itemsPerPage: number;
}

export const usePagination = <T>({ data, itemsPerPage }: PaginationOptions<T>) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Calculate total pages based on data length and items per page
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } 
  }, [data, itemsPerPage]);

  // Ensure data is sliced correctly based on current page
  const currentData = Array.isArray(data)
    ? data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
    : [];

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Check if "next" or "previous" buttons should be disabled
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  return {
    currentData,
    nextPage,
    prevPage,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};
