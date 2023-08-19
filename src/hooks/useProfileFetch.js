import { useState } from "react";
import axiosInstance from "../api/axiosInstance.js";
import { useAuthContext } from './useAuthContext.js';


export const useProfileFetch = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const { user } = useAuthContext();

    const { id, token } = user;

    const getProfile = async () => {
        setError(null);
        setLoading(true);

        try {
            const res1 = await axiosInstance.get(`/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res1.data.status === 'success') {
                setUserData(res1.data.user);
                const res2 = await axiosInstance.get(`/files/${res1.data.user.imgUrl}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType: 'blob'
                });
                if (res2.status === 200) {
                    const imgUrl = URL.createObjectURL(res2.data);
                    setImageUrl(imgUrl);
                    setLoading(false);
                    setError(null);
                } else {
                    setLoading(false);
                    setError('Error fetching file.');
                    throw new Error('Error fetching file.');
                }
            }
        } catch (err) {
            if (err.response) {
                const errMsg = err.response.data.message;
                errMsg ? setError(errMsg) : setError(err.message);
            } else setError(err.message);
            setLoading(false);
        }
    }

    return { error, loading, getProfile, userData, imageUrl }
}