import React, { useEffect } from 'react'
// import { Card } from './Card'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { selectDeckActive, setDeckActiveFalse } from '../features/deckActiveSlice'
import { selectCurrentRoom } from '../features/currentRoomSlice'
import { selectUsername } from '../features/usernameSlice'
import { selectCharacterUsable, setCharacterUsableFalse } from '../features/characterUsableSlice'
import { setSelectPlayerTargetFalse } from '../features/selectPlayerTargetSlice'
import { setNextTurnTrue } from '../features/nextTurnSlice'
import { selectTopStackCard, setTopStackCard, setTopStackCardNotActive } from '../features/topStackCardSlice'
import { type CardI } from '../types/card'
import { selectCharacter } from '../features/characterSlice'
import { parseCardType } from './Card'

import { socket } from '../socket'

export const StackDeck = () => {
  const username = useAppSelector(selectUsername)
  const currentRoom = useAppSelector(selectCurrentRoom)
  const deckActive = useAppSelector(selectDeckActive)
  const topStackCard = useAppSelector(selectTopStackCard)
  const character = useAppSelector(selectCharacter)
  const characterUsable = useAppSelector(selectCharacterUsable)

  const dispatch = useAppDispatch()

  useEffect(() => {
    socket.on('update_top_stack_card', (card: CardI) => {
      dispatch(setTopStackCard(card))
    })

    return () => {
      socket.off('update_top_stack_card')
    }
  }, [])

  function drawFromDeck () {
    socket.emit('draw_from_deck', { currentRoom, username })
    dispatch(setCharacterUsableFalse())
    dispatch(setSelectPlayerTargetFalse())
    dispatch(setDeckActiveFalse())
    dispatch(setNextTurnTrue())
  }

  function handleClick () {
    if (!deckActive) return
    drawFromDeck()
  }

  let deckStyle = {}
  if (deckActive) {
    deckStyle = { border: 'solid 2px red', cursor: 'pointer' }
  }

  let stackStyle = {}
  if (characterUsable && character === 'Pedro Ramirez') {
    stackStyle = { border: 'solid 2px red', cursor: 'pointer' }
  }

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (topStackCard != null && topStackCard !== undefined) {
    // this has to be here, otherwise CK take choice card bricks the game
    try {
      if (topStackCard.isPlayable) {
        dispatch(setTopStackCardNotActive())
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      // eslint-disable-next-line no-console
      console.log(topStackCard)
    }
  }

  function getTopStackCard () {
    if (character === 'Pedro Ramirez') {
      dispatch(setCharacterUsableFalse())
      dispatch(setSelectPlayerTargetFalse())
      dispatch(setDeckActiveFalse())
      dispatch(setNextTurnTrue())

      socket.emit('get_stack_card_PR', { currentRoom, username })
    }
  }

  return (
    <div className='flex space-x-4'>
      {(topStackCard != null && topStackCard !== undefined) &&
        <div
          style={stackStyle}
          className='rounded-md group relative'
          onClick={() => { getTopStackCard() }}
        >
          <img
            className='w-[36px] sm:w-[60px] xs:w-[80px] rounded-md'
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            src={require('../img/gfx/cards/' + topStackCard.name.replace(/!/, '').replace(/\s/, '').replace(/\./g, '') + '.png')}
            alt="deck card"
          />
          <div className='hidden p-1 z-40 font-rye absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[60px] group-hover:flex group-hover:flex-col group-hover:justify-center bg-transparentBlack text-white'>
            <div className='text-xl'>
              {topStackCard.name}
            </div>
            <div
              className='text-md flex w-full justify-center items-center space-x-1'
              dangerouslySetInnerHTML={{ __html: `${topStackCard.digit} ${parseCardType(topStackCard.type)}` }}
            />
          </div>
        </div>
      }
      <img
        className='w-[36px] sm:w-[60px] xs:w-[80px] rounded-md'
        style={deckStyle}
        src={require('../img/gfx/cards/back-playing.png')}
        alt="deck card"
        onClick={() => { handleClick() }}
      />
    </div>
  )
}
