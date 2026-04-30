import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 16;
const AUTH_TAG_LENGTH_BYTES = 16;
const KEY_LENGTH_BYTES = 32;

function getEncryptionKey(): Buffer {
  const rawKey = process.env.ENCRYPTION_KEY;

  if (!rawKey) {
    throw new Error('ENCRYPTION_KEY is required for OAuth token encryption');
  }

  const key = /^[0-9a-f]{64}$/i.test(rawKey)
    ? Buffer.from(rawKey, 'hex')
    : Buffer.from(rawKey, 'base64');

  if (key.length !== KEY_LENGTH_BYTES) {
    throw new Error('ENCRYPTION_KEY must decode to 32 bytes');
  }

  return key;
}

export function encryptSecret(secret: string | null | undefined): string | null {
  if (!secret) return null;

  const iv = crypto.randomBytes(IV_LENGTH_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH_BYTES,
  });

  const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return ['v1', iv.toString('base64'), authTag.toString('base64'), encrypted.toString('base64')].join(':');
}

export function decryptSecret(encryptedSecret: string | null | undefined): string | null {
  if (!encryptedSecret) return null;

  const [version, ivBase64, authTagBase64, encryptedBase64] = encryptedSecret.split(':');
  if (version !== 'v1' || !ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error('Encrypted secret has an invalid format');
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivBase64, 'base64'),
    { authTagLength: AUTH_TAG_LENGTH_BYTES }
  );
  decipher.setAuthTag(Buffer.from(authTagBase64, 'base64'));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
