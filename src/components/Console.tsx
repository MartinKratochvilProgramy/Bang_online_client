import React, { useState, useEffect } from 'react'
import { useAppSelector } from '../app/hooks'
import { selectUsername } from '../features/usernameSlice'

import { socket } from '../socket'

export const Console = () => {
  const username = useAppSelector(selectUsername)

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
      className='bg-beige rounded w-[200px] sm:w-[280px] xs:w-[320px] p-2 text-sm xs:text-md overflow-auto h-[120px] xs:h-[240px]'>
      {consoleOutput.map((message, index) => {
        let additionalStyles = {}
        if (username !== null && message.includes(username)) {
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
