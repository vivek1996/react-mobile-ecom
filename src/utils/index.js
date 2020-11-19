/**
 * @param {array} array - An Array
 * @description Sort an Array elements in Descending Order
 * @returns an Array sorted in Descending Order
 */
export const sortArrayInDesc = (array) => {
  const temp = [...array];
  return temp.sort((a, b) => b - a);
};

/**
 * @param {array} array - An Array
 * @description Sort an Array elements in Ascending Order
 * @returns an Array sorted in Ascending Order
 */
export const sortArrayInAsc = (array) => {
  const temp = [...array];
  return temp.sort((a, b) => a - b);
};

/**
 * @param {array} array - An Array
 * @param {object} filters - Object of methods used for filtering
 * @description Filter the Array using the conditions
 * @returns an array filtered using the given conditions
 */
export const filterArray = (array, filters) => {
  const filterKeys = Object.keys(filters);
  return array.filter((item) => {
    return filterKeys.every((key) => {
      if (typeof filters[key] !== 'function') return true;
      return filters[key](item[key]);
    });
  });
};
