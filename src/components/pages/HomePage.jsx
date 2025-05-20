import React, { useState } from 'react';
import { Card, Button, Divider, notification, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LocationInput from '../components/UI/LocationInput';
import { geocodeAddress } from '../api/geocodingService';

const HomePage = () => {
    const [origin, setOrgin] = useState(''); // esto es un estado para guardar el origen 
    const [destination, setDestination] = useState(''); // esto es un estado para guardar el destino p
    const [originPlaceId, setOriginPlaceId] = useState(''); // esto es un estado para guardar el id del lugar de origen
    const [destinationPlaceId, setDestinationPlaceId] = useState(''); // esto es un estado para guardar el id del lugar de destino
    const [loading, setLoading] = useState(false); // esto es un estado para guardar si esta cargando o no

    const navigate = useNavigate(); // esto es para navegar entre las paginas

    const handleSearchRoute = async () => {
        if (!origin || !destination) { // esto es para que valide si hay un origen y un destino
            notification.error({ // esto es para que muestre un error en caso de que no haya un origen y un destino
                message: 'Error',
                description: 'Please enter both origin and destination.',
            });
            return; // esto es para que no continue si no hay un origen y un destino
        }

        setLoading(true); // esto es para que muestre el loading
        try {
            //obtener coordenadas para el orien
            const originResults = await geocodeAddress(origin); // esto es para que busque las coordenadas del origen
            const originLocation = originResults[0].geometry.location; // esto es para que guarde las coordenadas del origen

            //obtener coordenadas para el destino
            const destResult = await geocodeAddress(destination); // esto es para que busque las coordenadas del destino
            const destLocation = destResult[0].geometry.location; // esto es para que guarde las coordenadas del destino

            if (!originLocation || !destLocation) {
                notification.error({ // esto es para que muestre un error en caso de que no haya un origen y un destino
                    message: 'Error',
                    description: 'Could not find coordinates for the given addresses.',
                });
                return; // esto es para que no continue si no hay un origen y un destino
            }
            // Navegar a la página de ruta con los parámetros
            navigate('/route', {
                state: {
                    origin: {
                        description: origin,
                        location: originLocation,
                        placeId: originPlaceId
                    },
                    destination: {
                        description: destination,
                        location: destLocation,
                        placeId: destinationPlaceId
                    }
                }
            });
        } catch (error) {
            console.error('Error al buscar la ruta:', error);
            notification.error({
                message: 'Error',
                description: 'Ocurrió un error al buscar la ruta',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            padding: '24px', maxWidth: '600px', margin: '0 auto',
            marginTop: '50px'
        }}>
            <Card title="Buscar Rutas en Colombia" bordered={true}>
                <div style={{ marginBottom: '20px' }}>
                    <h3>Origen</h3>
                    <LocationInput
                        placeholder="Ingresa el origen"
                        value={origin}
                        onChange={setOrigin}
                        onSelect={(placeId, description) => {
                            setOriginPlaceId(placeId);
                            setOrigin(description);
                        }}
                    />
                </div>
                <Divider />
                <div style={{ marginBottom: '20px' }}>
                    <h3>Destino</h3>
                    <LocationInput
                        placeholder="Ingresa el destino"
                        value={destination}
                        onChange={setDestination}
                        onSelect={(placeId, description) => {
                            setDestinationPlaceId(placeId);
                            setDestination(description);
                        }}
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="large"
                        onClick={handleSearchRoute}
                        loading={loading}
                    >
                        Buscar Ruta
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default HomePage;