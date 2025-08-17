// paymentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { secureStore, securePaymentData, ICardInfoInput } from '../utils/encryption';
import { ITransaction } from '../services/paymentApi';

export type ICardType = '' | 'visa' | 'mastercard' | 'amex';

export interface ICardInfo {
    number: string;
    expiryDate: string; // MM/YY
    cvv: string;
    holderName: string;
}


export interface PaymentState {
    cardInfo: ICardInfo;
    cardType: ICardType;
    isProcessing: boolean;
    lastTransaction: ITransaction | null;
    error: unknown | null;
}

const initialState: PaymentState = {
    cardInfo: {
        number: '',
        expiryDate: '',
        cvv: '',
        holderName: '',
    },
    cardType: '',
    isProcessing: false,
    lastTransaction: null,
    error: null,
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        updateCardInfo: (state, action: PayloadAction<Partial<ICardInfo>>) => {
            state.cardInfo = { ...state.cardInfo, ...action.payload };
        },
        setCardType: (state, action: PayloadAction<ICardType>) => {
            state.cardType = action.payload;
        },
        startProcessing: (state) => {
            state.isProcessing = true;
            state.error = null;
        },
        processPaymentSuccess: (state, action: PayloadAction<ITransaction>) => {
            state.isProcessing = false;
            state.lastTransaction = action.payload;
            console.log('Payment processed successfully:', action.payload);
            state.error = null;

            // Securely store transaction data

            const { cardInfo, ...rest } = action.payload;
            const securedTransaction = securePaymentData({
                cardInfo: { ...cardInfo } as ICardInfoInput,
                ...rest
            });
            secureStore('lastTransaction', securedTransaction);
        },
        processPaymentFailure: (state, action: PayloadAction<unknown>) => {
            state.isProcessing = false;
            state.error = action.payload;
        },
        clearPayment: (state) => {
            state.cardInfo = {
                number: '',
                expiryDate: '',
                cvv: '',
                holderName: '',
            };
            state.cardType = '';
            state.error = null;
        },
        clearTransaction: (state) => {
            state.lastTransaction = null;
            secureStore('lastTransaction', null);
        },
        loadSecureTransaction: (state, action: PayloadAction<ITransaction | null>) => {
            if (action.payload) {
                state.lastTransaction = action.payload;
            }
        },
    },
});

export const {
    updateCardInfo,
    setCardType,
    startProcessing,
    processPaymentSuccess,
    processPaymentFailure,
    clearPayment,
    clearTransaction,
    loadSecureTransaction,
} = paymentSlice.actions;

export default paymentSlice.reducer;