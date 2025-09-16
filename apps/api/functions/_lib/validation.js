const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_LENGTH = 12;

export const isValidEmail = (email) => EMAIL_REGEX.test(String(email).trim().toLowerCase());

export const validatePassword = (password) => {
  const value = String(password || '');
  const errors = [];
  if (value.length < PASSWORD_LENGTH) {
    errors.push(`Lösenordet måste vara minst ${PASSWORD_LENGTH} tecken.`);
  }
  if (!/[a-z]/.test(value)) {
    errors.push('Lösenordet måste innehålla minst en liten bokstav.');
  }
  if (!/[A-Z]/.test(value)) {
    errors.push('Lösenordet måste innehålla minst en stor bokstav.');
  }
  if (!/[0-9]/.test(value)) {
    errors.push('Lösenordet måste innehålla minst en siffra.');
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    errors.push('Lösenordet måste innehålla minst ett specialtecken.');
  }
  return { valid: errors.length === 0, errors };
};

export const sanitizeEmail = (email) => String(email || '').trim().toLowerCase();
