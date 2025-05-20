import { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY;

// Este hook utiliza la API de Places 
export const useLocation = () => {
    const [autocompleteService, setAutocompleteService] = useState(null);
    const [geocoder, setGeocoder] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar los servicios al montar el componente 
    useEffect(() => {
        if (window.google && window.google.maps) {
            setAutocompleteService(new
                window.google.maps.places.AutocompleteService());
            setGeocoder(new window.google.maps.Geocoder());
        }
    }, []);

    // Buscar predicciones de lugares 
    const searchPlaces = (query, options = {}) => {
        if (!query || query.length < 2 || !autocompleteService) return;

        setLoading(true);
        setError(null);

        const searchOptions = {
            input: query,
            componentRestrictions: { country: 'co' },
            ...options
        };

        autocompleteService.getPlacePredictions(
            searchOptions,
            (results, status) => {
                setLoading(false);

                if (status === window.google.maps.places.PlacesServiceStatus.OK &&
                    results) {
                    setPredictions(results);
                } else {
                    setPredictions([]);
                    if (status !==
                        window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                        setError('Error al buscar lugares');
                        console.error('Error en Places API:', status);
                    }
                }
            }
        );
    };

    // Obtener coordenadas a partir de un ID de lugar o dirección 
    const getLocationDetails = (placeId) => {
        return new Promise((resolve, reject) => {
            if (!geocoder) {
                reject(new Error('Geocoder no disponible'));
                return;
            }

            setLoading(true);

            geocoder.geocode(
                { placeId },
                (results, status) => {
                    setLoading(false);

                    if (status === window.google.maps.GeocoderStatus.OK && results
                        && results.length > 0) {
                        resolve(results[0]);
                    } else {
                        reject(new Error(`Error al geocodificar: ${status}`));

                    }
                }
            );
        });
    };

    return {
        loading,
        predictions,
        error,
        searchPlaces,
        getLocationDetails
    };
}; 