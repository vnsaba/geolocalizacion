
import { useState } from 'react';

// Este hook utiliza el DirectionsService de Google Maps 
export const useRoutes = () => {
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const calculateRoute = (origin, destination, mode = 'DRIVING') => {
    if (!window.google || !window.google.maps) {
      setError('Google Maps no está disponible');
      return Promise.reject('Google Maps no está disponible');
    }

    setLoading(true);
    setError(null);

    // Crear el servicio de direcciones 
    const directionsService = new window.google.maps.DirectionsService();

    // Preparar la solicitud 



    const request = {
      origin: origin instanceof window.google.maps.LatLng ? origin : new
        window.google.maps.LatLng(origin.lat, origin.lng),
      destination: destination instanceof window.google.maps.LatLng ?
        destination : new window.google.maps.LatLng(destination.lat,
          destination.lng),
      travelMode: window.google.maps.TravelMode[mode],
      region: 'co'
    };

    return new Promise((resolve, reject) => {
      directionsService.route(request, (result, status) => {
        setLoading(false);

        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);

          if (result.routes && result.routes.length > 0) {
            const route = result.routes[0];
            const leg = route.legs[0];

            const extractedInfo = {
              distance: leg.distance,
              duration: leg.duration,
              startAddress: leg.start_address,
              endAddress: leg.end_address,
              steps: leg.steps.map(step => ({
                distance: step.distance,
                duration: step.duration,
                instructions: step.instructions,
                maneuver: step.maneuver
              }))
            };

            setRouteInfo(extractedInfo);
            resolve({ directions: result, routeInfo: extractedInfo });
          } else {
            resolve({ directions: result, routeInfo: null });
          }
        } else {
          setError(`Error al calcular la ruta: ${status}`);
          reject(`Error al calcular la ruta: ${status}`);
        }
      });
    });



  };

  return {
    directions,
    routeInfo,
    loading,
    error,
    calculateRoute
  };
};