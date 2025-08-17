import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';
import paymentSlice from './paymentSlice';


export const store = configureStore({
  reducer: {
    cart: cartSlice,
    payment: paymentSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
