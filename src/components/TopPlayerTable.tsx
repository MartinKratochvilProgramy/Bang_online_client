import React from 'react'
import { useAppSelector } from '../app/hooks'
import { selectCurrentPlayer } from '../features/currentPlayerSlice'
import { selectPlayersInRange } from '../features/playersInRangeSlice'
import { selectSelectPlayerTarget } from '../features/selectPlayerTargetSlice'
import { type CardI } from '../types/card'
import getCharacterDescription from '../utils/getCharacterDescription'
import { CardsInHand } from './CardsInHand'
import { OponentCardOnTable } from './OponentCardOnTable'

interface Props {
  oponentName: string
  health: number
  character: string
  table: CardI[]
  cardsInHand: number[]
  confirmCardTarget: (cardName: string, cardDigit: number, cardType: string, oponentName: string) => void
  confirmPlayerTarget: (target: string) => void
  role?: string
}

export const TopPlayerTable: React.FC<Props> = ({
  oponentName,
  health,
  character,
  table,
  cardsInHand,
  confirmCardTarget,
  confirmPlayerTarget,
  role
}) => {
  const playersInRange = useAppSelector(selectPlayersInRange)
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const selectPlayerTarget = useAppSelector(selectSelectPlayerTarget)

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const characterSource = require(`../img/gfx/characters/${character.replace(/\s/g, '')}.png`)

  let roleSource
  if (role === null || role === undefined) {
    roleSource = require('../img/gfx/roles/back-role.png')
  } else {
    roleSource = require('../img/gfx/roles/' + role + '.png')
  }

  let characterStyles = {}
  if (oponentName === currentPlayer || (playersInRange.includes(oponentName) && selectPlayerTarget)) {
    characterStyles = { color: 'red', border: 'solid 2px red', cursor: 'pointer' }
  }

  function handleCharacterClick () {
    if (!playersInRange.includes(oponentName)) return
    confirmPlayerTarget(oponentName)
  }

  return (
    <div className='relative'>
      <div
        className='flex justify-start items-start h-[94px] sm:h-[135px] xs:h-[176px] bg-beige rounded px-2 py-1 sm:p-2'
      >
        <div className='flex z-20 w-auto min-w-[38px] sm:min-w-[60px] xs:min-w-[80px] text-xs xs:text-sm flex-col-reverse items-start font-rye'>
          <div className='flex flex-col items-start'>
            <div className='overflow-visible'>{oponentName}</div>
            <div>HP: {health}</div>
          </div>
          <div className='flex justify-center group'>
            <img
              src={characterSource}
              style={characterStyles}
              onClick={() => { handleCharacterClick() }}
              className='w-[38px] sm:w-[60px] xs:w-[80px]  rounded-md mr-2' alt="Player character">
            </img>
            <div className='hidden p-1 rounded group-hover:flex group-hover:flex-col group-hover:justify-center top-[96px] xs:top-[126px] w-[200px] mx-auto bg-transparentBlack text-white absolute'>
              <div className='text-xl'>
                {character}
              </div>
              <div className='text-xs'>
                {getCharacterDescription(character)}
              </div>
            </div>
          </div>
        </div>

        <div
          id='top-player-character'
          className='flex justify-start xs:justify-center w-auto min-w-[38px] sm:min-w-[60px] xs:min-w-[80px] group mr-1'>
          <img
            className='w-[38px] sm:w-[60px] xs:w-[80px]'
            src={roleSource} alt="">
          </img>
        </div>

        <CardsInHand oponentName={oponentName} cardsInHand={cardsInHand} />

      </div>
      <div className='space-x-2 absolute left-[50%] translate-x-[-50%] rotate-0 mt-0 xs:mt-2 flex justify-center'>
        {table.map(card => {
          return (
            <OponentCardOnTable
              card={card}
              oponentName={oponentName}
              confirmCardTarget={confirmCardTarget}
              key={`${card.name}-${card.digit}-${card.type}`}
            />
          )
        })}
      </div>
    </div>
  )
}
