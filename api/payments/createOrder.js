import fetch from "node-fetch";

const INSTAMOJO_API_URL = "https://test.instamojo.com/api/1.1/payment-requests/"; // sandbox URL, switch to production for live

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { amount, purpose, buyer_name, email, phone, redirect_url } = req.body;

  if (!amount || !purpose || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch(INSTAMOJO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.INSTAMOJO_API_KEY,
        "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN,
      },
      body: JSON.stringify({
        amount: amount.toString(),
        purpose,
        buyer_name: buyer_name || "Customer",
        email,
        phone: phone || "",
        redirect_url: redirect_url || "https://yourwebsite.com/payment-success",
        send_email: false,
        send_sms: false,
        allow_repeated_payments: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "Instamojo error" });
    }

    // Payment request created, return payment_url for frontend redirection
    return res.status(200).json({ payment_request: data.payment_request });
  } catch (error) {
    console.error("Instamojo create payment error:", error);
    return res.status(500).json({ error: "Failed to create payment request" });
  }
}
