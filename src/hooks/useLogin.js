import { useState } from "react";
import { useAuthContext } from './useAuthContext.js';
import axiosInstance from "../api/axiosInstance.js";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const res = await axiosInstance.post("/login", { email, password });

            if (res.data.status === 'success') {
                await dispatch({ type: 'LOGIN', payload: res.data.userData });
                sessionStorage.setItem('user', JSON.stringify(res.data.userData));
                setLoading(false);
                setError(null);
            }

        } catch (err) {
            const errMsg = err.response.data.message;
            errMsg ? setError(errMsg) : setError(err.message);
            setLoading(false);
        }
    }

    return { error, loading, login }
}