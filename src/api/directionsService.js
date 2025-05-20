import axios from 'axios';
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
export const getDirections = async ({
    origin,
    destination,
    mode = 'driving',
    lenguage = 'es',
}) => {
    try {

        const corsProxy = 'https://cors-anywhere.herokuapp.com/'; // esto es un proxy para evitar el CORS
        const responde = await axios.get(` ${corsProxy}https://maps.googleapis.com/maps/api/directions/json`, {
            params: {
                origin,
                destination,
                mode,
                lenguage,
                region: 'CO',
                key: API_KEY,
            }
        }
        );
        return responde.data;
    } catch (error) {
        console.error('Error fetching directions:', error);
        throw error;
    }
}