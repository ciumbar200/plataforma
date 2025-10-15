export default async function handler(req, res) {
  console.log('Verriff status update:', req.body);
  res.status(200).send('ok');
}
