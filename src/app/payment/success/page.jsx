import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status, payment_status, metadata, payment_intent } = session;

  const customerEmail = session.customer_details?.email;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete" && payment_status === "paid") {
    const res = await fetch(
      `${process.env.BACKEND_URL}/payments/checkout-verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session_id,
        }),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Payment verification failed");
    }

    console.log(result);

    console.log(
      status,
      payment_status,
      customerEmail,
      metadata,
      payment_intent,
    );

    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return redirect("/payment");
}
