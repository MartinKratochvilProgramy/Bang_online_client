import React from 'react'

interface Props {
  oponentName: string
  cardsInHand: number[]
}

export const CardsInHand: React.FC<Props> = ({ oponentName, cardsInHand }) => {
  const cardsElement = document.getElementById(`cards-${oponentName}`)

  const numberOfCards = cardsInHand.length

  const divWidth = (cardsElement != null) ? cardsElement.offsetWidth : 0 // total width of the main container

  let cardWidth = 38
  const baseCardSize = document.getElementById('top-player-character')?.offsetWidth
  if (baseCardSize === 38) cardWidth = 38
  if (baseCardSize === 60) cardWidth = 60
  if (baseCardSize === 80) cardWidth = 80

  const cardsWidth = numberOfCards * cardWidth // width of all cards in hand

  let dx = 0 // step in x direction by which card should be translated -> if cards do not need overlap, this stays 0
  if (cardsWidth > divWidth) {
    dx = -(cardsWidth - divWidth) / (numberOfCards - 1)
  }

  return (
    <div
      id={`cards-${oponentName}`} className='flex'>
      {
        cardsInHand.map((card, index) => {
          return (
          // unknown card
            <img
              id='card'
              key={index}
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              style={{ transform: `translate(${dx * index}px, 0)`, width: `${cardWidth}px` }}
              className='object-contain'
              src={require('../img/gfx/cards/back-playing.png')} alt="" />
          )
        })}
    </div>
  )
}
