import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ICartItem {
    id?: number;
    productId?: number;
    categoryId?: number;
    name?: string;
    categoryName?: string;
    quantity?: number;
    price?: number;
    sizeName?: string;
    imageName?: string;
}

export  interface ICartState {
    items: ICartItem[];
    totalPrice: number;
}


const initialState: ICartState = {
    items: JSON.parse(localStorage.getItem('cart') || '[]'),
    totalPrice: 0
}


const localCartSlice = createSlice({
    name: 'localCart',
    initialState,
    reducers: {
 
        addItem: (state, action: PayloadAction<ICartItem>) => {
            const existing = state.items.find(i => i.productId === action.payload.productId);
            if (existing) {
                existing.quantity! += action.payload.quantity!;
            } else {
                state.items.push(action.payload);
            }
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(i => i.productId !== action.payload);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem('cart');
        }
    },
});

export const {
    // createUpdateCart,
    addItem,
    clearCart,
    removeItem} = localCartSlice.actions;


export default localCartSlice.reducer;