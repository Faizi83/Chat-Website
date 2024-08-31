import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import Navbar from '../Components/Navbar';
import './tailwindcss-colors.css';
import './style.css';

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [authUser, setAuthUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const hubConnectionRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        hubConnectionRef.current = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7180/chatHub", {
                accessTokenFactory: () => token
            })
            .build();

        const hubConnection = hubConnectionRef.current;

        // Fetch all users
        axios.get('https://localhost:7180/api/Working/getAllUsers', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));

        // Fetch authenticated user's details
        axios.get('https://localhost:7180/api/Working/getUserDetails', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            setAuthUser(response.data);

            // Fetch messages after setting authUser
            axios.get(`https://localhost:7180/api/Working/getMessages/${response.data.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(msgResponse => {
                console.log('Fetched messages:', msgResponse.data);

                // Normalize message property names
                const normalizedMessages = msgResponse.data.map(msg => ({
                    ...msg,
                    MessageText: msg.messageText // normalize the property name
                }));

                setMessages(normalizedMessages);
            }).catch(error => console.error('Error fetching messages:', error));
        })
            .catch(error => console.error('Error fetching user details:', error));

        // Start SignalR connection
        hubConnection.start()
            .then(() => console.log('Connection started!'))
            .catch(err => console.log('Error while establishing connection :(', err));

        // Listen for incoming messages
        hubConnection.on('ReceiveMessage', (recieverId, senderId, message) => {
            setMessages(prevMessages => [
                ...prevMessages,
                { ReceiverId: recieverId, SenderId: senderId, MessageText: message } // Ensure consistency here as well
            ]);
        });

        return () => {
            hubConnection.stop();
        };
    }, []);


    const sendMessage = async () => {
        try {
            const token = localStorage.getItem('token');

            if (activeConversation !== null && authUser) {
                const messageDto = {
                    SenderId: authUser.id.toString(),
                    ReceiverId: users.find(user => user.id === activeConversation)?.id.toString(),
                    MessageText: newMessage
                };

                await axios.post('https://localhost:7180/api/Working/sendMessage', messageDto, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setNewMessage('');
            } else {
                console.error('No active conversation or user not authenticated');
            }
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error:', error.response.data);
            } else {
                console.error('Error sending message:', error.message);
            }
        }
    };

    return (
        <div className="chat-section">
            <div className="chat-container">
                <Navbar />
                <div className="chat-content">
                    {/* Sidebar */}
                    <div className="content-sidebar">
                        <div className="content-sidebar-title">Chats</div>
                        <form className="content-sidebar-form">
                            <input type="search" className="content-sidebar-input" placeholder="Search..." />
                            <button type="submit" className="content-sidebar-submit"><i className="ri-search-line"></i></button>
                        </form>
                        <div className="content-messages">
                            <ul className="content-messages-list">
                                <li className="content-message-title"><span>Recently</span></li>
                                {users.map((user) => (
                                    <li key={user.id}>
                                        <a href="#" onClick={() => setActiveConversation(user.id)}>
                                            <img className="content-message-image" src={`https://localhost:7180${user.image}`} alt={user.name} />
                                            <span className="content-message-info">
                                                <span className="content-message-name">{user.name}</span>
                                                <span className="content-message-text">Last message preview...</span>
                                            </span>
                                            <span className="content-message-more">
                                                <span className="content-message-time">12:30</span>
                                                <span className="content-message-unread">4</span>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* Main Conversation Section */}
                    {activeConversation !== null ? (
                        <div className="conversation active">
                            <div className="conversation-top">
                                <button type="button" className="conversation-back" onClick={() => setActiveConversation(null)}>
                                    <i className="ri-arrow-left-line"></i>
                                </button>
                                <div className="conversation-user">
                                    <img className="conversation-user-image" src={`https://localhost:7180${users.find(u => u.id === activeConversation)?.image}`} alt={users.find(u => u.id === activeConversation)?.name} />
                                    <div>
                                        <div className="conversation-user-name">{users.find(u => u.id === activeConversation)?.name}</div>
                                        <div className="conversation-user-status online">online</div>
                                    </div>
                                </div>
                                <div className="conversation-buttons">
                                    <button type="button"><i className="ri-phone-fill"></i></button>
                                    <button type="button"><i className="ri-vidicon-line"></i></button>
                                    <button type="button"><i className="ri-information-line"></i></button>
                                </div>
                            </div>
                            <div className="conversation-main">
                                <ul className="conversation-wrapper">
                                    {messages
                                        .filter(msg =>
                                            (String(msg.ReceiverId) === String(activeConversation) && String(msg.SenderId) === String(authUser.id)) ||
                                            (String(msg.SenderId) === String(activeConversation) && String(msg.ReceiverId) === String(authUser.id))
                                        )
                                        .map((msg, index) => {
                                            const isSender = String(msg.SenderId) === String(authUser.id);
                                            return (
                                                <li key={index} className={`conversation-item ${isSender ? '' : 'me'}`}>
                                                    <div className="conversation-item-side">
                                                        <img
                                                            className="conversation-item-image"
                                                            src={`https://localhost:7180${isSender ? authUser.image : users.find(u => u.id === activeConversation)?.image}`}
                                                            alt={isSender ? authUser.name : users.find(u => u.id === activeConversation)?.name}
                                                        />
                                                    </div>
                                                    <div className="conversation-item-content">
                                                        <div className="conversation-item-wrapper">
                                                            <div className="conversation-item-box">
                                                                <div className="conversation-item-text">
                                                                    <p>{msg.MessageText}</p>
                                                                    <div className="conversation-item-time">12:30</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>

                            <div className="conversation-form">
                                <button type="button" className="conversation-form-button"><i className="ri-emotion-line"></i></button>
                                <div className="conversation-form-group">
                                    <textarea className="conversation-form-input" rows="1" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type here..."></textarea>
                                    <button type="button" className="conversation-form-record"><i className="ri-mic-line"></i></button>
                                </div>
                                <button type="button" onClick={sendMessage} className="conversation-form-button conversation-form-submit"><i className="ri-send-plane-2-line"></i></button>
                            </div>
                        </div>
                    ) : (
                        <div className="conversation conversation-default active">
                            <i className="ri-chat-3-line"></i>
                            <p>Select chat and view conversation!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
