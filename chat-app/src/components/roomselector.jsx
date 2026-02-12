import React from 'react';

export default function RoomSelector({ rooms, onSelectRoom }) {
    return (
        <div className="container mt-5">
            <h3>Select a room</h3>
            <div className="d-flex gap-2 flex-wrap mt-2">
                {rooms.map((room) => (
                    <button
                        key={room}
                        className="btn btn-outline-primary"
                        onClick={() => onSelectRoom(room)} 
                    >
                        {room}
                    </button>
                ))}
            </div>
        </div>
    );
}
