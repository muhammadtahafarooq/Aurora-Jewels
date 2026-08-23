/* ─── Edge-compatible password hashing ─── */
/* PBKDF2 via WebCrypto (available in Cloudflare Workers) */

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = 'SHA-256';

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: DIGEST,
      salt,
      iterations: ITERATIONS,
    },
    keyMaterial,
    KEY_LENGTH * 8,
  );
  const hashArray = new Uint8Array(derivedBits);
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(hashArray).map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${ITERATIONS}:${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [iterationsStr, saltHex, hashHex] = stored.split(':');
  if (!iterationsStr || !saltHex || !hashHex) return false;

  const iterations = parseInt(iterationsStr, 10);
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: DIGEST,
      salt,
      iterations,
    },
    keyMaterial,
    KEY_LENGTH * 8,
  );
  const newHashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time comparison
  if (newHashHex.length !== hashHex.length) return false;
  let result = 0;
  for (let i = 0; i < newHashHex.length; i++) {
    result |= newHashHex.charCodeAt(i) ^ hashHex.charCodeAt(i);
  }
  return result === 0;
}
