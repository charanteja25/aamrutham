/**
 * InventoryContext
 *
 * Polls GET /api/inventory every 30 s and provides:
 *   getAvailable(productId, packLabel) → number (or null while loading)
 *   refreshInventory()                 → manually re-fetch after cart changes
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const InventoryContext = createContext(null);

const POLL_INTERVAL_MS = 30_000; // 30 seconds

export function InventoryProvider({ children }) {
  const [inventoryMap, setInventoryMap] = useState(null); // null = not loaded yet

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch("/api/inventory");
      if (!res.ok) return;
      const data = await res.json();
      setInventoryMap(data.inventory ?? {});
    } catch {
      // Network error — keep stale data, try again next poll
    }
  }, []);

  useEffect(() => {
    fetchInventory();
    const id = setInterval(fetchInventory, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchInventory]);

  /** Returns available qty, or null if inventory hasn't loaded yet. */
  function getAvailable(productId, packLabel) {
    if (inventoryMap === null) return null;
    const key = `${productId}|${packLabel}`;
    return inventoryMap[key] ?? null;
  }

  return (
    <InventoryContext.Provider value={{ getAvailable, refreshInventory: fetchInventory }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used inside <InventoryProvider>");
  return ctx;
}
