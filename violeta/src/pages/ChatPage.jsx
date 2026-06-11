import { useState, useEffect, useRef, useCallback } from 'react'
import { Header } from '../components/ChatBot/Header'
import { ChatBubble } from '../components/ChatBot/ChatBubble'
import { ThinkingIndicator } from '../components/ChatBot/ThinkingIndicator'
import { MessageInput } from '../components/ChatBot/MessageInput'
import { QuickActions } from '../components/ChatBot/QuickActions'
import { useChat } from '../hooks/useChat'
import {
  getSlotRemainingMessages,
  incrementSlotMessageCount,
  syncSlotLimitData
} from '../lib/chatbot/slotLimit'
import Swal from 'sweetalert2'
import { AlertTriangle } from 'lucide-react'
import { ChatHistoryModal } from '../components/ChatBot/ChatHistoryModal'
import LegalModeModal from '../components/ChatBot/LegalModeModal'
import { useAuth } from '../context/SupabaseAuthContext'
import { supabase } from '../lib/customSupabaseClient'
import video from '../assets/imgs/violeta-avatar.mp4'
import poster from '../assets/imgs/avatar-violeta.jpeg'
import '../components/ChatBot/chatbot.css'

const darkSwal = Swal.mixin({
  customClass: {
    popup:
      'bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl shadow-black/50 mx-4 sm:mx-0',
    title: 'text-lg sm:text-xl font-bold text-white',
    htmlContainer: 'text-gray-400 text-sm',
    confirmButton:
      'bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl shadow-lg shadow-red-900/30 transition-all transform active:scale-95 text-sm sm:text-base',
    cancelButton:
      'bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl transition-all transform active:scale-95 text-sm sm:text-base',
    actions:
      'gap-3 sm:gap-4 flex flex-col-reverse sm:flex-row justify-center w-full px-4'
  },
  buttonsStyling: false,
  background: '#111827',
  color: '#f3f4f6'
})

