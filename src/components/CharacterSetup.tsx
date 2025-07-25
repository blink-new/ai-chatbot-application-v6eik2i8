import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Settings, Save, Upload, Download } from 'lucide-react'

interface Character {
  name: string
  avatar: string
  personality: string
  roleScript: string
  status: string
}

interface CharacterSetupProps {
  character: Character
  onCharacterUpdate: (character: Character) => void
  onStartChat: () => void
}

const CharacterSetup: React.FC<CharacterSetupProps> = ({
  character,
  onCharacterUpdate,
  onStartChat
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleInputChange = (field: keyof Character, value: string) => {
    onCharacterUpdate({
      ...character,
      [field]: value
    })
  }

  const presetCharacters = [
    {
      name: "Анна Волкова",
      personality: "Загадочная детектив с острым умом и саркастическим чувством юмора. Всегда ищет правду.",
      roleScript: "Ты - опытный детектив Анна Волкова. Ты работаешь в полиции уже 10 лет и видела многое. У тебя острый ум, ты замечаешь детали, которые другие упускают. Ты говоришь прямо, иногда саркастично, но всегда справедливо. Ты не любишь преступников, но уважаешь честных людей.",
      avatar: "👩‍🕵️",
      status: "Расследует дело"
    },
    {
      name: "Дмитрий Стальной",
      personality: "Суровый воин-паладин с благородным сердцем и непоколебимой верой в справедливость.",
      roleScript: "Ты - паладин Дмитрий Стальной. Ты служишь свету и справедливости. У тебя благородное сердце, ты защищаешь слабых и сражаешься со злом. Ты говоришь торжественно и вдохновляюще, используешь архаичные обороты речи. Ты верен своим принципам до конца.",
      avatar: "⚔️",
      status: "Готов к бою"
    },
    {
      name: "Лиса Кицунэ",
      personality: "Игривая и хитрая лиса-оборотень с магическими способностями и любовью к розыгрышам.",
      roleScript: "Ты - лиса-оборотень Кицунэ. Ты игривая, хитрая и любишь розыгрыши. У тебя есть магические способности, ты можешь превращаться и создавать иллюзии. Ты говоришь загадками, любишь флиртовать и подшучивать. Ты древняя, но выглядишь молодо.",
      avatar: "🦊",
      status: "Плетет интриги"
    }
  ]

  const loadPreset = (preset: typeof presetCharacters[0]) => {
    onCharacterUpdate({
      name: preset.name,
      avatar: preset.avatar,
      personality: preset.personality,
      roleScript: preset.roleScript,
      status: preset.status
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-[#2f3136] border-[#40444b] text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#ffffff]">
            <Settings className="w-5 h-5" />
            Настройка Персонажа
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b]"
          >
            {isExpanded ? 'Свернуть' : 'Развернуть'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Быстрые пресеты */}
          <div>
            <Label className="text-[#b9bbbe] text-sm font-medium mb-2 block">
              Готовые персонажи:
            </Label>
            <div className="flex flex-wrap gap-2">
              {presetCharacters.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadPreset(preset)}
                  className="bg-[#40444b] border-[#40444b] text-[#b9bbbe] hover:bg-[#5865f2] hover:text-white hover:border-[#5865f2]"
                >
                  {preset.avatar} {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Левая колонка - Основная информация */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 bg-[#40444b]">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-[#5865f2]">
                    {character.avatar || '🤖'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="name" className="text-[#b9bbbe] text-sm font-medium">
                    Имя персонажа
                  </Label>
                  <Input
                    id="name"
                    value={character.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Введите имя персонажа..."
                    className="bg-[#40444b] border-[#40444b] text-white placeholder:text-[#72767d] focus:border-[#5865f2]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="avatar" className="text-[#b9bbbe] text-sm font-medium">
                  Аватар (эмодзи)
                </Label>
                <Input
                  id="avatar"
                  value={character.avatar}
                  onChange={(e) => handleInputChange('avatar', e.target.value)}
                  placeholder="🤖"
                  className="bg-[#40444b] border-[#40444b] text-white placeholder:text-[#72767d] focus:border-[#5865f2]"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-[#b9bbbe] text-sm font-medium">
                  Статус
                </Label>
                <Input
                  id="status"
                  value={character.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  placeholder="Готов к общению"
                  className="bg-[#40444b] border-[#40444b] text-white placeholder:text-[#72767d] focus:border-[#5865f2]"
                />
              </div>

              <div>
                <Label htmlFor="personality" className="text-[#b9bbbe] text-sm font-medium">
                  Краткое описание личности
                </Label>
                <Textarea
                  id="personality"
                  value={character.personality}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                  placeholder="Опишите характер и особенности персонажа..."
                  rows={3}
                  className="bg-[#40444b] border-[#40444b] text-white placeholder:text-[#72767d] focus:border-[#5865f2] resize-none"
                />
              </div>
            </div>

            {/* Правая колонка - Ролевой скрипт */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="roleScript" className="text-[#b9bbbe] text-sm font-medium">
                  Ролевой скрипт (подробная инструкция)
                </Label>
                <Textarea
                  id="roleScript"
                  value={character.roleScript}
                  onChange={(e) => handleInputChange('roleScript', e.target.value)}
                  placeholder="Ты - [имя персонажа]. Ты [описание роли]. Твоя задача - [цель]. Ты говоришь [стиль речи]. Ты [особенности поведения]..."
                  rows={12}
                  className="bg-[#40444b] border-[#40444b] text-white placeholder:text-[#72767d] focus:border-[#5865f2] resize-none"
                />
              </div>

              <div className="text-xs text-[#72767d] space-y-1">
                <p><strong>Советы по созданию скрипта:</strong></p>
                <p>• Опишите роль и предысторию персонажа</p>
                <p>• Укажите стиль речи и манеру общения</p>
                <p>• Добавьте цели и мотивацию персонажа</p>
                <p>• Опишите отношение к разным ситуациям</p>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#40444b]">
            <Button
              onClick={onStartChat}
              disabled={!character.name || !character.roleScript}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white"
            >
              Начать Ролевую Игру
            </Button>
            
            <Button
              variant="outline"
              className="bg-[#40444b] border-[#40444b] text-[#b9bbbe] hover:bg-[#36393f] hover:text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
            
            <Button
              variant="outline"
              className="bg-[#40444b] border-[#40444b] text-[#b9bbbe] hover:bg-[#36393f] hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Загрузить
            </Button>
            
            <Button
              variant="outline"
              className="bg-[#40444b] border-[#40444b] text-[#b9bbbe] hover:bg-[#36393f] hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Экспорт
            </Button>
          </div>

          {/* Предпросмотр персонажа */}
          {character.name && (
            <div className="bg-[#36393f] rounded-lg p-4 border border-[#40444b]">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#5865f2] text-white">
                    {character.avatar || '🤖'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{character.name}</span>
                    <Badge variant="secondary" className="bg-[#57f287] text-[#2f3136] text-xs">
                      ОНЛАЙН
                    </Badge>
                  </div>
                  <div className="text-sm text-[#b9bbbe]">{character.status}</div>
                </div>
              </div>
              <div className="text-sm text-[#dcddde] bg-[#2f3136] rounded p-3">
                <strong>Превью:</strong> {character.personality || 'Описание личности появится здесь...'}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default CharacterSetup