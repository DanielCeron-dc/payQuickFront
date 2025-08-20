import axios, { AxiosInstance } from 'axios';

// Create Axios instance
const API_BASE_URL = 'https://updated-backend-sqlite-no-env.fly.dev';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Types for endpoints
export interface HealthCheckResponse {
    status: 'ok';
}

export interface Product {
    id: string;
    name: string;
    price: number;
}

export interface CartItem {
    productId: number;
    quantity: number;
}

export interface TransactionRequest {
    items: CartItem[];
    customer: { email: string };
    currency: string;
}

export interface TransactionResponse {
    transactionId: string;
    amountInCents: number;
    currency: 'COP';
}

export interface PaymentMethod {
    type: 'CARD';
    token: string;
    installments: number;
}

export interface TransactionDetails {
    status: string;
}

// Health Check function
export const healthCheck = async (): Promise<HealthCheckResponse> => {
    const response = await axiosInstance.get('/health');
    return response.data;
};

// Seed Products function
export const seedProducts = async (): Promise<void> => {
    await axiosInstance.post('/products/seed');
};

// Get Products function
export const getProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/products');
    return response.data;
};

// Create Transaction function
export const createTransaction = async (transactionRequest: TransactionRequest): Promise<TransactionResponse> => {
    const response = await axiosInstance.post('/transactions', transactionRequest);
    return response.data;
};




interface PaymentResponse {
    transactionId: number;
    status: string;
    wompi: {
        data: {
            id: string;
            created_at: string;
            finalized_at: string | null;
            amount_in_cents: number;
            reference: string;
            customer_email: string;
            currency: string;
            payment_method_type: string;
            payment_method: {
                type: string;
                extra: {
                    bin: string;
                    name: string;
                    brand: string;
                    exp_year: string;
                    card_type: string;
                    exp_month: string;
                    last_four: string;
                    card_holder: string;
                    is_three_ds: boolean;
                    three_ds_auth_type: string | null;
                };
                installments: number;
            };
            status: string;
            status_message: string | null;
            billing_data: any | null;
            shipping_address: any | null;
            redirect_url: string | null;
            payment_source_id: string | null;
            payment_link_id: string | null;
            customer_data: any | null;
            bill_id: string | null;
            taxes: any[];
            tip_in_cents: number | null;
        };
        meta: any;
    };
}

// Pay Transaction function
export const payTransaction = async (
    transactionId: string,
    paymentMethod: PaymentMethod
): Promise<PaymentResponse> => {
    const response = await axiosInstance.post(`/transactions/${transactionId}/pay`, { paymentMethod });
    return response.data;
};

// Get Transaction function
export const getTransaction = async (transactionId: string): Promise<TransactionDetails> => {
    const response = await axiosInstance.get(`/transactions/${transactionId}`);
    return response.data;
};

// Usage Example
const main = async () => {
    try {
        // Health check
        const healthStatus = await healthCheck();
        console.log('Health status:', healthStatus);

        // Get products
        const products = await getProducts();
        console.log('Products:', products);

        // Create transaction
        const transactionRequest: TransactionRequest = {
            items: [{ productId: 2, quantity: 1 }],
            customer: { email: 'customer@example.com' },
            currency: 'COP',
        };
        const { transactionId } = await createTransaction(transactionRequest);
        console.log('Transaction ID:', transactionId);

        // Pay transaction
        const paymentMethod: PaymentMethod = {
            type: 'CARD',
            token: 'test-card-token',
            installments: 1,
        };
        await payTransaction(transactionId, paymentMethod);
        console.log('Transaction paid');

        // Get transaction details
        const transactionDetails = await getTransaction(transactionId);
        console.log('Transaction details:', transactionDetails);
    } catch (error) {
        console.error('Error:', error);
    }
};
