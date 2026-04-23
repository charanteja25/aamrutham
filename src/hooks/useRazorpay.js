import { useCallback } from "react";
import { API_BASE } from "../config.js";

export function useRazorpay() {
  const openCheckout = useCallback(async ({ amount, cartItems, onSuccess, onFailure }) => {
    if (!window.Razorpay) {
      alert("Payment SDK not loaded. Please refresh and try again.");
      return;
    }

    // 1. Create order on backend
    let orderData;
    try {
      const res = await fetch(API_BASE + '/api/orders/create', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, cartItems }),
      });

      if (!res.ok) throw new Error("Order creation failed");
      orderData = await res.json();
    } catch (err) {
      console.error(err);
      onFailure?.({ description: "Could not create order. Please try again." });
      return;
    }

    // 2. Open Razorpay checkout
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: "Aamrutham",
      description: cartItems.map((i) => `${i.name} x${i.qty}`).join(", "),
      image: "/assets/Subject.png",
      theme: { color: "#2d6a4f" },

      // 3. Verify payment on backend after success
      async handler(response) {
        try {
          const verifyRes = await fetch(API_BASE + '/api/payments/verify', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer: {
                name: options.prefill?.name,
                email: options.prefill?.email,
                contact: options.prefill?.contact,
              },
            }),
          });

          if (!verifyRes.ok) throw new Error("Verification failed");
          onSuccess?.(response);
        } catch (err) {
          console.error(err);
          onFailure?.({ description: "Payment received but verification failed. Contact us on WhatsApp." });
        }
      },

      prefill: { name: "", email: "", contact: "" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", (response) => {
      onFailure?.(response.error);
    });

    rzp.open();
  }, []);

  return { openCheckout };
}
