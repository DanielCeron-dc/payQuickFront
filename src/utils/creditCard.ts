// Credit card validation utilities

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown' | '';

export const detectCardType = (number: string): CardType => {
  const cleanNumber = number.replace(/\D/g, '');

  // American Express: starts with 34 or 37 (15 digits)
  if (/^3[47]/.test(cleanNumber)) {
    return 'amex';
  }
  // Visa: starts with 4 (13-19 digits)
  if (/^4/.test(cleanNumber)) {
    return 'visa';
  }
  // Mastercard: starts with 5[1-5] or 2[2-7] (16 digits)
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return 'mastercard';
  }
  return '';
};

export const formatCardNumber = (number: string): string => {
  const digits = number.replace(/\D/g, '');

  // Detect type based on digits
  let type: CardType = 'unknown';
  if (/^3[47]/.test(digits)) type = 'amex';
  else if (/^4/.test(digits)) type = 'visa';
  else if (/^(5[1-5]|2[2-7])/.test(digits)) type = 'mastercard';

  if (type === 'amex') {
    // 15 digits max, pattern 4-6-5
    const d = digits.slice(0, 15);
    const p1 = d.slice(0, 4);
    const p2 = d.slice(4, 10);
    const p3 = d.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(' ');
  }

  // Default (Visa/MC/etc): group by 4 up to 19 digits
  const d = digits.slice(0, 19);
  const groups = d.match(/.{1,4}/g);
  return groups ? groups.join(' ') : d;
};

export const formatExpiryDate = (expiry: string): string => {
  const cleanExpiry = expiry.replace(/\D/g, '');
  if (cleanExpiry.length >= 2) {
    return cleanExpiry.slice(0, 2) + '/' + cleanExpiry.slice(2, 4);
  }
  return cleanExpiry;
};

export const validateCardNumber = (number: string): boolean => {
  if (!number) return false;
  const cleanNumber = number.replace(/\D/g, '');

  // Basic length validation per ISO: 13 to 19 digits
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }

  return true; // add luhn check
};

export const validateExpiryDate = (expiry: string): boolean => {
  const cleanExpiry = expiry.replace(/\D/g, '');
  if (cleanExpiry.length !== 4) {
    return false;
  }

  const month = parseInt(cleanExpiry.slice(0, 2), 10);
  const year = parseInt('20' + cleanExpiry.slice(2, 4), 10);

  if (month < 1 || month > 12) {
    return false;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }

  return true;
};

export const validateCVV = (cvv: string, cardType: CardType): boolean => {
  const cleanCVV = cvv.replace(/\D/g, '');

  if (cardType === 'amex') {
    return cleanCVV.length === 4;
  }

  return cleanCVV.length === 3;
};

export const validateHolderName = (name: string): boolean => {
  const n = name.trim();
  if (n.length < 2) return false;
  return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(n);
};

export const maskCardNumber = (number: string): string => {
  const cleanNumber = number.replace(/\s/g, '');
  if (cleanNumber.length < 4) return number;

  const lastFour = cleanNumber.slice(-4);
  const masked = '**** **** **** ' + lastFour;
  return masked;
};