import "./App.css";
import { useState, useEffect, useRef } from "react";
import RoomSelect from "./components/RoomSelect";
import Room from "./components/Room";
import Game from "./components/Game";
import GameEnd from './components/GameEnd';
import EmporionChoice from './components/EmporionChoice';
import DrawChoice from './components/DrawChoice';

import {socket} from './socket'

function App() {

  const [myCharacterChoice, setMyCharacterChoice] = useState([]);
  const [characterChoiceInProgress, setCharacterChoiceInProgress] = useState(true);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [username, setUsername] = useState(JSON.parse(sessionStorage.getItem('username')) || "");
  const [admin, setAdmin] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [knownRoles, setKnownRoles] = useState({});
  const [character, setCharacter] = useState("");
  const [characterUsable, setCharacterUsable] = useState(false);

  const [myHand, setMyHand] = useState([]);
  const [myDrawChoice, setMyDrawChoice] = useState([]);
  const [allPlayersInfo, setAllPlayersInfo] = useState([]);
  const [allCharactersInfo, setAllCharactersInfo] = useState([]);
  const [emporioState, setEmporioState] = useState([]);
  const [nextEmporioTurn, setNextEmporioTurn] = useState("");

  const [winner, setWinner] = useState(null);

  const newRoomRef = useRef();

  useEffect(() => {
    socket.on("username_changed", (username) => {
      setUsername(username);
    })

    socket.on("get_character_choices", (characters) => {
      // receive two chars to pick from
      setGameStarted(true);
      setMyCharacterChoice(characters[username]);
    })

    socket.on("rooms", (rooms) => {
      setRooms(rooms);
    })

    socket.on("get_players", (users) => {
      setUsers(users);
    })

    socket.on("get_messages", (messages) => {
      setMessages(messages);
    })

    socket.on("console", consoleMessage => {
      setConsoleOutput([...consoleOutput, ...consoleMessage])
    })

    // GAME LOGIC
    socket.on("game_started", data => {
      setCharacterChoiceInProgress(false);
      setGameStarted(true);
      if (currentRoom !== null) {
        socket.emit("get_my_role", {username, currentRoom});
        socket.emit("get_my_hand", {username, currentRoom});
      }
      setAllPlayersInfo(data.allPlayersInfo);       // info about health, hands...
      setAllCharactersInfo(data.allCharactersInfo); // info about character names
    })

    socket.on("characters", characters => {
      for (let character of characters) {
        if (character.playerName === username) {
          setCharacter(character.character);
          break;
        }
      }
    })

    socket.off("known_roles").on("known_roles", roles => {
      // console.log("known roles: ", roles); 
      setKnownRoles(roles);
    })

    socket.off("my_hand").on("my_hand", hand => {
      // console.log("my hand: ", hand); 
      setMyHand(hand);
    })

    socket.on("my_draw_choice", hand => {
      setMyDrawChoice(hand);
    })

    socket.off("update_hands").on("update_hands", () => {
      if (username === "") return;
      if (currentRoom === null) return;
      socket.emit("get_my_hand", {username, currentRoom});
    })

    socket.on("update_all_players_info", (players) => {
      // returns array [{name, numberOfCards, health}]
      setAllPlayersInfo(players);
    })

    socket.on("emporio_state", (state) => {
      setEmporioState(state.cards);
      setNextEmporioTurn(state.nextEmporioTurn);
    })

    socket.on("game_ended", (winner) => {
      setWinner(winner);
    })

  }, [username, currentRoom, character, consoleOutput])

  const leaveRoom = () => {
    socket.emit("leave_room", {username, currentRoom});
    setAdmin(false);
    setGameStarted(false);
    setCurrentRoom(null);
  }

  const sendMessage = (message) => {
    socket.emit("send_message", {currentRoom, username, message})
  }

  function startGame() {
    const players = users.map((user) => {
      return user.username
    })
    socket.emit("start_game", {players, currentRoom})
  }
  
  function getEmporioCard(card) {
    if (username !== nextEmporioTurn) return;
    socket.emit("get_emporio_card", {username, currentRoom, card});

    const newEmporioState = emporioState;
    const cardIndex = myHand.findIndex(foundCard => (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type));
    newEmporioState.splice(cardIndex, 1);
    setEmporioState(newEmporioState);
  }
  
  function getChoiceCard(card) {
    setCharacterUsable(false);
    if (character === "Kit Carlson") {
      setMyHand([...myHand, card]);

      const newMyDrawChoice = myDrawChoice;
      newMyDrawChoice.splice(myDrawChoice.findIndex(foundCard => (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type)))
      setMyDrawChoice(newMyDrawChoice);
      
      socket.emit("get_choice_card_KC", {username, currentRoom, card});
    } else if (character === "Lucky Duke") {
      setMyHand([...myHand, card]);

      setMyDrawChoice([null]);
      
      socket.emit("get_choice_card_LD", {username, currentRoom, card});
    }
  }

  return (
    <div className="App flex flex-col justify-start items-center h-screen">
      {currentRoom === null ? 
        <>
          <img className="w-[300px] xs:w-max mt-2 xs:mt-12" src={require('./img/bang-logo.png')} alt="Bang! logo" />
          <a href="/about" className="text-gray-800 hover:text-black text-2xl underline font-rye">
              About
          </a>
          <RoomSelect 
            newRoomRef={newRoomRef} 
            setUsername={setUsername} 
            setCurrentRoom={setCurrentRoom} 
            username={username} 
            rooms={rooms} 
            setAdmin={setAdmin}
          />
        </>
      :
      !gameStarted &&
        <Room 
          users={users} 
          messages={messages} 
          roomName={currentRoom} 
          leaveRoom={leaveRoom} 
          sendMessage={sendMessage}
          startGame={startGame}
          gameStarted={gameStarted}
          admin={admin}
          />
      }
      {gameStarted && 
        <>
          <Game 
            myCharacterChoice={myCharacterChoice}
            characterChoiceInProgress={characterChoiceInProgress}
            setCharacter={setCharacter}
            myHand={myHand}
            setMyHand={setMyHand}
            allPlayersInfo={allPlayersInfo}
            setAllPlayersInfo={setAllPlayersInfo}
            allCharactersInfo={allCharactersInfo}
            username={username}
            character={character}
            characterUsable={characterUsable}
            setCharacterUsable={setCharacterUsable}
            knownRoles={knownRoles}
            currentRoom={currentRoom}
            setCurrentRoom={setCurrentRoom}
            emporioState={emporioState}
            myDrawChoice={myDrawChoice}
            nextEmporioTurn={nextEmporioTurn}
            sendMessage={sendMessage}
            messages={messages}
            consoleOutput={consoleOutput}
          />
          <div className='fixed flex justify-center items-center top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] z-[1100] m-auto'>
              {winner && <GameEnd winner={winner} setCurrentRoom={setCurrentRoom} />}
          </div>
          <div className='fixed flex justify-center items-center top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] z-[1000] m-auto'>
              {myDrawChoice.length > 0 && <DrawChoice cards={myDrawChoice} getChoiceCard={getChoiceCard} />}
          </div>
          <div className='fixed flex justify-center items-center top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] z-[1000] m-auto'>
              {emporioState.length > 0 && <EmporionChoice cards={emporioState} getEmporioCard={getEmporioCard} username={username} nextEmporioTurn={nextEmporioTurn} />}
          </div>

        </>
      }
    </div>
  );
}

export default App;
