import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function Chat({ username, room, onLeaveRoom, onLogout }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [privateTo, setPrivateTo] = useState(null);

    const socketRef = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:3005');

        // join the room
        socketRef.current.emit('joinRoom', { username, room });

        // group message
        socketRef.current.on('message', message => {
            setMessages(prev => [...prev, message]);
        });

        // private message
        socketRef.current.on('privateMessage', message => {
            setMessages(prev => [...prev, message]);
        });

        // typing
        socketRef.current.on('typing', text => {
            setTyping(text);
            setTimeout(() => setTyping(''), 2000);
        });

        // online users
        socketRef.current.on('onlineUsers', users => {
            setOnlineUsers(users.filter(u => u !== username));
        });

        return () => {
            socketRef.current.emit('leaveRoom');
            socketRef.current.disconnect();
        };
    }, [username, room]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if(input.trim() === '') return;
        if(privateTo) {
            socketRef.current.emit('privateMessage', { to: privateTo, text: input });
        } else {
            socketRef.current.emit('chatMessage', input);
        }
        setInput('');
    };

    const handleTyping = () => {
        socketRef.current.emit('typing');
    };

    const handleLeaveRoom = () => {
        socketRef.current.emit('leaveRoom');
        socketRef.current.disconnect();
        onLeaveRoom();
    };

    const handleLogout = () => {
        socketRef.current.emit('leaveRoom');
        socketRef.current.disconnect();
        localStorage.removeItem('username');
        onLogout();
    };

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Room: {room}</h4>
                <div className="d-flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={handleLeaveRoom}>
                        Back to Room Selector
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="mb-2">
                <strong>Online Users:</strong>
                <div className="d-flex gap-2 mt-1 flex-wrap">
                    {onlineUsers.map(user => (
                        <button key={user}
                                className={`btn btn-sm ${privateTo === user ? 'btn-success' : 'btn-outline-primary'}`}
                                onClick={() => setPrivateTo(user)}>
                            {user}
                        </button>
                    ))}
                    {privateTo && <button className="btn btn-sm btn-danger" onClick={() => setPrivateTo(null)}>Back to Room</button>}
                </div>
            </div>

            <div className="border p-2 mb-2" style={{ height: "400px", overflowY: "auto" }}>
                {messages.map((msg, i) => {
                    if(privateTo) {
                        if((msg.from_user === username && msg.to_user === privateTo) ||
                           (msg.from_user === privateTo && msg.to_user === username)) {
                            return <div key={i}><strong>{msg.from_user}:</strong> {msg.message}</div>;
                        }
                        return null;
                    } else {
                        if(msg.room === room) {
                            return <div key={i}><strong>{msg.from_user}:</strong> {msg.message}</div>;
                        }
                        return null;
                    }
                })}
                <div ref={messagesEndRef}></div>
            </div>

            {typing && <div className="text-muted mb-2">{typing}</div>}

            <div className="d-flex gap-2">
                <input type="text" value={input} onChange={e => {
                    setInput(e.target.value);
                    handleTyping();
                }} className="form-control"
                       placeholder={privateTo ? `Private message to ${privateTo}` : "Type a message..."}
                       onKeyPress={e => e.key === 'Enter' && sendMessage()} />
                <button onClick={sendMessage} className="btn btn-primary">Send</button>
            </div>
        </div>
    );
}