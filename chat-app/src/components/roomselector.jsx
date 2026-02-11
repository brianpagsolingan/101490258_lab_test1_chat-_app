export default function RoomSelector({rooms, onSelect}){
    return(
        <div className="container mt-4">
            <h3>Select a Room</h3>
            <div className="d-flex gap-2">
                {rooms.map(room => (
                    <button key={room} className="btn btn-outline-primary" onClick={() => onJoin(room)}>
                        {room}
                        </button>
                ))}
            </div>
        </div>
    );
}
