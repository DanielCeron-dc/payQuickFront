// secureStorage.ts
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import SHA256 from 'crypto-js/sha256';

// NOTE (prod): don’t hardcode secrets. Use Keychain/Keystore or native config.
const SECRET_KEY = 'PayQuick2024SecureKey!@#$%' as const;
const STORAGE_PREFIX = 'payquick_encrypted_' as const;

// ---------- Types ----------
export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [k: string]: JsonValue };

export interface TransactionData {
    id: string;
    status: string;
    amount: number;
    timestamp: number | string; // unix or ISO
}

export type SecuredCardNumber = {
    masked: string;
    hash: string;
    last4: string;
};

export type ICardInfoInput = {
    number: string; // raw (may include spaces)
    cvv: string;
    [k: string]: unknown;
};

export type CardInfoSecured = Omit<ICardInfoInput, 'number' | 'cvv'> & {
    number: SecuredCardNumber;
    cvv?: undefined; // never store CVV
};

export type SecurePaymentData<T extends { cardInfo: ICardInfoInput }> = Omit<
    T,
    'cardInfo'
> & {
    cardInfo: CardInfoSecured;
};

// ---------- Crypto helpers ----------
export const encryptData = (data: unknown): string => {
    try {
        const jsonString = JSON.stringify(data);
        return AES.encrypt(jsonString, SECRET_KEY).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};

export const decryptData = <T = unknown>(encryptedData: string): T => {
    try {
        const bytes = AES.decrypt(encryptedData, SECRET_KEY);
        const jsonString = bytes.toString(encUtf8);
        if (!jsonString) throw new Error('Invalid secret or corrupted payload');
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
};

// ---------- AsyncStorage wrappers ----------
export const secureStore = async <T = unknown>(
    key: string,
    data: T
): Promise<boolean> => {
    try {
        const encryptedData = encryptData(data);
        await AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, encryptedData);
        return true;
    } catch (error) {
        console.error('Secure store error:', error);
        return false;
    }
};

export const secureRetrieve = async <T = unknown>(
    key: string
): Promise<T | null> => {
    try {
        const encryptedData = await AsyncStorage.getItem(
            `${STORAGE_PREFIX}${key}`
        );
        if (!encryptedData) return null;
        return decryptData<T>(encryptedData);
    } catch (error) {
        console.error('Secure retrieve error:', error);
        return null;
    }
};

export const secureRemove = async (key: string): Promise<boolean> => {
    try {
        await AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`);
        return true;
    } catch (error) {
        console.error('Secure remove error:', error);
        return false;
    }
};

// ---------- Hashing / masking ----------
export const hashData = (data: string): string => {
    try {
        return SHA256(data).toString();
    } catch (error) {
        console.error('Hash error:', error);
        throw new Error('Failed to hash data');
    }
};

/**
 * Masks card number and returns masked + SHA-256 hash + last4.
 * - Supports 16-digit (Visa/Mastercard) and 15-digit (AmEx).
 * - For other lengths ≥4, still reveals only last4.
 */
export const secureCardNumber = (cardNumber: string): SecuredCardNumber => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    const lastFour = cleanNumber.slice(-4);

    let masked: string;
    if (cleanNumber.length === 15) {
        masked = `**** ****** *${lastFour}`; // AmEx 4-6-5
    } else if (cleanNumber.length === 16) {
        masked = `**** **** **** ${lastFour}`; // 4-4-4-4
    } else {
        const hidden = cleanNumber
            .slice(0, -4)
            .replace(/./g, '*')
            .replace(/(.{4})/g, '$1 ')
            .trim();
        masked = `${hidden} ${lastFour}`.trim();
    }

    return {
        masked,
        hash: hashData(cleanNumber),
        last4: lastFour,
    };
};

// ---------- Validation ----------
export const validateTransactionData = (
    transaction: unknown
): transaction is TransactionData => {
    if (!transaction || typeof transaction !== 'object') return false;
    const obj = transaction as Record<string, unknown>;
    const required: Array<keyof TransactionData> = [
        'id',
        'status',
        'amount',
        'timestamp',
    ];
    return required.every((k) => Object.prototype.hasOwnProperty.call(obj, k));
};

// ---------- Payment securing ----------
export const securePaymentData = <T extends { cardInfo: ICardInfoInput }>(
    paymentData: T
): SecurePaymentData<T> => {
    const { cardInfo, ...rest } = paymentData;

    console.log('Securing payment data for:', cardInfo);

    const securedData: SecurePaymentData<T> = {
        ...(rest as Omit<T, 'cardInfo'>),
        cardInfo: {
            ...cardInfo,
            number: secureCardNumber(cardInfo.number),
            cvv: undefined, // never store CVV
        },
    };
    return securedData;
};