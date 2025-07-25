import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { Send, Smile, Settings, MoreHorizontal } from 'lucide-react'
import { blink } from '../blink/client'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  isStreaming?: boolean
}

interface Character {
  name: string
  avatar: string
  personality: string
  roleScript: string
  status: string
}

interface DiscordStyleChatProps {
  character: Character
  onBackToSetup: () => void
}

const DiscordStyleChat: React.FC<DiscordStyleChatProps> = ({ character, onBackToSetup }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  useEffect(() => {
    // Приветственное сообщение от персонажа
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `*${character.name} появляется в чате*\n\nПривет! Я ${character.name}. ${character.personality}\n\nГотов к ролевой игре? Просто начни диалог, и я буду играть свою роль! 🎭`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [character, messages.length])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    setStreamingContent('')

    try {
      const rolePrompt = `${character.roleScript}

Важные правила:
- Ты ВСЕГДА остаешься в роли ${character.name}
- Отвечай ТОЛЬКО от лица своего персонажа
- Используй эмоции, действия в *звездочках*
- Говори естественно на русском языке
- Создавай интересные диалоги и ситуации
- Можешь использовать эмодзи для выражения эмоций

Текущая ситуация: Пользователь написал тебе: "${inputValue}"

Ответь как ${character.name}:`

      let finalContent = ''
      
      await blink.ai.streamText(
        {
          prompt: rolePrompt,
          model: 'gpt-4o-mini',
          maxTokens: 500
        },
        (chunk) => {
          finalContent += chunk
          setStreamingContent(finalContent)
        }
      )

      // Когда стриминг завершен, добавляем сообщение в историю
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: finalContent,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setStreamingContent('')
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '*Произошла ошибка при получении ответа. Попробуйте еще раз.*',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
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

  const quickCommands = [
    { label: '👋 Поприветствовать', command: 'Привет! Как дела?' },
    { label: '❓ Задать вопрос', command: 'Расскажи о себе подробнее' },
    { label: '🎭 Начать сценарий', command: 'Давай разыграем интересную сцену!' },
    { label: '💭 Узнать мысли', command: 'О чем ты сейчас думаешь?' }
  ]

  return (
    <div className="flex flex-col h-screen bg-[#36393f] text-white">
      {/* Заголовок чата */}
      <div className="flex items-center justify-between p-4 bg-[#2f3136] border-b border-[#40444b]">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-[#5865f2] text-white">
              {character.avatar || '🤖'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white">{character.name}</h2>
              <Badge variant="secondary" className="bg-[#57f287] text-[#2f3136] text-xs">
                ОНЛАЙН
              </Badge>
            </div>
            <p className="text-sm text-[#b9bbbe]">{character.status}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToSetup}
            className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b]"
          >
            <Settings className="w-4 h-4 mr-2" />
            Настройки
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b]"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Быстрые команды */}
      <div className="p-3 bg-[#2f3136] border-b border-[#40444b]">
        <div className="flex flex-wrap gap-2">
          {quickCommands.map((cmd, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInputValue(cmd.command)}
              className="bg-[#40444b] border-[#40444b] text-[#b9bbbe] hover:bg-[#5865f2] hover:text-white hover:border-[#5865f2] text-xs"
            >
              {cmd.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <Avatar className="w-10 h-10 mt-1">
              <AvatarFallback className={message.sender === 'bot' ? 'bg-[#5865f2] text-white' : 'bg-[#57f287] text-[#2f3136]'}>
                {message.sender === 'bot' ? character.avatar : '👤'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-medium text-white">
                  {message.sender === 'bot' ? character.name : 'Вы'}
                </span>
                <span className="text-xs text-[#72767d]">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              
              <div className="text-[#dcddde] whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {/* Стриминговое сообщение */}
        {streamingContent && (
          <div className="flex gap-3">
            <Avatar className="w-10 h-10 mt-1">
              <AvatarFallback className="bg-[#5865f2] text-white">
                {character.avatar}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-medium text-white">{character.name}</span>
                <span className="text-xs text-[#72767d]">сейчас</span>
              </div>
              
              <div className="text-[#dcddde] whitespace-pre-wrap break-words">
                {streamingContent}
                <span className="inline-block w-2 h-5 bg-[#5865f2] ml-1 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Индикатор печати */}
        {isTyping && !streamingContent && (
          <div className="flex gap-3">
            <Avatar className="w-10 h-10 mt-1">
              <AvatarFallback className="bg-[#5865f2] text-white">
                {character.avatar}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-medium text-white">{character.name}</span>
                <span className="text-xs text-[#72767d]">печатает...</span>
              </div>
              
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#72767d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#72767d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#72767d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="p-4 bg-[#2f3136] border-t border-[#40444b]">
        <Card className="bg-[#40444b] border-[#40444b] p-3">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Сообщение для ${character.name}...`}
                disabled={isTyping}
                className="bg-transparent border-none text-white placeholder:text-[#72767d] focus:ring-0 focus:ring-offset-0 p-0"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#b9bbbe] hover:text-white hover:bg-[#36393f] p-2"
              >
                <Smile className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="bg-[#5865f2] hover:bg-[#4752c4] text-white p-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-[#72767d] mt-2">
            Нажмите Enter для отправки • Shift+Enter для новой строки
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DiscordStyleChat