"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const confirmPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const session_id = urlParams.get("session_id");

      if (!session_id) {
        toast.error("Invalid session!");
        router.push("/");
        return;
      }

      try {
        const res = await fetch("/api/confirmpayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id }),
        });

        const data = await res.json();
        if (data.message) {
          toast.success("Payment confirmed! 🎉 Check your email.");
        } else {
          toast.error("Payment verification failed.");
        }
      } catch (error) {
        toast.error("An error occurred.");
      }
    };

    confirmPayment();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Payment Successful 🎉</h1>
      <p>We've sent a confirmation email with your purchase details.</p>
      <button onClick={() => router.push("/")} style={{ marginTop: "20px" }}>
        Go to Home
      </button>
    </div>
  );
}
