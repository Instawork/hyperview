/**
 * Provides a random UUID string.
 * @returns {string}
 */
export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

/**
 * Provides a random UUID number.
 * @returns {number}
 */
export const uuidNumber = (): number => {
  return parseInt(uuid().replace(/-/g, ''), 16);
};
