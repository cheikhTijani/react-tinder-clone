import { useState } from "react";
import { useAuthContext } from './useAuthContext.js';
import axiosInstance from "../api/axiosInstance.js";


export const useSignUp = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const signup = async (data) => {
        setError(null);
        setLoading(true);

        try {
            const res = await axiosInstance.post("/signup", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.status === 'success') {
                await dispatch({ type: 'LOGIN', payload: res.data.userData });
                sessionStorage.setItem('user', JSON.stringify(res.data.userData));
                setLoading(false);
                setError(null);
            }
        } catch (err) {
            const errMsg = err.response.data.message;
            errMsg ? setError(errMsg.split(/[:,]/ig)[2]) : setError(err.message);
            setLoading(false);
        }
    }

    return { error, loading, signup }
}