Description:
  The official moonpay/moonpay-sign repository provides a transaction signing implementation that is insecure by default. The endpoint src/app/api/sign/route.ts accepts a
  user-provided URL and signs its query string with the merchant's private SIGNING_SECRET without any authentication or domain validation.

  Because the repository lacks any security warnings and explicitly provides "one-click" deployment instructions (Vercel), it serves as a dangerous template that leads
  developers to deploy public signing oracles.

  Technical Details:
   - Vulnerable Sink: crypto.createHmac(...).update(new URL(body.url).search).digest('base64')
   - Source: Direct client-controlled POST body.
   - Flaw: No isAuthorized check and no domain whitelisting.

  Impact:
  An attacker can forge signatures for any transaction parameters (amount, wallet address, etc.). This allows them to authorize fraudulent transactions through MoonPay's
  frontend by abusing the merchant's signature-generating backend.

  Ethical Proof of Concept (Verified Locally):
   1. Cloned moonpay-sign.
   2. Sent a POST to /api/sign with: {"url": "https://buy.moonpay.com?amount=99999&walletAddress=attacker_wallet"}.
   3. Received a valid HMAC signature that authorizes the modified parameters.

  Recommendation:
   1. Update the code to construct URLs server-side based on session data.
   2. Add a CRITICAL SECURITY WARNING to the README.
