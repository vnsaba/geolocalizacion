import React from 'react'; 
import { GoogleMap, useJsApiLoader, Marker } from 
'@react-google-maps/api'; 
 
const containerStyle = { 
  width: '100%', 
  height: '500px' 
}; 
 
// Coordenadas de Colombia como centro predeterminado 
const defaultCenter = { 
  lat: 4.6097,  // Bogotá, Colombia 
  lng: -74.0817 
}; 
 
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 
process.env.VITE_GOOGLE_MAPS_API_KEY; 
 
const Map = ({ center = defaultCenter, zoom = 7, markers = [], children, 
onLoad }) => { 
  const { isLoaded, loadError } = useJsApiLoader({ 
    googleMapsApiKey: API_KEY, 
    libraries: ['places'] 
  }); 
 
  if (loadError) { 
    return <div>Error al cargar Google Maps</div>; 
  } 
 
  if (!isLoaded) { 
    return <div>Cargando mapa...</div>; 
  } 
 
  return ( 
    <GoogleMap 
      mapContainerStyle={containerStyle} 
      center={center} 
      zoom={zoom} 
      onLoad={onLoad} 
    > 
      {markers.map((marker, index) => ( 
        <Marker 
          key={marker.id || index} 
          position={{ 
            lat: marker.position.lat, 
            lng: marker.position.lng
             }} 
          title={marker.title} 
          label={marker.label} 
        /> 
      ))} 
      {children} 
    </GoogleMap> 
  ); 
}; 
 
export default React.memo(Map);
