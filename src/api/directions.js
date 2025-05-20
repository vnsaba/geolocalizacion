// api/directions.js

export default async function handler(req, res) {
  const { origin, destination, mode = 'driving', language = 'es' } = req.query;

  const API_KEY = import.meta.VITE_GOOGLE_MAPS_API_KEY

  if (!origin || !destination) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&language=${language}&region=co&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener direcciones' });
  }
}
