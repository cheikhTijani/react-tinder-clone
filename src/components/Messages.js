import React, { useState } from 'react'
import { useEffect } from 'react'
import axiosInstance from '../api/axiosInstance';
import { useAuthContext } from '../hooks/useAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { CircularProgress } from "@material-ui/core";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [inbox, setInbox] = useState(true);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthContext();
    const { id, token } = user;

    async function getMessages(type) {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/${type}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status !== 200) throw new Error('Could not get Messages');

            type === 'inbox' ? setInbox(true) : setInbox(false);
            setMessages(res.data.messages);
            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getMessages('inbox');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='message'>
            <button className={`btn ${inbox ? 'btn-active' : ''}`} onClick={() => getMessages('inbox')}>Received</button>
            &nbsp;
            <button className={`btn ${inbox ? '' : 'btn-active'}`} onClick={() => getMessages('sent')}>Sent</button>
            {loading && (
                <div style={{ marginTop: '2rem' }}>
                    <CircularProgress color='secondary' />
                </div>
            )}
            {!loading && messages.length === 0 && <p className='loading'>No messages {inbox ? 'received' : 'sent'} yet</p>}
            {!loading && messages && messages.map((msg, index) => (
                <div key={index} className='message_container'>
                    <p className='msg_content'><strong>{inbox ? msg.fromName : `To ${msg.toName}`}:</strong> {msg.content}</p>
                    <p className='msg_date'>{formatDistanceToNow(new Date(msg.date), { addSuffix: true })}</p>
                </div>
            ))}
        </div>
    )
}

export default Messages