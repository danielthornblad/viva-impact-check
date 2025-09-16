const encoder = new TextEncoder();
const ITERATIONS = 310000;
const KEY_LENGTH = 32; // 256 bit
const DIGEST = 'SHA-256';
const ALGORITHM = 'pbkdf2';

const bufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const base64ToBuffer = (base64) => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const deriveKey = async (password, salt, iterations) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: DIGEST,
      salt,
      iterations,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );
  return new Uint8Array(derivedBits);
};

const timingSafeEqual = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

export const hashPassword = async (password) => {
  if (!password) {
    throw new Error('Password is required');
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedKey = await deriveKey(password, salt, ITERATIONS);
  const saltB64 = bufferToBase64(salt);
  const hashB64 = bufferToBase64(derivedKey);
  return `${ALGORITHM}$${ITERATIONS}$${saltB64}$${hashB64}`;
};

export const verifyPassword = async (password, storedHash) => {
  if (!password || !storedHash) {
    return false;
  }
  const parts = storedHash.split('$');
  if (parts.length !== 4) {
    return false;
  }
  const [algorithm, iterationStr, saltB64, hashB64] = parts;
  if (algorithm !== ALGORITHM) {
    return false;
  }
  const iterations = Number(iterationStr);
  if (!Number.isInteger(iterations) || iterations <= 0) {
    return false;
  }
  try {
    const salt = base64ToBuffer(saltB64);
    const derivedKey = await deriveKey(password, salt, iterations);
    const computedHash = bufferToBase64(derivedKey);
    return timingSafeEqual(computedHash, hashB64);
  } catch (error) {
    console.error('Password verification failed', error);
    return false;
  }
};
