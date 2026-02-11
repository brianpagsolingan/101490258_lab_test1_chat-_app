import React from "react";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function Chat({ username, room }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState('');
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('http://localhost:3005');

        //join
        socketRef.current.emit('joinRoom', { username, room });

        //receive group messages
        socketRef.current.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        //receive typing indicator
        socketRef.current.on('typing', text => setTyping(text));

        return () => {
            socketRef.current.emit('leaveRoom');
            socketRef.current.disconnect();
        };
    }, [username, room]);

    const sendMessage = () => {
        if (input.trim() === '') return;
        socketRef.current.emit('chatMessage', input);
        setInput('');
    };

    const handleTyping = () => {
        socketRef.current.emit('typing', `${username} is typing...`);
    };

    return (
        <div className="container mt-3">
    <h4>Room: {room}</h4>
    <div className="border p-2 mb-2" style={{height: "400px", overflowY: "auto"}}>
        {messages.map((msg, i) => (
            <div key={i}><strong>{msg.from_user}:</strong> {msg.message}</div>
        ))}
    </div>
    {typing && <div className="text-muted mb-2">{typing}</div>}
    <div className="d-flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleTyping} className="form-control" placeholder="Type a message..." />
        <button onClick={sendMessage} className="btn btn-primary">Send</button>
    </div>
    </div>
    );      
}   