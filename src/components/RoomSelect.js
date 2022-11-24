import React, { useContext } from 'react';
import UsernameSelect from './UsernameSelect';
import RoomCreate from './RoomCreate';
import RoomInfo from './RoomInfo';
import { UsernameContext } from '../App';

import {socket} from '../socket';

export default function RoomSelect({ setCurrentRoom, rooms, setAdmin }) {

    const [username, ] = useContext(UsernameContext);

    const createRoom = (roomName) => {
        // don't allow already existing room to be created
        setAdmin(true);
        for (const room of rooms) {
        if (room.name === roomName) {
            return;
        }
        }
        
        socket.emit("create_room", roomName);

        // join room after create
        socket.emit("join_room", {currentRoom: roomName, username});
        setCurrentRoom(roomName);
    }
  
    const joinRoom = (room) => {
        socket.emit("join_room", {currentRoom: room, username});
        setCurrentRoom(room);
    };

    let gridStyle ;
    rooms.length >= 3 ? gridStyle = "grid-cols-2" : gridStyle = "grid-cols-1";

    if (username === "") {
        return(
            <UsernameSelect />
            )
    } else {
        return (
          <div>
              <h2 className='text-outline font-rye text-3xl text-white mt-3 mb-6'>
                  {username}
              </h2>
      
              <h2 className='text-outline font-rye text-5xl text-white my-6'>
                  Join existing room
              </h2>
              <div className={`inline-grid gap-6 justify-center items-center ${gridStyle}`}>
                {rooms.map(room => {
                    return (
                        <RoomInfo key={room} room={room} joinRoom={() => joinRoom(room.name)} />
                        )
                    })}
              </div>

            <RoomCreate createRoom={createRoom} />
          </div>
        )

    }
}
