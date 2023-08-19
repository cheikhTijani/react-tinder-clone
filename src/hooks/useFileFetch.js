import { useState } from 'react';
import axiosInstance from "../api/axiosInstance.js";

export const useFileFetch = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const getFile = async (fileName) => {
        setError(null);
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/files/${fileName}`);
            if (response.ok) {
                const blob = await response.blob();
                setImageUrl(URL.createObjectURL(blob));
                setLoading(false);
                setError(null);
            } else {
                setLoading(false);
                setError('Error fetching file.');
                console.error('Error fetching file.');
            }
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.error('Error fetching file:', error);
        }
    };

    return { error, loading, imageUrl, getFile }
}
