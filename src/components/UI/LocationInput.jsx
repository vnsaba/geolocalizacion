import React, { useEffect, useState } from 'react'
import { Descriptions, Input, List, Sping } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import { getPlacePredictions } from '../../api/geocodingService'

const LocationInput = ({ placeholder, valuse, onChange, onSelect }) => {
    const [predictions, setPredictions] = useState([]) // esto es un estado para guardar las predicciones
    const [loading, setLoading] = useState(false) // esto es un estado para guardar si esta cargando o no
    const [showPredictions, setShowPredictions] = useState(false) // esto es un estado para guardar si se deben mostrar las predicciones o no
    useEffect(() => {
        const fetchPredictions = async () => {
            if (value && value.length > 2) { // esto es para que solo busque si hay mas de 2 caracteres
                setLoading(true) // esto es para que muestre el loading
                try {
                    const results = await getPlacePredictions(value) // esto es para que busque las predicciones
                    setPredictions(results) // esto es para que guarde las predicciones
                    setShowPredictions(true) // esto es para que muestre las predicciones
                } catch (error) {
                    console.error('Error fetching predictions:', error) // esto es para que muestre el error en la consola
                } finally {
                    setLoading(false) // esto es para que quite el loading
                }
            } else {
                setPredictions([]) // esto es para que quite las predicciones
                setShowPredictions(false) // esto es para que quite las predicciones
            }
        };
        // aca se va a utiliza un debunce para mejorar el rendimiento, es un tecnica de optimizzacion
        // en front para limitar la frecuencia con la que se ejecuta una funcion

        const timer = setTimeout(() => {
            fetchPredictions(); // esto es para que ejecute la funcion de buscar las predicciones
        }, 300); // esto es para que espere 300ms antes de ejecutar la funcion

        return () => clearTimeout(timer); // esto es para que limpie el timer que es el que espera 300ms
    }, [value]); // esto es para que se ejecute cada vez que cambie el valor

    const handleSelect = (placeId, Description) => { // esto es para que maneje el select de las predicciones
        onSelect(placeId, Description) // esto es para que ejecute la funcion de onSelect que es para cuando se selecciona una prediccion la prediccion es el id del lugar
        onChange(Description) // esto es para que ejecute la funcion de onChange que es para cuando se cambia el valor de el input 
        setShowPredictions(false) // esto es para que quite las predicciones
    };

    return (
        <div className="location-input">
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                suffix={loading && <Spin size="small" />}
            />
            {showPredictions && predictions && predictions.length > 0 && (
                <div className="predictions-container">
                    <List
                        size="small"
                        bordered
                        dataSource={predictions}
                        renderItem={(item) => (
                            <List.Item
                                onClick={() => handleSelect(item.place_id,
                                    item.description)}
                                style={{ cursor: 'pointer' }}
                            >
                                <EnvironmentOutlined style={{ marginRight: 8 }} />
                                {item.description}
                            </List.Item>
                        )}
                    />
                </div>
            )}
            <style jsx>{`
                .location-input {
                position: relative;
                width: 100%;
                margin-bottom: 16px;
                }
                .predictions-container {
                position: absolute;
                top: 40px;
                left: 0;
                right: 0;
                z-index: 100;
                background: white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
                `}</style>
        </div>
    );
};

export default LocationInput;