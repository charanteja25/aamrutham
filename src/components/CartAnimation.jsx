import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import MangoThattaAnimation from "./MangoThattaAnimation";
import { useCart } from "../context/CartContext";

export default function CartAnimation() {
  const { showAnimation, hideAnimation, animationSource } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !showAnimation) return null;

  return createPortal(
    <MangoThattaAnimation 
      active={showAnimation} 
      onDone={hideAnimation} 
      sourcePosition={animationSource}
    />,
    document.body
  );
}
