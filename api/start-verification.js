import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { userId, firstName, lastName, email } = req.body;

  const response = await fetch('https://api.veriff.me/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-AUTH-CLIENT': process.env.VERRIFF_API_KEY,
    },
    body: JSON.stringify({
      verification: {
        person: { firstName, lastName },
        document: { type: 'ID_CARD' },
        additionalData: { email },
        vendorData: userId, // el ID de usuario en Supabase
        callback: 'https://moonsharedliving.com/api/veriff-webhook'
      },
    }),
  });

  const data = await response.json();
  res.status(200).json({ verificationUrl: data.verification.url });
}