export default function ChatPage() {
  const { user } = useAuth()
  const [isLegalMode, setIsLegalMode] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [slotRemainingMessages, setSlotRemainingMessages] = useState(20)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showLegalModeModal, setShowLegalModeModal] = useState(false)
  const chatContainerRef = useRef(null)

  const {
    messages,
    isLoading,
    isConnected,
    isInitialized,
    error,
    sendMessage,
    clearMessages,
    getSessions,
    switchToSession,
    deleteSession,
    currentSessionId,
    currentSlotId
  } = useChat({
    userId: user?.id,
    onError: (errorMsg) => console.error('Chat error')
  })

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 50)
    return () => clearTimeout(timeoutId)
  }, [messages.length, isLoading, scrollToBottom])

  const updateSlotCounter = async () => {
    const remaining = await getSlotRemainingMessages(currentSlotId)
    setSlotRemainingMessages(remaining)
  }

  useEffect(() => {
    const fetchRealLimit = async () => {
      if (!user?.id || !isInitialized) return
      try {
        const todayStr = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Mexico_City'
        }).format(new Date())

        const { data, error } = await supabase
          .from('user_chat_limits')
          .select('slot_id, message_count')
          .eq('user_id', user.id)
          .eq('last_date', todayStr)

        if (data && data.length > 0) {
          await Promise.all(
            data.map((limit) =>
              syncSlotLimitData(limit.slot_id, limit.message_count)
            )
          )
          await updateSlotCounter()
        }
      } catch (err) {
        console.error('Error sincronizando límite')
      }
    }
    fetchRealLimit()
  }, [user?.id, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      updateSlotCounter()
    }
  }, [currentSessionId, currentSlotId, messages.length, isInitialized])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (messages.length > 0) {
      setShowQuickActions(false)
    } else {
      setShowQuickActions(true)
    }
  }, [messages])

  const handleSendMessage = async (message) => {
    if (!currentSessionId) return

    try {
      await sendMessage(message, isLegalMode)
      await incrementSlotMessageCount(currentSlotId)
      await updateSlotCounter()
    } catch (err) {
      console.error(`❌ Error enviando mensaje`)
    }
  }

  const handleToggleLegalMode = () => {
    if (isLegalMode) setIsLegalMode(false)
    else setShowLegalModeModal(true)
  }

  const handleConfirmLegalMode = () => {
    setIsLegalMode(true)
  }

  const handleClearChat = () => {
    darkSwal
      .fire({
        title: '¿Estás segura de que deseas limpiar el chat actual?',
        text: 'Esta acción no se puede deshacer y se perderá todo el historial de esta conversación.',
        icon: 'warning',
        iconColor: '#ef4444',
        showCancelButton: true,
        confirmButtonText: 'Sí, limpiar chat',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await clearMessages()
          setShowQuickActions(true)
        }
      })
  }

  const handleSelectSession = (sessionId) => {
    switchToSession(sessionId)
    setShowHistoryModal(false)
  }

  const handleDeleteSession = async (sessionId) => {
    await deleteSession(sessionId)
  }

  useEffect(() => {
    document.title = '💜 Fuerza Violeta - Asistente de Orientación 💜'
  }, [])

  return (
    <div
      className='fixed inset-0 w-full flex flex-col md:h-full md:block md:static overflow-hidden overscroll-none bg-slate-900'
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className='w-full h-full mx-auto flex flex-col p-2 max-w-full md:max-w-4xl lg:max-w-5xl min-h-0'>
        <Header
          isConnected={isConnected}
          onClearChat={handleClearChat}
          onHistoryClick={() => setShowHistoryModal(true)}
          dailyMessagesUsed={20 - slotRemainingMessages}
          dailyMessagesMax={20}
        />

        <div
          className='flex-1 min-h-0 glass-strong rounded-2xl p-2 sm:p-3 md:p-4 flex flex-col overflow-hidden relative transform-gpu'
          style={{ boxShadow: '0 8px 32px rgba(107,63,160,0.1)' }}
        >
          <div
            ref={chatContainerRef}
            className='flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 scroll-smooth overscroll-contain'
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(139, 92, 246, 0.5) transparent',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {messages.length === 0 && (
              <div className='flex flex-col items-center justify-center text-center px-2 py-4 sm:py-6 mx-auto'>
                <div
                  className='w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-violet-500/30 mb-3 sm:mb-4 flex items-center justify-center shrink-0 transform-gpu'
                  style={{ boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)' }}
                >
                  <video
                    src={video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={poster}
                    className='w-full h-full object-cover rounded-full will-change-transform'
                    aria-label='Violeta avatar animado'
                    style={{ objectPosition: 'center center' }}
                  />
                </div>
                <h2 className='text-lg sm:text-xl font-bold text-white mb-1'>
                  🌺 Hola, soy Violeta 💜
                </h2>
                <p className='text-gray-200 mb-1 text-xs sm:text-sm'>
                  Gracias por escribirme, 🌸
                </p>
                <p className='text-gray-300 mb-2 sm:mb-3 text-xs sm:text-sm font-medium'>
                  Estoy aquí para orientarte. Elige una opción 👇
                </p>
                <p className='text-[10px] sm:text-xs text-gray-400 mb-4 sm:mb-6'>
                  Tienes {slotRemainingMessages} mensajes disponibles hoy
                </p>

                {showQuickActions && (
                  <div className='w-full'>
                    <QuickActions
                      onAction={handleSendMessage}
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>
            )}

            <div className='pb-4'>
              {messages.map((msg, index) => (
                <ChatBubble
                  key={`${msg.timestamp}-${index}`}
                  message={msg.content}
                  isUser={msg.role === 'user'}
                  timestamp={msg.timestamp}
                />
              ))}

              {isLoading && <ThinkingIndicator duration={5000} />}

              {error && (
                <div className='flex justify-center mb-4 px-2'>
                  <div className='glass border-2 border-alert-red/30 text-alert-red px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm max-w-md text-center'>
                    <AlertTriangle className='inline-block mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5 align-text-bottom' />
                    {error}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='shrink-0 pt-2'>
            <MessageInput
              onSend={handleSendMessage}
              disabled={isLoading}
              isLegalMode={isLegalMode}
              onToggleLegalMode={handleToggleLegalMode}
            />

            <p className='text-[9px] sm:text-[10px] text-slate-400 text-center px-4 mt-2'>
              Tus conversaciones serán almacenadas 24h y después eliminadas por
              tu privacidad
            </p>
          </div>
        </div>
      </div>

      <ChatHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        sessions={getSessions()}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      <LegalModeModal
        isOpen={showLegalModeModal}
        onClose={() => setShowLegalModeModal(false)}
        onConfirm={handleConfirmLegalMode}
      />
    </div>
  )
}
