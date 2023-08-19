import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
    const { user, dispatch } = useAuthContext();
    const { token } = user;
    const [logoutError, setLogoutError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const logout = async () => {
        setLogoutError(null);
        setIsPending(true);
        try {
            const res = await axiosInstance.get('/logout', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.status === 'success') {
                setIsPending(false);
                sessionStorage.removeItem('user');
                await dispatch({ type: 'LOGOUT' });
            }
        } catch (err) {
            setIsPending(false);
            const errMsg = err.response.data.message;
            errMsg ? setLogoutError(errMsg) : setLogoutError(err.message);
        }
    }

    return { logout, logoutError, isPending }
}