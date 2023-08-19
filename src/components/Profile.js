import React, { useEffect } from 'react'
import { useProfileFetch } from '../hooks/useProfileFetch.js'
import { useLogout } from '../hooks/useLogout.js';
import { CircularProgress } from '@material-ui/core';

function Profile() {
    const { error, loading, getProfile, userData, imageUrl } = useProfileFetch();
    const { logout, logoutError, isPending } = useLogout();

    useEffect(() => {
        getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='profile'>
            {error && <p className='error'><small>{error}</small></p>}
            {loading && (
                <div className='loading' style={{ marginTop: '3rem' }}>
                    <CircularProgress color='secondary' />
                </div>
            )}
            {!loading && !error && userData && imageUrl && (
                <>
                    <img src={imageUrl} alt={userData.name} />
                    <h2>{userData.name}</h2>
                    <h4>Email: {userData.email}</h4>
                    <h4>Age: {((new Date()).getFullYear()) - (new Date(userData.birthDate).getFullYear())}</h4>
                    <h4>Gender: {userData.gender}</h4>
                </>
            )}
            {logoutError && <p className='error'><small>{logoutError}</small></p>}
            {!isPending && <button className='btn' onClick={logout}>Logout</button>}
            {isPending && <button className='btn' onClick={logout} disabled>Logging out...</button>}
        </div>
    )
}

export default Profile