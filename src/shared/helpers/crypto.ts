import crypto from 'crypto';

/**
 * Hashes a given text using SHA-256 algorithm.
 * @param {string} text - The text to hash.
 * @returns {string} - The hashed text in hex format.
 */
export const hashUserKey = (text: string): string => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

/**
 * Verifies if the given text matches the hashed text.
 * @param {string} text - The text to verify.
 * @param {string} hashedText - The hashed text to compare against.
 * @returns {boolean} - True if the text matches the hashed text, otherwise false.
 */
export const verifyUserKey = (text: string, hashedText: string): boolean => {
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  return hash === hashedText;
};

/**
 * Checks if a given text is a valid SHA-256 hash.
 * @param {string} text - The text to check.
 * @returns {boolean} - True if the text is a valid SHA-256 hash, otherwise false.
 */
export const isSha256Hash = (text: string): boolean => {
  const sha256Regex = /^[a-fA-F0-9]{64}$/;
  return sha256Regex.test(text);
};