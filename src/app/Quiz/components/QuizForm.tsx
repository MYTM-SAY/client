'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface Question {
  id: number
  questionHeader: string
}

interface QuizQuestion {
  questionId: number
  points: number
}

interface QuizFormData {
  id?: string
  name: string
  duration: number
  startDate: string
  endDate: string
  classroomId: string
  active: boolean
  quizQuestions: QuizQuestion[]
}

interface QuizFormProps {
  quiz: QuizFormData
  onSubmit: (data: QuizFormData) => void
  onCancel: () => void
  questions?: Question[]
}

const QuizForm: React.FC<QuizFormProps> = ({
  quiz,
  onSubmit,
  onCancel,
  questions,
}) => {
  const [formData, setFormData] = useState<QuizFormData>(quiz)
  const [isEditing] = useState(!!quiz.id)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    const val =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData({ ...formData, [name]: val })
  }

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedQuestions = [...formData.quizQuestions]
    const parsedValue =
      field === 'questionId' || field === 'points' ? parseInt(value, 10) : value

    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: parsedValue,
    }
    setFormData({ ...formData, quizQuestions: updatedQuestions })
  }

  const addQuestion = () => {
    setFormData({
      ...formData,
      quizQuestions: [...formData.quizQuestions, { questionId: 0, points: 10 }],
    })
  }

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...formData.quizQuestions]
    updatedQuestions.splice(index, 1)
    setFormData({ ...formData, quizQuestions: updatedQuestions })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Quiz Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min={1}
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="classroomId">Classroom ID</Label>
              <Input
                id="classroomId"
                name="classroomId"
                value={formData.classroomId}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) =>
                handleChange({
                  target: {
                    name: 'active',
                    type: 'checkbox',
                    checked,
                  } as any,
                } as React.ChangeEvent<HTMLInputElement>)
              }
            />
            <Label htmlFor="active">Active Quiz</Label>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Questions</h3>
              <Button type="button" onClick={addQuestion} size="sm">
                + Add Question
              </Button>
            </div>

            {formData.quizQuestions.map((q, index) => (
              <Card key={index} className="border border-muted">
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Select Question</Label>
                      <select
                        className="w-full border rounded px-3 py-2 bg-background"
                        value={q.questionId || ''}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            'questionId',
                            e.target.value,
                          )
                        }
                        required
                      >
                        <option value="">Select a question</option>
                        {questions &&
                          questions.map((question) => (
                            <option key={question.id} value={question.id}>
                              {question.questionHeader}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <Label>Points</Label>
                      <Input
                        type="number"
                        value={q.points}
                        min={1}
                        onChange={(e) =>
                          handleQuestionChange(index, 'points', e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  {formData.quizQuestions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                      className="text-destructive"
                    >
                      Remove Question
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default QuizForm
