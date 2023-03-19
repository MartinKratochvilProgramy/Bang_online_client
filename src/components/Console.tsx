import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setActionMessage } from '../features/actionMessageSlice'
import { selectCurrentPlayer } from '../features/currentPlayerSlice'
import { selectUsername } from '../features/usernameSlice'

import { socket } from '../socket'

export const Console = () => {
  const username = useAppSelector(selectUsername)
  const currentPlayer = useAppSelector(selectCurrentPlayer)

  const dispatch = useAppDispatch()

  const [consoleOutput, setConsoleOutput] = useState<string[]>([])

  useEffect(() => {
    socket.on('console', (consoleMessage: string[]) => {
      for (let i = 0; i < consoleMessage.length; i++) {
        const message = consoleMessage[i]
        const messageFormatted = message
          .replace('hearts', '&#9829;')
          .replace('diamonds', '&#9830;')
          .replace('clubs', '&#9827;')
          .replace('spades', '&#9824;')
        setConsoleOutput(consoleOutput => [...consoleOutput, messageFormatted])

        // set actionMessage if action req from player
        if (username !== null) {
          if (
            (message.includes('used Bang!') && (!message.includes('Indiani') && !message.includes('Gatling') && !message.includes('Duel'))) ||
            (message.includes('used Duel') && message.includes(`on ${username}`)) ||
            message.includes('used Gatling') ||
            message.includes('used Indiani') ||
            message.includes('used Cat Balou') ||
            message.includes('used Panico')
          ) {
            // replace username with 'You'
            // the splitting in code is done because username could for ex.
            // be 'a' and this would replace inside 'Bang!' -> 'BYoung! etc.
            let [_body, target] = message.split('on ')
            let [actor, body] = _body.split(' used')

            target !== undefined ? target = 'on ' + target.replace(username, 'you') : target = ''
            actor !== undefined ? actor = actor.replace(username, 'You') + ' used' : target = ''

            dispatch(setActionMessage(actor + body + target + '!'))
          }

          if (message.includes('in Duel with')) {
            // this is to display oponnent Bang! action in duel
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [currentDuelPlayer, body] = message.split(' used')
            if (currentDuelPlayer !== username) {
              dispatch(setActionMessage(`${currentDuelPlayer} used Bang!`))
            }
          }

          if ((message.includes('Dynamite exploded!') && (currentPlayer === username))) {
            dispatch(setActionMessage(message))
          }
        }
      }
    })

    return () => {
      socket.off('console')
    }
  }, [])

  useEffect(() => {
    const textArea = document.getElementById('console-output')
    if (textArea !== null) textArea.scrollTop = textArea.scrollHeight
  }, [consoleOutput])

  return (
    <div
      id='console-output'
      className='bg-beige rounded w-[200px] sm:w-[280px] xs:w-[440px] p-2 text-sm xs:text-md overflow-auto h-[120px] sm:h-[160px] xs:h-[200px]'>
      {consoleOutput.map((message, index) => {
        let additionalStyles = {}
        if (username !== null && (
          message.includes(' ' + username) ||
          message.includes(username + ' ') // this is here because the check would catch usernames inside words (username: B is in Bang! etc.)
        )) {
          additionalStyles = {
            fontWeight: 'bold'
          }
        }
        return (
          <div
            key={index}
            style={additionalStyles}
            className='flex text-start w-full my-1'
            dangerouslySetInnerHTML={{ __html: `${message}` }}
          />
        )
      })}
    </div>
  )
}
