import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { buildWhatsAppUrl } from "../data/products";

const CART_KEY = "aamrutham_cart";
const CartContext = createContext(null);

function readCart() {
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationSource, setAnimationSource] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, pack, price, sourceElement, useLogoSource = false) => {
    const key = `${product.id}||${pack}`;

    setItems((current) => {
      const found = current.find((item) => item.key === key);

      if (found) {
        return current.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [
        ...current,
        {
          key,
          id: product.id,
          name: product.name,
          packLabel: pack,
          price,
          qty: 1,
        },
      ];
    });

    // Store the source element position for animation
    if (useLogoSource) {
      // Get the logo position from the navbar
      const logoEl = document.querySelector('.mango-source-logo');
      if (logoEl) {
        const rect = logoEl.getBoundingClientRect();
        setAnimationSource({
          x: rect.left + rect.width / 2 - 24,
          y: rect.top + rect.height / 2 - 30,
        });
      } else {
        // Fallback to center top of screen
        setAnimationSource({
          x: window.innerWidth / 2 - 24,
          y: 20,
        });
      }
    } else if (sourceElement) {
      const rect = sourceElement.getBoundingClientRect();
      setAnimationSource({
        x: rect.left + rect.width / 2 - 24, // Center of button, offset for mango width
        y: rect.top,
      });
    } else {
      // Default to center of screen if no source element
      setAnimationSource({
        x: window.innerWidth / 2 - 24,
        y: -70,
      });
    }

    setShowAnimation(true);
  };

  const hideAnimation = () => {
    setShowAnimation(false);
  };

  const changeQty = (key, delta) => {
    setItems((current) =>
      current.map((item) =>
        item.key === key
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeItem = (key) => {
    setItems((current) => current.filter((item) => item.key !== key));
  };

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.qty * item.price, 0),
    [items]
  );

  const checkoutUrl = useMemo(() => {
    const summary = items
      .map((item) => `${item.name} x${item.qty} (${item.packLabel})`)
      .join(", ");

    return buildWhatsAppUrl(
      `Hi Aamrutham! I'd like to pre-order: ${summary} 🥭 Could you share availability and pricing?`
    );
  }, [items]);

  const value = {
    items,
    count,
    total,
    isOpen,
    setIsOpen,
    showAnimation,
    animationSource,
    hideAnimation,
    addToCart,
    changeQty,
    removeItem,
    checkoutUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}