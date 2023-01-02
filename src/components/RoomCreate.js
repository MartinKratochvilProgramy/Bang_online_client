import React, { useState } from 'react';
import Button from './Button';

export default function RoomCreate({ createRoom }) {
  
    const [roomInput, setRoomInput] = useState("");
    
    function handleSubmit() {
        if (roomInput === "") return;
        createRoom(roomInput);
        setRoomInput("");
    }

    return (
    <form 
        className='mt-8'
        onSubmit={() => handleSubmit()}
        >
        <label className="text-outline font-rye text-5xl text-white my-6">
            Create new room
        </label>
        <div className='mt-4'></div>
        <input
            className='shadow appearance-none h-[43px] font-rye text-xl rounded bg-beige m-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            placeholder="Room name..."
            onChange={(e) => setRoomInput(e.target.value)}
            maxLength={21}
            value={roomInput}
        />
        <Button 
            onClick={null}
            value={"Create new room"} 
            size={2}
        />
    </form>
  )
}
