import React, { useEffect, useState, useCallback } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import { Card, Spin, Descriptions, Button, Divider } from 'antd'; 
import { CarOutlined, EnvironmentOutlined, LeftOutlined } from 
'@ant-design/icons'; 
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from 
'@react-google-maps/api'; 
import { getDirections } from '../api/directionsService'; 
import { useNavigate } from 'react-router-dom'; 
import { meta } from '@eslint/js';
 
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
 
const containerStyle = { 
  width: '100%', 
  height: '500px' 
}; 
 
const RoutePage = () => { 
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const { origin, destination } = location.state || {}; 
   
  const [loading, setLoading] = useState(true); 
  const [directions, setDirections] = useState(null); 
  const [routeInfo, setRouteInfo] = useState(null); 
  const [error, setError] = useState(null); 
 
  const { isLoaded, loadError } = useJsApiLoader({ 

 
 
    googleMapsApiKey: API_KEY, 
    libraries: ['places'] 
  }); 
 
  const fetchRoute = useCallback(async () => { 
    if (!origin || !destination) { 
      setError('No se especificaron el origen y destino'); 
      setLoading(false); 
      return; 
    } 
 
    try { 
           const directionsService = new 
window.google.maps.DirectionsService(); 
       
      const results = await directionsService.route({ 
        origin: new window.google.maps.LatLng(origin.location.lat, 
origin.location.lng), 
        destination: new 
window.google.maps.LatLng(destination.location.lat, 
destination.location.lng), 
        travelMode: window.google.maps.TravelMode.DRIVING, 
      }); 
       
      setDirections(results); 
       
      // Extraer información de la ruta 
      if (results.routes && results.routes.length > 0) { 
        const route = results.routes[0]; 
        const leg = route.legs[0]; 
         
        setRouteInfo({ 
          distance: leg.distance.text, 
          duration: leg.duration.text, 
          startAddress: leg.start_address, 
          endAddress: leg.end_address, 
          steps: leg.steps 
        }); 
      } 
       
      setLoading(false); 
    } catch (error) { 
      console.error('Error al obtener ruta:', error); 
      setError('No se pudo calcular la ruta. Intenta con otras  ubicaciones.'); 

 
      setLoading(false); 
    } 
  }, [origin, destination]); 
 
  useEffect(() => { 
    if (isLoaded && !loadError) { 
      fetchRoute(); 
    } 
  }, [isLoaded, loadError, fetchRoute]); 
 
  if (loadError) { 
    return <div>Error al cargar Google Maps</div>; 
  } 
 
  if (!isLoaded || loading) { 
    return ( 
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 
'center', height: '100vh' }}> 
        <Spin size="large" tip="Calculando la mejor ruta..." /> 
      </div> 
    ); 
  } 
 
  if (error) { 
    return ( 
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', 
marginTop: '50px' }}> 
        <Card title="Error" bordered={true}> 
          <p>{error}</p> 
          <Button type="primary" onClick={() => navigate('/')}> 
            <LeftOutlined /> Volver al inicio 
          </Button> 
        </Card> 
      </div> 
    ); 
  } 
 
  return ( 
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', 
marginTop: '20px' }}> 
      <Card 
        title={ 
          <div> 
            <Button  
              icon={<LeftOutlined />}  
 
              style={{ marginRight: '10px' }}  
              onClick={() => navigate('/')} 
            /> 
            Ruta de {origin.description} a {destination.description} 
          </div> 
        } 
        variant={true} 
      > 
        <div style={{ marginBottom: '20px' }}> 
          <GoogleMap 
            mapContainerStyle={containerStyle} 
            zoom={7} 
            center={{ 
              lat: (origin.location.lat + destination.location.lat) / 2, 
              lng: (origin.location.lng + destination.location.lng) / 2 
            }} 
          > 
            {directions && <DirectionsRenderer directions={directions} />} 
          </GoogleMap> 
        </div> 
         
        <Divider /> 
         
        {routeInfo && ( 
          <Descriptions title="Información de la ruta" bordered> 
            <Descriptions.Item label="Distancia" span={3}> 
              <CarOutlined style={{ marginRight: '8px' }} /> 
              {routeInfo.distance} 
            </Descriptions.Item> 
            <Descriptions.Item label="Tiempo estimado" span={3}> 
              {routeInfo.duration} 
            </Descriptions.Item> 
            <Descriptions.Item label="Origen" span={3}> 
              <EnvironmentOutlined style={{ marginRight: '8px', color: 
'green' }} /> 
              {routeInfo.startAddress} 
            </Descriptions.Item> 
            <Descriptions.Item label="Destino" span={3}> 
              <EnvironmentOutlined style={{ marginRight: '8px', color: 
'red' }} /> 
              {routeInfo.endAddress} 
            </Descriptions.Item> 
          </Descriptions> 
        )} 
      </Card> 

 
    </div> 
  ); 
}; 
 
export default RoutePage;