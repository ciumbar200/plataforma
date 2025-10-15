import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { status, vendorData } = req.body.verification;

  if (status === 'approved') {
    await supabase
      .from('profiles')
      .update({ verified: true })
      .eq('id', vendorData);
  }

  res.status(200).send('ok');
}
