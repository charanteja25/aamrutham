import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { buildWhatsAppUrl } from "../data/products";
import { isSeasonPassActive } from "../data/season";

const CART_KEY = "aamrutham_cart";
// Flag written when the user clicks "View Season Pass" in the popup, so a
// subsequent Season Pass add-to-cart knows to replace the cart instead of
// appending. Session-scoped — doesn't survive tab close.
const PASS_SWITCH_FLAG = "aamrutham_pass_switch_from_popup";
const CartContext = createContext(null);

function readCart() {
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function isSeasonPassProduct(product) {
  if (!product) return false;
  const id = (product.id || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  return id.includes("season-pass") || name.includes("season pass");
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationSource, setAnimationSource] = useState({ x: 0, y: 0 });

  const [showSeasonPassPrompt, setShowSeasonPassPrompt] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);
  // Suppress repeat prompts for the rest of the session once the user decides.
  const [passPromptDismissed, setPassPromptDismissed] = useState(false);

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

  const commitAddToCart = (product, pack, price, sourceElement, useLogoSource = false, meta = null) => {
    const key = `${product.id}||${pack}`;
    const isPass = isSeasonPassProduct(product);

    // If the user came to /maas by way of the popup and is now adding the
    // Season Pass, replace the cart: the pass supersedes the individual items
    // they were originally considering. For any other scenario, append normally.
    let switchFromPopup = false;
    try {
      switchFromPopup = isPass && window.sessionStorage.getItem(PASS_SWITCH_FLAG) === "1";
      if (switchFromPopup) window.sessionStorage.removeItem(PASS_SWITCH_FLAG);
    } catch { /* sessionStorage can throw in some private-mode browsers */ }

    setItems((current) => {
      // Popup-initiated pass switch: discard everything else, keep only the pass.
      if (switchFromPopup) {
        return [{
          key,
          id: product.id,
          name: product.name,
          packLabel: pack,
          price,
          qty: 1,
          meta: meta || undefined,
        }];
      }

      const found = current.find((item) => item.key === key);

      if (found) {
        // For items with meta (e.g. gift orders), always add as new line
        if (meta) {
          return [...current, { key: `${key}||${Date.now()}`, id: product.id, name: product.name, packLabel: pack, price, qty: 1, meta }];
        }
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
          meta: meta || undefined,
        },
      ];
    });

    setAnimationFromSource(sourceElement, useLogoSource);
    setShowAnimation(true);
  };

  const addToCart = (product, pack, price, sourceElement, useLogoSource = false, meta = null) => {
    // Prompt once per session when the cart grows beyond a single item.
    // Skip for the season pass itself, and for repeat views after the user decides.
    const alreadyHasItem = items.length >= 1;
    if (alreadyHasItem && !isSeasonPassProduct(product) && !passPromptDismissed && isSeasonPassActive()) {
      setPendingCartItem({ product, pack, price, sourceElement, useLogoSource, meta });
      setShowSeasonPassPrompt(true);
      return;
    }
    commitAddToCart(product, pack, price, sourceElement, useLogoSource, meta);
  };

  const ignoreSeasonPassSuggestion = () => {
    if (pendingCartItem) {
      commitAddToCart(
        pendingCartItem.product,
        pendingCartItem.pack,
        pendingCartItem.price,
        pendingCartItem.sourceElement,
        pendingCartItem.useLogoSource,
        pendingCartItem.meta
      );
    }
    setPendingCartItem(null);
    setShowSeasonPassPrompt(false);
    setPassPromptDismissed(true);
  };

  const viewSeasonPassDetails = () => {
    setShowSeasonPassPrompt(false);
    setPendingCartItem(null);
    setPassPromptDismissed(true);
    // Arm the "replace cart on Season Pass add" flag. If the user actually
    // adds the pass after arriving at /maas, commitAddToCart clears the rest.
    // If they come back without adding, the cart is unchanged.
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(PASS_SWITCH_FLAG, "1");
      }
    } catch { /* ignore */ }
    if (typeof window !== "undefined") {
      window.location.href = "/maas";
    }
  };

  const closeSeasonPassPrompt = () => {
    setShowSeasonPassPrompt(false);
    setPendingCartItem(null);
    setPassPromptDismissed(true);
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