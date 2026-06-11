import { useEffect, useRef, useState } from 'react'

export const useMessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`
    }
  }, [message])

  const handleSubmit = (e) => {
    e.preventDefault()

    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage)
      setMessage('')

      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return {
    message,
    setMessage,
    isFocused,
    setIsFocused,
    inputRef,
    handleSubmit,
    handleKeyDown
  }
}
