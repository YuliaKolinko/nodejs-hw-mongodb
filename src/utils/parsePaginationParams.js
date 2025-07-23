const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';
  if (!isString) {
    return defaultValue;
  }
  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }
  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);
  const sortBy = query.sortBy || 'name';
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
  const type = query.type;
  const isFavorite = query.isFavorite;
  return {
    page: parsedPage,
    perPage: parsedPerPage,
    sortBy,
    sortOrder,
    filters: {
      ...(type && { contactType: type }),
      ...(isFavorite !== undefined && { isFavourite: isFavorite === 'true' }),
    },
  };
};
