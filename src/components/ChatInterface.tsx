import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Send, Bot, User } from 'lucide-react'
import { blink } from '@/blink/client'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привет! Я ваш ИИ помощник. Как дела? О чём хотите поговорить?',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setStreamingMessage('')

    try {
      let fullResponse = ''
      
      await blink.ai.streamText(
        {
          messages: [
            { role: 'system', content: 'Ты дружелюбный и полезный ИИ помощник. Отвечай на русском языке естественно и содержательно.' },
            ...messages.map(msg => ({
              role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
              content: msg.content
            })),
            { role: 'user', content: userMessage.content }
          ],
          model: 'gpt-4o-mini'
        },
        (chunk) => {
          fullResponse += chunk
          setStreamingMessage(fullResponse)
        }
      )

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fullResponse,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setStreamingMessage('')
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Извините, произошла ошибка. Попробуйте ещё раз.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setStreamingMessage('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Заголовок */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-indigo-100">
            <AvatarFallback className="bg-indigo-500 text-white">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">ИИ Помощник</h1>
            <p className="text-sm text-slate-500">Всегда готов помочь</p>
          </div>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 bg-indigo-100 flex-shrink-0">
                  <AvatarFallback className="bg-indigo-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex flex-col gap-1 max-w-[70%] ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}>
                <Card className={`px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : 'bg-white text-slate-900 border-slate-200'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </Card>
                <span className="text-xs text-slate-400 px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {message.role === 'user' && (
                <Avatar className="h-8 w-8 bg-slate-100 flex-shrink-0">
                  <AvatarFallback className="bg-slate-500 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Потоковое сообщение */}
          {streamingMessage && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-indigo-100 flex-shrink-0">
                <AvatarFallback className="bg-indigo-500 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col gap-1 max-w-[70%] items-start">
                <Card className="px-4 py-3 bg-white text-slate-900 border-slate-200">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {streamingMessage}
                    <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse" />
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Индикатор печати */}
          {isLoading && !streamingMessage && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-indigo-100 flex-shrink-0">
                <AvatarFallback className="bg-indigo-500 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col gap-1 max-w-[70%] items-start">
                <Card className="px-4 py-3 bg-white text-slate-900 border-slate-200">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-500">печатает</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                disabled={isLoading}
                className="min-h-[44px] resize-none border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-[44px] px-4 bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}