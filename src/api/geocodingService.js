import {axios} from 'axios';
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

export const getGeocode = async (address, lenguage='es') => {
    try{
        const  corsProxy = 'https://cors-anywhere.herokuapp.com/'; // esto es un proxy para evitar el CORS
        const responde = await axios.get(`${corsProxy}https://maps.googleapis.com/maps/api/geocode/json`, {
            params : {
                address,
                lenguage,
                region: 'CO',
                key: API_KEY,
            }
        });
        return responde.data.results;
    }catch(error) {
        console.error('Error geocoding address:', error);
        throw error;
    }
}

export const getPlacePredictions = async (input, lenguage='es') => {
    try{
        const corsProxy = 'https://cors-anywhere.herokuapp.com/'; // esto es un proxy para evitar el CORS
        const responde = await axios.get(`${corsProxy}https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
            params: {
                input,
                lenguage,
                region: 'CO',
                components: 'country:CO',
                key: API_KEY,
            }
        });
        return responde.data.predictions;
    }catch(error) {
        console.error('Error getting place predictions:', error);
        throw error;
    }
}