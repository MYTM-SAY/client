import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'
import { Classroom } from '@/types'

interface Question {
  id: number
  questionHeader: string
  options: string[]
  answer: string[]
  classroomId: number
  type: 'SINGLE' | 'MULTI' | 'TRUE_FALSE'
}

interface QuestionFormProps {
  classrooms: Classroom[]
  question: Question | null
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function QuestionForm({
  classrooms,
  question,
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const [formData, setFormData] = useState({
    questionHeader: question?.questionHeader || '',
    options: question?.options || ['', ''],
    answer: question?.answer || [],
    classroomId: question?.classroomId || classrooms[0]?.id || 0,
    type: question?.type || 'SINGLE',
  })
  const [newOption, setNewOption] = useState('')

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const addOption = () => {
    if (newOption.trim()) {
      setFormData({
        ...formData,
        options: [...formData.options, newOption.trim()],
      })
      setNewOption('')
    }
  }

  const removeOption = (index: number) => {
    const newOptions = [...formData.options]
    newOptions.splice(index, 1)

    // Remove answers that reference the removed option
    const removedOption = formData.options[index]
    const newAnswers = formData.answer.filter((a) => a !== removedOption)

    setFormData({
      ...formData,
      options: newOptions,
      answer: newAnswers,
    })
  }

  const toggleAnswer = (option: string) => {
    if (formData.type === 'SINGLE') {
      setFormData({ ...formData, answer: [option] })
    } else {
      if (formData.answer.includes(option)) {
        setFormData({
          ...formData,
          answer: formData.answer.filter((a) => a !== option),
        })
      } else {
        setFormData({ ...formData, answer: [...formData.answer, option] })
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="questionHeader">Question</Label>
          <Input
            id="questionHeader"
            value={formData.questionHeader}
            onChange={(e) =>
              setFormData({ ...formData, questionHeader: e.target.value })
            }
            placeholder="Enter your question"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Question Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: 'SINGLE' | 'MULTI' | 'TRUE_FALSE') => {
              const newFormData = { ...formData, type: value }
              // Reset answers when changing type
              newFormData.answer = []
              // Set default options for TRUE_FALSE
              if (value === 'TRUE_FALSE') {
                newFormData.options = ['True', 'False']
              }
              setFormData(newFormData)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900">
              <SelectItem value="SINGLE">Single Choice</SelectItem>
              <SelectItem value="MULTI">Multiple Choice</SelectItem>
              <SelectItem value="TRUE_FALSE">True/False</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="classroom">Classroom</Label>
          <Select
            value={formData.classroomId.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, classroomId: parseInt(value) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select classroom" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900">
              {classrooms.map((classroom) => (
                <SelectItem key={classroom.id} value={classroom.id.toString()}>
                  {classroom.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Options Section */}
      <div className="space-y-4">
        <Label>Options</Label>
        {formData.type !== 'TRUE_FALSE' && (
          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  {formData.type === 'SINGLE' ? (
                    <input
                      type="radio"
                      name="answer"
                      checked={formData.answer.includes(option)}
                      onChange={() => toggleAnswer(option)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={formData.answer.includes(option)}
                      onChange={() => toggleAnswer(option)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                  )}
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add new option"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                disabled={!newOption.trim()}
              >
                Add Option
              </Button>
            </div>
          </div>
        )}

        {/* True/False Options */}
        {formData.type === 'TRUE_FALSE' && (
          <div className="flex gap-4">
            {['True', 'False'].map((option) => (
              <Button
                key={option}
                type="button"
                variant={
                  formData.answer.includes(option) ? 'default' : 'outline'
                }
                className="flex-1"
                onClick={() => toggleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">
          {question ? 'Update Question' : 'Create Question'}
        </Button>
      </div>
    </form>
  )
}
