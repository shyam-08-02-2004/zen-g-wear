import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Signs a short-lived ACCESS token used to authenticate normal API requests.
 */
export const generateAccessToken = (id) => {
  return jwt.sign({ id, type: 'access' }, process.env.JWT_SECRET, {
    expiresIn: '30y', // 30 years (safe for 32-bit maxAge)
  });
};

/**
 * Signs a long-lived REFRESH token used only to mint new access tokens.
 * Signed with a separate secret so a leaked access token can't be replayed
 * as a refresh token and vice versa.
 */
export const generateRefreshToken = (id) => {
  return jwt.sign({ id, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30y', // 30 years (safe for 32-bit maxAge)
  });
};

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

/**
 * SHA-256 hashes a raw token (e.g. email verification / password reset tokens,
 * or refresh tokens before persisting them) so the plaintext is never stored.
 */
export const hashToken = (rawToken) =>
  crypto.createHash('sha256').update(rawToken).digest('hex');

/**
 * Generates a cryptographically random raw token plus its SHA-256 hash.
 * The raw value is sent to the user (email link); the hash is what's stored.
 */
export const generateRawAndHashedToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(rawToken);
  return { rawToken, hashedToken };
};
