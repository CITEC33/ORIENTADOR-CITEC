import { useState, useCallback, useEffect, useRef } from 'react'
import { getSlotRemainingMessages } from '../lib/chatbot/slotLimit'
import { supabase } from '../lib/customSupabaseClient'
import { AppStorage } from '../lib/appStorage'

const MAX_SESSIONS = 2

export function useChat(options) {
  const { userId = 'anonymous', onError } = options || {}

  const [sessions, setSessions] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [sessionId, setSessionId] = useState(null)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const debounceTimerRef = useRef(null)

  const getMxDateString = useCallback(() => {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date())
  }, [])

  const saveSessionsToStorage = async (newSessions) => {
    setSessions(newSessions)
    await AppStorage.set('violeta_chat_sessions', JSON.stringify(newSessions))
  }

  const checkAndResetNewDay = useCallback(async () => {
    const today = getMxDateString()
    const storedDate = await AppStorage.get('violeta_chat_date')

    if (storedDate && storedDate !== today) {
      const sessionsStr = await AppStorage.get('violeta_chat_sessions')
      let currentSessions = sessionsStr ? JSON.parse(sessionsStr) : []

      const resetSessions = currentSessions.map((s) => ({
        ...s,
        messages: [],
        messageCount: 0
      }))

      await saveSessionsToStorage(resetSessions)
      await AppStorage.set('violeta_chat_date', today)

      setMessages([])
      setError(null)
      return true
    }
    return false
  }, [getMxDateString])

  useEffect(() => {
    const loadCurrentSession = async () => {
      try {
        const today = getMxDateString()
        const storedDate = await AppStorage.get('violeta_chat_date')
        const sessionsStr = await AppStorage.get('violeta_chat_sessions')

        let loadedSessions = sessionsStr ? JSON.parse(sessionsStr) : []

        if (storedDate !== today) {
          loadedSessions = loadedSessions.map((s) => ({
            ...s,
            messages: [],
            messageCount: 0
          }))
          await AppStorage.set('violeta_chat_date', today)
        }

        let changed = false
        while (loadedSessions.length < MAX_SESSIONS) {
          loadedSessions.push({
            id: `session_${Date.now()}_${Math.random()
              .toString(36)
              .substring(7)}`,
            messages: [],
            messageCount: 0,
            createdAt: Date.now()
          })
          changed = true
        }

        if (changed || storedDate !== today) {
          await saveSessionsToStorage(loadedSessions)
        } else {
          setSessions(loadedSessions)
        }

        setSessionId(loadedSessions[0].id)
        setMessages(loadedSessions[0].messages)
        setIsInitialized(true)
      } catch (error) {
        console.error('Error al cargar la sesión actual:', error)
      }
    }

    loadCurrentSession()
  }, [getMxDateString])

  useEffect(() => {
    if (!isInitialized) return
    const interval = setInterval(() => {
      checkAndResetNewDay()
    }, 60000)
    return () => clearInterval(interval)
  }, [checkAndResetNewDay, isInitialized])

  const getCurrentSlotId = useCallback(() => {
    const index = sessions.findIndex((s) => s.id === sessionId)
    return index >= 0 ? `slot_${index}` : 'slot_0'
  }, [sessionId, sessions])

  const sendMessage = useCallback(
    async (message, isLegalMode = false) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      if (!isInitialized) return

      const wasReset = await checkAndResetNewDay()
      const baseMessages = wasReset ? [] : messages
      const currentSlotId = getCurrentSlotId()

      if (!message.trim()) {
        setError('El mensaje no puede estar vacío')
        return
      }

      if (message.length > 2000) {
        setError('El mensaje es demasiado largo (máximo 2000 caracteres)')
        return
      }

      const remaining = await getSlotRemainingMessages(currentSlotId)
      if (remaining <= 0) {
        setError('Has alcanzado el límite de 20 mensajes en este chat.')
        return
      }

      setIsLoading(true)
      setError(null)

      const userMessage = {
        role: 'user',
        content: message,
        timestamp: Date.now()
      }
      const newMessages = [...baseMessages, userMessage]
      setMessages(newMessages)

      try {
        const { data, error: functionError } = await supabase.functions.invoke(
          'chat-message',
          {
            body: {
              message,
              sessionId,
              slotId: currentSlotId,
              isLegalMode,
              profileId: userId,
              conversationHistory: baseMessages
            }
          }
        )

        if (functionError) throw functionError

        if (data && data.success) {
          const assistantMessage = {
            role: 'assistant',
            content: data.response,
            timestamp: Date.now()
          }

          let updatedMessages = [...newMessages, assistantMessage]

          if (data.currentCount && data.currentCount >= 20) {
            updatedMessages.push({
              role: 'assistant',
              content:
                'He alcanzado mi límite de orientación en este chat, pero recuerda que no estás sola. Si tienes una emergencia, llama a la Dirección Municipal de Seguridad Publica al 618 284 4879 o comunícate a la UNIPAV al 618 132 4604. Estaré aquí para ti mañana.',
              timestamp: Date.now() + 1000
            })
          }

          setMessages(updatedMessages)

          const updatedSessions = [...sessions]
          const targetIndex = updatedSessions.findIndex(
            (s) => s.id === (sessionId || data.sessionId)
          )

          if (targetIndex >= 0) {
            updatedSessions[targetIndex] = {
              ...updatedSessions[targetIndex],
              messages: updatedMessages,
              messageCount: updatedMessages.filter((m) => m.role === 'user')
                .length
            }
            await saveSessionsToStorage(updatedSessions)
          }

          if (!sessionId) setSessionId(data.sessionId)
          setIsConnected(true)
          return data
        } else {
          throw new Error(data?.error || 'Error del servidor')
        }
      } catch (err) {
        setIsConnected(false)
        let errorMessage = 'Error al enviar mensaje'

        if (err.status === 403 || err.message?.includes('límite')) {
          errorMessage = 'Has alcanzado el límite de 20 mensajes en este chat'
        } else if (err.status === 429) {
          errorMessage = 'Demasiadas solicitudes. Espera un momento'
        } else if (err.message) {
          errorMessage = err.message
        }

        setError(errorMessage)
        onError?.(errorMessage)
        setMessages(baseMessages)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [
      sessionId,
      messages,
      onError,
      userId,
      getCurrentSlotId,
      checkAndResetNewDay,
      isInitialized,
      sessions
    ]
  )

  const clearMessages = async () => {
    if (sessions.length >= 2 && sessionId) {
      const updatedSessions = sessions.map((s) =>
        s.id === sessionId ? { ...s, messages: [], messageCount: 0 } : s
      )
      await saveSessionsToStorage(updatedSessions)
    }
    setMessages([])
    setError(null)
  }

  const getChatCount = useCallback(() => sessions.length, [sessions])
  const getSessions = useCallback(() => sessions, [sessions])

  const switchToSession = useCallback(
    (newSessionId) => {
      const session = sessions.find((s) => s.id === newSessionId)
      if (session) {
        setSessionId(session.id)
        setMessages(session.messages)
        setError(null)
      }
    },
    [sessions]
  )

  const deleteSession = async (sessionIdToDelete) => {
    const updatedSessions = sessions.map((s) =>
      s.id === sessionIdToDelete ? { ...s, messages: [], messageCount: 0 } : s
    )
    await saveSessionsToStorage(updatedSessions)
    if (sessionIdToDelete === sessionId) {
      setMessages([])
      setError(null)
    }
  }

  const currentSlotId = getCurrentSlotId()
  const checkConnection = () => setIsConnected(true)

  return {
    messages,
    isLoading,
    isConnected,
    isInitialized,
    sessionId: sessionId || '',
    currentSessionId: sessionId,
    currentSlotId,
    error,
    sendMessage,
    clearMessages,
    checkConnection,
    getChatCount,
    getSessions,
    switchToSession,
    deleteSession
  }
}
