import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "../Services/Score.service";

function PaymentPage() {
  const checkoutMutation = useMutation({
    mutationFn: (plan: "monthly" | "yearly") => createCheckoutSession(plan),

    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },

    onError: (error) => {
      console.error("Failed to create checkout session:", error);
    },
  });

  const handleSubscribe = (plan: "monthly" | "yearly") => {
    checkoutMutation.mutate(plan);
  };

  return (
    <div>
      <button
        onClick={() => handleSubscribe("monthly")}
        disabled={checkoutMutation.isPending}
      >
        {checkoutMutation.isPending ? "Processing..." : "Subscribe Monthly"}
      </button>

      <button
        onClick={() => handleSubscribe("yearly")}
        disabled={checkoutMutation.isPending}
      >
        {checkoutMutation.isPending ? "Processing..." : "Subscribe Yearly"}
      </button>
    </div>
  );
}

export default PaymentPage;
