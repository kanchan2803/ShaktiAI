import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserChats } from '../services/chatApi';
import Loader from '../components/layouts/Loader'; //

const HistoryPage = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadChats = async () => {
            setLoading(true);
            const userChats = await fetchUserChats(); //
            if (userChats) {
                setChats(userChats);
            }
            setLoading(false);
        };
        loadChats();
    }, []);

    if (loading) {
        return <Loader />;
    }

    // Helper to get a title/snippet from the chat
    const getChatTitle = (chat) => {
        if (chat.title && chat.title !== 'New Chat') {
            return chat.title;
        }
        // Find the first user message as a fallback title
        const firstUserMessage = chat.messages.find(msg => msg.role === 'user');
        return firstUserMessage 
            ? firstUserMessage.content.substring(0, 50) + '...'
            : 'New Chat'; //
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Chat History</h1>
            {chats.length === 0 ? (
                <p>No chat history found.</p>
            ) : (
                <div style={styles.chatList}>
                    {chats.map((chat) => (
                        <Link to={`/chat/${chat._id}`} key={chat._id} style={styles.chatItem}>
                            <h3>{getChatTitle(chat)}</h3>
                            <p style={styles.chatDate}>
                                Last updated: {new Date(chat.updatedAt).toLocaleString()}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

// Simple styles for the history page
const styles = {
    container: {
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '1rem',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '1.5rem',
        color: '#333',
    },
    chatList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    chatItem: {
        padding: '1rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s',
    },
    chatDate: {
        fontSize: '0.8rem',
        color: '#777',
        marginTop: '0.5rem',
    }
};

export default HistoryPage;