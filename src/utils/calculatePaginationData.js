export const calculatePaginationData = (count, page, perPage) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = Boolean(totalPages - page);
  const hasPreviousPage = page !== 1;
  const totalItems = count;

  return {
    page,
    perPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
  };
};
