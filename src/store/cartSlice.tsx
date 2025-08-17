import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';



export interface IProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    rating: number;
    stock: number;
}


// ---- Types ----
export interface ICartItem {
    id: string;
    product: IProduct;
    quantity: number;
}

export interface ICartState {
    items: ICartItem[];
    total: number;
}

const initialState: ICartState = {
    items: [],
    total: 0,
};

// ---- Slice ----
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Omit<ICartItem, 'quantity'>>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, id: action.payload.id, product: action.payload.product, quantity: 1 });
            }
            state.total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            void AsyncStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            state.total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            void AsyncStorage.setItem('cart', JSON.stringify(state));
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ id: string; quantity: number }>
        ) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(i => i.id !== id);
                } else {
                    item.quantity = quantity;
                }
            }
            state.total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            void AsyncStorage.setItem('cart', JSON.stringify(state));
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            void AsyncStorage.setItem('cart', JSON.stringify(state));
        },
        loadCart: (state, action: PayloadAction<ICartState>) => {
            state.items = action.payload.items || [];
            state.total = action.payload.total || 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;