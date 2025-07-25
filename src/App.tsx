import React, { useState, useEffect } from 'react'
import { blink } from './blink/client'
import CharacterSetup from './components/CharacterSetup'
import DiscordStyleChat from './components/DiscordStyleChat'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Loader2, Bot, Users } from 'lucide-react'

interface Character {
  name: string
  avatar: string
  personality: string
  roleScript: string
  status: string
}

interface User {
  id: string
  email: string
  displayName?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'setup' | 'chat'>('setup')
  const [character, setCharacter] = useState<Character>({
    name: '',
    avatar: '🤖',
    personality: '',
    roleScript: '',
    status: 'Готов к общению'
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleLogin = () => {
    blink.auth.login()
  }

  const handleLogout = () => {
    blink.auth.logout()
  }

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    setCharacter(updatedCharacter)
  }

  const handleStartChat = () => {
    setCurrentView('chat')
  }

  const handleBackToSetup = () => {
    setCurrentView('setup')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#36393f] flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-[#b9bbbe]">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2f3136] via-[#36393f] to-[#2f3136] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#2f3136] border-[#40444b] text-white">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#5865f2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                РП Бот - Ролевой Помощник
              </h1>
              <p className="text-[#b9bbbe] text-sm">
                Создавайте уникальных персонажей и ведите увлекательные ролевые диалоги
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-[#b9bbbe]">
                <div className="w-8 h-8 bg-[#40444b] rounded-full flex items-center justify-center">
                  🎭
                </div>
                <span>Любые ролевые персонажи по вашему скрипту</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#b9bbbe]">
                <div className="w-8 h-8 bg-[#40444b] rounded-full flex items-center justify-center">
                  💬
                </div>
                <span>Интерфейс в стиле Discord</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#b9bbbe]">
                <div className="w-8 h-8 bg-[#40444b] rounded-full flex items-center justify-center">
                  🇷🇺
                </div>
                <span>Полностью на русском языке</span>
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white"
            >
              Войти и Начать
            </Button>

            <p className="text-xs text-[#72767d] mt-4">
              Войдите, чтобы создать своего первого ролевого персонажа
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#36393f]">
      {/* Верхняя панель навигации */}
      <div className="bg-[#2f3136] border-b border-[#40444b] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5865f2] rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">РП Бот</h1>
              <p className="text-sm text-[#b9bbbe]">Ролевой Помощник</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[#b9bbbe]">
              <Users className="w-4 h-4" />
              <span>{user.displayName || user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-[#40444b] border-[#40444b] text-[#b9bbbe] hover:bg-[#36393f] hover:text-white"
            >
              Выйти
            </Button>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="p-4">
        {currentView === 'setup' ? (
          <CharacterSetup
            character={character}
            onCharacterUpdate={handleCharacterUpdate}
            onStartChat={handleStartChat}
          />
        ) : (
          <div className="max-w-7xl mx-auto">
            <DiscordStyleChat
              character={character}
              onBackToSetup={handleBackToSetup}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App