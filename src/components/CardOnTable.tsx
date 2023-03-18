import React from 'react'
import { useAppSelector } from '../app/hooks'
import { selectCurrentRoom } from '../features/currentRoomSlice'
import { selectSelectCardTarget } from '../features/selectCardTargetSlice'
import { selectUsername } from '../features/usernameSlice'

import { socket } from '../socket'
import { type CardI } from '../types/card'
import { parseCardType } from './Card'

interface Props {
  card: CardI
  confirmCardTarget: (cardName: string, cardDigit: number, cardType: string, oponentName: string) => void
}

export const CardOnTable: React.FC<Props> = ({ card, confirmCardTarget }) => {
  const username = useAppSelector(selectUsername)
  const currentRoom = useAppSelector(selectCurrentRoom)
  const selectCardTarget = useAppSelector(selectSelectCardTarget)

  function playCardOnTable () {
    if (selectCardTarget) {
      if (username === null) return
      confirmCardTarget(card.name, card.digit, card.type, username)
    }
    if (!card.isPlayable) return
    if (card.name === 'Barilo') {
      socket.emit('use_barel', { username, currentRoom })
    }
    if (card.name === 'Dynamite') {
      socket.emit('use_dynamite', { username, currentRoom, card })
    }
    if (card.name === 'Prigione') {
      socket.emit('use_prigione', { username, currentRoom, card })
    }
  }

  let styles
  if (card.isPlayable) {
    styles = { color: 'red', border: 'solid 2px red', cursor: 'pointer' }
  } else {
    styles = { cursor: 'auto' }
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cardSource = require('../img/gfx/cards/' + card.name.replace(/!/, '').replace(/\s/, '').replace(/\./g, '') + '.png')

  return (
    <button
      onClick={() => { playCardOnTable() }}
      style={styles}
      className='w-[36px] sm:w-[60px] xs:w-[80px] rounded-md group flex flex-row justify-center'>
      <img src={cardSource} alt="" />
      <div className='hidden p-1 z-40 font-rye absolute rounded group-hover:flex group-hover:flex-col group-hover:justify-center translate-y-[-60px] bg-transparentBlack text-white'>
        <div className='text-xl'>
          {card.name}
        </div>
        <div
          className='text-md flex w-full justify-center items-center space-x-1'
          dangerouslySetInnerHTML={{ __html: `${card.digit} ${parseCardType(card.type)}` }}
        />
      </div>
    </button>
  )
}
