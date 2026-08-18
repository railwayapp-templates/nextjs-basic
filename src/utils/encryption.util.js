const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const ENCRYPTED_VALUE_PATTERN = /^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/i;

const getEncryptionKey = () => {
  const secret = process.env.CLIENT_CONFIG_ENCRYPTION_KEY;

  if (!secret) {
    throw new Error('CLIENT_CONFIG_ENCRYPTION_KEY is not configured');
  }

  return crypto.scryptSync(secret, 'client-config-encryption-salt', 32);
};

const encrypt = (value) => {
  if (value == null || value === '') {
    return value;
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
};

const decrypt = (value) => {
  if (value == null || value === '') {
    return value;
  }

  const stringValue = String(value);

  if (!ENCRYPTED_VALUE_PATTERN.test(stringValue)) {
    return stringValue;
  }

  const [ivHex, authTagHex, encryptedHex] = stringValue.split(':');
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(ivHex, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
};

module.exports = {
  encrypt,
  decrypt,
};
