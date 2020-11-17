export const sortArrayInDesc = (array) => {
  const temp = [...array];
  return temp.sort((a, b) => b - a);
};

export const sortArrayInAsc = (array) => {
  const temp = [...array];
  return temp.sort((a, b) => a - b);
};

export const filterArray = (array, filters) => {
  const filterKeys = Object.keys(filters);
  return array.filter((item) => {
    return filterKeys.every((key) => {
      if (typeof filters[key] !== 'function') return true;
      return filters[key](item[key]);
    });
  });
};
