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

function shouldSuggestSeasonPass(product, currentCount, lastPrompted, cartItemCount) {
  if (!product) return false;

  const id = (product.id || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();

  if (id.includes("season-pass")) return false;
  if (id === "heritage-box") return false;
  if (name.includes("season pass")) return false;

  if (cartItemCount > 1) return false;

  const newCount = currentCount;
  const timesPrompted = lastPrompted;
  
  if (timesPrompted === 0 && newCount === 1) return true;
  if (timesPrompted === 1 && newCount === 3) return true;
  if (timesPrompted === 3 && newCount === 6) return true;
  if (timesPrompted === 6 && newCount === 10) return true;
  if (timesPrompted === 10 && newCount === 14) return true;
  if (timesPrompted === 14 && newCount === 18) return true;
  if (timesPrompted >= 18 && (newCount - timesPrompted) >= 4) return true;

  return false;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationSource, setAnimationSource] = useState({ x: 0, y: 0 });

  const [showSeasonPassPrompt, setShowSeasonPassPrompt] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);
  const [addToCartCount, setAddToCartCount] = useState(0);
  const [lastPromptedCount, setLastPromptedCount] = useState(0);

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const setAnimationFromSource = (sourceElement, useLogoSource = false) => {
    if (useLogoSource) {
      const logoEl = document.querySelector(".mango-source-logo");

      if (logoEl) {
        const rect = logoEl.getBoundingClientRect();
        setAnimationSource({
          x: rect.left + rect.width / 2 - 24,
          y: rect.top + rect.height / 2 - 30,
        });
      } else {
        setAnimationSource({
          x: window.innerWidth / 2 - 24,
          y: 20,
        });
      }
    } else if (sourceElement) {
      const rect = sourceElement.getBoundingClientRect();
      setAnimationSource({
        x: rect.left + rect.width / 2 - 24,
        y: rect.top,
      });
    } else {
      setAnimationSource({
        x: window.innerWidth / 2 - 24,
        y: -70,
      });
    }
  };

  const commitAddToCart = (product, pack, price, sourceElement, useLogoSource = false) => {
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

    setAnimationFromSource(sourceElement, useLogoSource);
    setShowAnimation(true);
  };

  const addToCart = (product, pack, price, sourceElement, useLogoSource = false) => {
    const currentCount = addToCartCount + 1;
    setAddToCartCount(currentCount);

    if (shouldSuggestSeasonPass(product, currentCount, lastPromptedCount, items.length)) {
      setPendingCartItem({
        product,
        pack,
        price,
        sourceElement,
        useLogoSource,
      });
      setShowSeasonPassPrompt(true);
      return;
    }

    commitAddToCart(product, pack, price, sourceElement, useLogoSource);
  };

  const ignoreSeasonPassSuggestion = () => {
    if (pendingCartItem) {
      commitAddToCart(
        pendingCartItem.product,
        pendingCartItem.pack,
        pendingCartItem.price,
        pendingCartItem.sourceElement,
        pendingCartItem.useLogoSource
      );
    }

    setLastPromptedCount(addToCartCount);
    setPendingCartItem(null);
    setShowSeasonPassPrompt(false);
  };

  const viewSeasonPassDetails = () => {
    setShowSeasonPassPrompt(false);
    setPendingCartItem(null);

    const seasonPassSection = document.getElementById("season-pass-section");
    if (seasonPassSection) {
      seasonPassSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const closeSeasonPassPrompt = () => {
    setLastPromptedCount(addToCartCount);
    setShowSeasonPassPrompt(false);
    setPendingCartItem(null);
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
      `Hi Aamrutham! I'd like to order: ${summary} 🥭`
    );
  }, [items]);

  const clearCart = () => setItems([]);

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
    clearCart,
    checkoutUrl,

    showSeasonPassPrompt,
    closeSeasonPassPrompt,
    ignoreSeasonPassSuggestion,
    viewSeasonPassDetails,
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