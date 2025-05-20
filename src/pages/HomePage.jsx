import React, { useState } from 'react';
import { Card, Button, Divider, notification, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LocationInput from '../components/UI/LocationInput';
import { geocodeAddress } from '../api/geocodingService';

const HomePage = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [originPlaceId, setOriginPlaceId] = useState('');
    const [destinationPlaceId, setDestinationPlaceId] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSearchRoute = async () => {
        if (!origin || !destination) {
            notification.error({
                message: 'Error',
                description: 'Por favor ingresa origen y destino',
            });
            return;
        }

        setLoading(true);

        try {
            // Obtener coordenadas para el origen 
            const originResults = await geocodeAddress({ address: origin });
            const originLocation = originResults[0]?.geometry?.location;

            // Obtener coordenadas para el destino 
            const destResults = await geocodeAddress({ address: destination });
            const destLocation = destResults[0]?.geometry?.location;

            if (!originLocation || !destLocation) {
                notification.error({
                    message: 'Error',
                    description: 'No se pudieron encontrar las ubicaciones especificadas',
                });
                return;
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
            <Card title="Buscar Rutas en Colombia" variant={true}>
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