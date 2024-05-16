import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};
const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const cartId = new Date().getTime();
      const existItem = state.cartItems.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (existItem >= 0) {
        state.cartItems[existItem].quantity =
          state.cartItems[existItem].quantity + action.payload.count;
        state.cartItems[existItem].totalPrice =
          action.payload.productDetail.basePrice *
          state.cartItems[existItem].quantity;
      } else {
        state.cartItems.push({
          id: cartId,
          productId: action.payload.productId,
          productName: action.payload.productDetail.name,
          quantity: action.payload.count,
          price: action.payload.productDetail.basePrice,
          image: action.payload.productDetail.images[0][1].url,
          weightServing: action.payload.productDetail.weightServing,
          storeId: action.payload.productDetail.storeId,
          storeName: action.payload.productDetail.storeName,
          totalPrice:
            action.payload.count * action.payload.productDetail.basePrice,
        });
      }
    },
    increaseQuantity(state, action) {
      const existItem = state.cartItems.findIndex(
        (item) => item.productId === action.payload.id
      );
      state.cartItems[existItem].quantity =
        state.cartItems[existItem].quantity + 1;
      state.cartItems[existItem].totalPrice =
        action.payload.price * state.cartItems[existItem].quantity;
    },
    decreaseQuantity(state, action) {
      const existItem = state.cartItems.findIndex(
        (item) => item.productId === action.payload.id
      );
      if (state.cartItems[existItem].quantity > 1) {
        state.cartItems[existItem].quantity =
          state.cartItems[existItem].quantity - 1;
        state.cartItems[existItem].totalPrice =
          action.payload.price * state.cartItems[existItem].quantity;
      } else {
        return;
      }
    },
    removeItem(state, action) {
      const items = state.cartItems.filter(
        (item) => item.productId !== action.payload
      );
      state.cartItems = items;
    },
    clearCart(state, action) {
      state.cartItems = [];
    },
  },
});

export const {
  addItemToCart,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  clearCart,
} = cart.actions;

export default cart.reducer;
