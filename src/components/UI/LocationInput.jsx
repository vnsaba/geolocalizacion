import React, { useState, useEffect } from 'react';
import { Input, List, Spin } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { getPlacePredictions } from '../../api/geocodingService';

const LocationInput = ({ placeholder, value, onChange, onSelect }) => {

    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);
    useEffect(() => {
        const fetchPredictions = async () => {
            if (value && value.length > 2) {
                setLoading(true);
                try {
                    const results = await getPlacePredictions(value);
                    setPredictions(results);
                    setShowPredictions(true);
                } catch (error) {
                    console.error('Error fetching predictions:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setPredictions([]);
                setShowPredictions(false);
            }
        };

        const timer = setTimeout(() => {
            fetchPredictions();
        }, 300);

        return () => clearTimeout(timer);
    }, [value]);

    const handleSelect = (placeId, description) => {
        onSelect(placeId, description);
        onChange(description);
        setShowPredictions(false);
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

            <style>{` 
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