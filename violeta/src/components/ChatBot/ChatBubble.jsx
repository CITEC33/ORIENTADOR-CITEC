import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const ChatBubble = memo(function ChatBubble({
  message,
  isUser,
  timestamp
}) {
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : ''

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      } mb-4 animate-[slideIn_0.3s_ease-out]`}
      style={{ contentVisibility: 'auto' }}
    >
      <div
        className={`flex flex-col gap-1 max-w-[90%] md:max-w-[75%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`
            px-2.5 py-2.5 sm:px-5 sm:py-3 rounded-2xl
            ${
              isUser
                ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-violet-glow'
                : 'glass border border-slate-600/30 text-slate-200'
            }
            transition-all duration-200
          `}
          style={{
            boxShadow: isUser
              ? '0 0 20px rgba(139, 92, 246, 0.3)'
              : '0 0 15px rgba(59, 130, 246, 0.1)'
          }}
        >
          {isUser ? (
            <p className='text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words'>
              {message}
            </p>
          ) : (
            <div className='prose prose-invert prose-xs sm:prose-sm max-w-none markdown-content break-words text-xs sm:text-sm'>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      className='mb-2 sm:mb-3 last:mb-0 leading-relaxed'
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className='font-bold text-blue-300' {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className='italic text-slate-300' {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className='list-disc list-outside ml-4 sm:ml-5 mb-2 sm:mb-3 space-y-1'
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className='list-decimal list-outside ml-4 sm:ml-5 mb-2 sm:mb-3 space-y-1'
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className='text-slate-200 leading-relaxed [&>p]:inline'
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className='text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-blue-300'
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className='text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-blue-300'
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className='text-sm sm:text-base font-bold mb-1.5 sm:mb-2 text-blue-400'
                      {...props}
                    />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        className='px-1 py-0.5 rounded bg-slate-700/50 text-cyan-300 text-[10px] sm:text-xs font-mono'
                        {...props}
                      />
                    ) : (
                      <code
                        className='block px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-slate-800/50 text-cyan-300 text-[10px] sm:text-xs font-mono overflow-x-auto mb-2 sm:mb-3'
                        {...props}
                      />
                    ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className='border-l-4 border-blue-500 pl-3 sm:pl-4 py-1.5 sm:py-2 my-2 sm:my-3 italic text-slate-300 bg-slate-800/30 rounded-r'
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className='text-blue-400 hover:text-blue-300 underline transition-colors break-all'
                      target='_blank'
                      rel='noopener noreferrer'
                      {...props}
                    />
                  )
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {timestamp && (
          <span
            className={`text-[10px] sm:text-xs text-slate-500 px-2 ${
              isUser ? 'text-right' : 'text-left'
            }`}
          >
            {formattedTime}
          </span>
        )}
      </div>
    </div>
  )
})
