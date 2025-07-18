import fetch from "node-fetch";

const INSTAMOJO_PAYMENT_STATUS_URL = "https://test.instamojo.com/api/1.1/payments/";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { payment_id } = req.body;

  if (!payment_id) {
    return res.status(400).json({ error: "Missing payment_id" });
  }

  try {
    const response = await fetch(INSTAMOJO_PAYMENT_STATUS_URL + payment_id + "/", {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.INSTAMOJO_API_KEY,
        "X-Auth-Token": process.env.INSTAMOJO_AUTH_TOKEN,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "Instamojo error" });
    }

    // Payment status info in data.payment
    if (data.payment && data.payment.status === "Credit") {
      // Payment successful
      return res.status(200).json({ success: true, payment: data.payment });
    } else {
      // Payment not successful
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Instamojo payment verification error:", error);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
}
