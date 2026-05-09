import { useState } from "react";
import api from "../api/axios";
import { CartContext } from "./CartContextValue";

function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  const getCart = async () => {
    const res = await api.get("/cart");
    setCart(res.data);
    return res.data;
  };

  const addToCart = async (product, quantity = 1) => {
    const res = await api.post("/cart", { product, quantity });

    if (res.data.cart) {
      setCart(res.data.cart);
      return res.data;
    }

    await getCart();
    return res.data;
  };

  const updateCartItem = async (productId, quantity) => {
    const res = await api.put(`/cart/${productId}`, { quantity });

    if (res.data.cart) {
      setCart(res.data.cart);
      return res.data;
    }

    await getCart();
    return res.data;
  };

  const removeCartItem = async (productId) => {
    const res = await api.delete(`/cart/${productId}`);

    if (res.data.cart) {
      setCart(res.data.cart);
      return res.data;
    }

    await getCart();
    return res.data;
  };

  const clearCart = async () => {
    const res = await api.delete("/cart");

    if (res.data.cart) {
      setCart(res.data.cart);
      return res.data;
    }

    setCart({ items: [] });
    return res.data;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        getCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
