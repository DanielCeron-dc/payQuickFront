// Mock Payment API Service

export const API_BASE_URL = 'https://api.payquick.com' as const; // Mock URL

// ---- Types ----
export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

export interface CartItemInput {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CardInfoInput {
    number: string;         
    expiryDate: string;    
    cvv: string;            
    holderName: string;
    cardType?: CardType;
}

export interface PaymentData {
    cardInfo: CardInfoInput;
    items: CartItemInput[];
    total: number;
    currency?: string; // default USD in mock
}

export interface TransactionItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface ITransaction {
    id: string;
    status: string;
    amount: number;
    cardInfo: CardInfoInput;
    currency: 'USD' | string;
    cardLast4: string;
    timestamp: string; // ISO
    items: TransactionItem[];
    paymentMethod: {
        type: string;
        cardType: CardType;
        last4: string;
    };
}

export interface VerifyResult {
    transactionId: string;
    status: 'verified';
    timestamp: string; // ISO
}

export interface RefundResult {
    refundId: string;
    originalTransactionId: string;
    amount: number;
    status: 'refunded';
    timestamp: string; // ISO
}

// ---- Utils ----
const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

// Generate random transaction ID
const generateTransactionId = (): string =>
    'TXN_' + Math.random().toString(36).slice(2, 11).toUpperCase();

// ---- API (mocked) ----
export const processPayment = async (
    paymentData: PaymentData
): Promise<ITransaction> => {
    await delay(2000); // Simulate network delay

    const { cardInfo, items, total, currency = 'USD' } = paymentData;


    console.log('cardInfo', cardInfo)
    // Validate required fields
    if (!cardInfo.number || !cardInfo.expiryDate || !cardInfo.cvv || !cardInfo.holderName) {
        throw new Error('Missing required payment information');
    }

    // Simulate different response scenarios
    const random = Math.random();

    if (random < 0.1) {
        // 10% chance of failure
        throw new Error('Payment declined: Insufficient funds');
    } else if (random < 0.15) {
        // 5% chance of network error
        throw new Error('Network error: Please try again');
    } else if (random < 0.2) {
        // 5% chance of card error
        throw new Error('Invalid card information');
    }

    // Success scenario (80% of the time)
    const txn: ITransaction = {
        id: generateTransactionId(),
        status: 'success',
        amount: total,
        currency,
        cardInfo: cardInfo,
        cardLast4: cardInfo.number.slice(-4),
        timestamp: new Date().toISOString(),
        items: items.map<TransactionItem>((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        })),
        paymentMethod: {
            type: 'credit_card',
            cardType: cardInfo.cardType || 'unknown',
            last4: cardInfo.number.slice(-4),
        },
    };

    return txn;
};

export const verifyPayment = async (
    transactionId: string
): Promise<VerifyResult> => {
    await delay(1000);

    // Mock verification - always return success for demo
    return {
        transactionId,
        status: 'verified',
        timestamp: new Date().toISOString(),
    };
};

//! Mock function to simulate refund (not used in main flow but good to have)
export const refundPayment = async (
    transactionId: string,
    amount: number
): Promise<RefundResult> => {
    await delay(1500);

    const random = Math.random();

    if (random < 0.05) {
        throw new Error('Refund failed: Transaction not found');
    }

    return {
        refundId: 'REF_' + Math.random().toString(36).slice(2, 11).toUpperCase(),
        originalTransactionId: transactionId,
        amount,
        status: 'refunded',
        timestamp: new Date().toISOString(),
    };
};