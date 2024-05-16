import { reactive } from 'vue';
import type { CartItem } from "@/type/CartItem.ts";

const state = reactive({
  cart: [] as CartItem[],
});

function addToCart(produit: any) {
    state.cart.push({ id: getCartCount()+1, produit, quantity: 1 });
}

function addOne(id: number) {
    const item = state.cart.find((item) => item.id === id);
    if (item) {
      item.quantity++;
  }
}

function removeOne(id: number) {
    const item = state.cart.find((item) => item.id === id);
    if (item) {
      item.quantity--;
      if (item.quantity === 0) {
        removeFromCart(id);
      }
  }
}

function removeFromCart(id: number) {
    state.cart = state.cart.filter((item) => item.id !== id);
}

function getCartCount() {
  return state.cart.length;
}

function getCartItems() {
  return state.cart;
}

function getTotal() {
  return state.cart.reduce((total, cartItem) => total + cartItem.produit.prix * cartItem.quantity, 0);
}

function clearCart() {
    state.cart = [];
} 


export default {
    state,
    getCartCount,
    getCartItems,
    addToCart,
    addOne,
    removeOne,
    removeFromCart,
    getTotal,
    clearCart
  };