import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find(item => item.food._id === food._id);
      if (existing) {
        return prev.map(item => item.food._id === food._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { food, quantity: 1, price: food.price }];
    });
  };

  const removeFromCart = (foodId) => {
    setCart((prev) => {
      const existing = prev.find(item => item.food._id === foodId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.food._id === foodId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.food._id !== foodId);
    });
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
