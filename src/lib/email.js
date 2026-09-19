async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("\n--- EMAIL (no RESEND_API_KEY set, printing instead of sending) ---");
    console.log(`To: ${to}\nSubject: ${subject}\n${html}`);
    console.log("--- end email ---\n");
    return { simulated: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Meridian <onboarding@yourdomain.com>",
      to, subject, html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Email send failed: ${res.status} ${body}`);
  }
  return res.json();
}

module.exports = { sendEmail };
