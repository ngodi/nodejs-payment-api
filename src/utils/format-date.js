export const toDateNumeric = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const toDateString = (dateString) => {
  return new Date(dateString * 1000).toISOString()
}