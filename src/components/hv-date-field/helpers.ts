/**
 * Given a Date object, returns an ISO date string (YYYY-MM-DD). If the Date
 * object is null, returns an empty string.
 */
export const createStringFromDate = (date: Date | null | undefined): string => {
  if (!date) {
    return '';
  }
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

/**
 * Given a ISO date string (YYYY-MM-DD), returns a Date object. If the string
 * cannot be parsed or is falsey, returns null.
 */
export const createDateFromString = (
  value: string | null | undefined,
): Date | null => {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(p => parseInt(p, 10));
  return new Date(year, month - 1, day);
};
