import React from 'react'

interface Props {
  oponentName: string
  cardsInHand: number[]
}

export const CardsInHand: React.FC<Props> = ({ oponentName, cardsInHand }) => {
  const cardsElement = document.getElementById(`cards-${oponentName}`)

  const numberOfCards = cardsInHand.length

  const divWidth = (cardsElement != null) ? cardsElement.offsetWidth : 0

  let cardWidth = 60
  divWidth > 260 ? cardWidth = 80 : cardWidth = 60

  const cardsWidth = numberOfCards * cardWidth

  let dx = 0
  if (cardsWidth > divWidth) {
    dx = -(cardsWidth - divWidth) / (numberOfCards - 1)
  }

  return (
    <div id={`cards-${oponentName}`} className='max-h-full w-full flex justify-center'>
      <div className='max-h-full w-full flex relative'>
        {
          cardsInHand.map((card, index) => {
            return (
            // unknown card
              <img
                id='card'
                key={index}
                style={{ transform: `translate(${dx * index}px, 0)`, width: `${cardWidth}px` }}
                className='translate-x-[-0px]'
                src={require('../img/gfx/cards/back-playing.png')} alt="" />
            )
          })}
      </div>
    </div>
  )
}
