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
  role: string
  oponentName: string
  health: number
  character: string
  table: CardI[]
  rotateDescription: number
  cardsInHand: number[]
  confirmCardTarget: (cardName: string, cardDigit: number, cardType: string, oponentName: string) => void
  confirmPlayerTarget: (target: string) => void
}

export const SidePlayerTable: React.FC<Props> = ({ role, oponentName, health, character, table, rotateDescription, cardsInHand, confirmCardTarget, confirmPlayerTarget }) => {
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const playersInRange = useAppSelector(selectPlayersInRange)
  const selectPlayerTarget = useAppSelector(selectSelectPlayerTarget)

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const characterSource = require(`../img/gfx/characters/${character.replace(/\s/g, '')}.png`)

  let roleSource
  if (role === null) {
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
    <div className='w-[300px] xs:w-full z-50 relative'>
      <div className='space-x-2 absolute left-[50%] translate-x-[-50%] flex justify-center mb-1 xs:mb-2 translate-y-[-95px] xs:translate-y-[-130px]'>
        {table.map((card: CardI) => {
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
      <div
        className='flex justify-between items-end mx-4 h-[105px] sm:h-[145px] xs:h-[176px] bg-beige rounded p-2 relative'
      >
        <div className='flex w-auto min-w-[38px] sm:min-w-[60px] xs:min-w-[80px] text-xs xs:text-sm flex-col items-start font-rye'>
          <div className='overflow-visible'>{oponentName}</div>
          <div>HP: {health}</div>
          <div className='relative flex justify-center group'>
            <img
              src={characterSource}
              style={characterStyles}
              id={'oponent-' + oponentName}
              onClick={() => { handleCharacterClick() }}
              className='w-[38px] sm:w-[60px] xs:w-[80px] rounded-md ml-2 mr-4'
              alt="Oponent player character">
            </img>
            <div
              style={{ rotate: `${rotateDescription}deg` }}
              className={'hidden p-1 z-10 rounded group-hover:flex group-hover:flex-col group-hover:justify-center left-[10px] top-[-50px] w-[200px] mx-auto bg-transparentBlack text-white absolute'}>
              <div className='text-xl'>
                {character}
              </div>
              <div className='text-xs'>
                {getCharacterDescription(character)}
              </div>
            </div>
          </div>
        </div>

        <div className='flex w-auto min-w-[38px] sm:min-w-[70px] xs:min-w-[90px] relative group'>
          <img
            className='w-[38px] sm:w-[60px] xs:w-[80px]'
            src={roleSource} alt="">
          </img>
        </div>

        <div className='flex h-full justify-start items-end ml-1'>
          <CardsInHand oponentName={oponentName} cardsInHand={cardsInHand} />
        </div>
      </div>
    </div>
  )
}
