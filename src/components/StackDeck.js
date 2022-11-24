import React from 'react';
import Card from './Card';

export default function StackDeck({ currentRoom, currentPlayer, topStackCard, deckActive, drawFromDeck}) {

  function handleClick() {
    if (!deckActive) return;
    drawFromDeck();
  }

  let cardstyles = {};
  if (deckActive) {
    cardstyles = {border: "solid 2px red", cursor: "pointer"}
  }

  if (topStackCard !== null && topStackCard.isPlayable === true) {
    topStackCard.isPlayable = false;
  }

    return (
    <div className='flex space-x-4'>

        {topStackCard !== null && 
          <Card 
              card={topStackCard}
              key={topStackCard.name + topStackCard.digit + topStackCard.type}
              currentRoom={currentRoom}
              currentPlayer={currentPlayer}
          />       
        }
        <img 
            className='w-[60px] xs:w-[80px] rounded-md'
            style={cardstyles}
            src={require("../img/gfx/cards/back-playing.png")} 
            alt="deck card"
            onClick={() => handleClick()} 
        />
    </div>
  )
}
