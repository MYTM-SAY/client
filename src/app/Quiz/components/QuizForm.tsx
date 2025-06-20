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
import { Question } from '@/types'

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
  isLoading?: boolean
}

const QuizForm: React.FC<QuizFormProps> = ({
  quiz,
  onSubmit,
  onCancel,
  questions = [],
  isLoading = false,
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
    field: keyof QuizQuestion,
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="active"
              checked={formData.active}
              disabled={isLoading}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, active: checked })
              }
            />
            <Label htmlFor="active">Active Quiz</Label>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Questions</h3>
              <Button 
                type="button" 
                onClick={addQuestion} 
                size="sm"
                disabled={isLoading}
              >
                + Add Question
              </Button>
            </div>

            {formData.quizQuestions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No questions added yet. Click "Add Question" to start.
              </div>
            )}

            {formData.quizQuestions.map((q, index) => (
              <Card key={index} className="border border-muted">
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`question-${index}`}>Select Question</Label>
                      <Select
                        value={q.questionId.toString()}
                        onValueChange={(value) =>
                          handleQuestionChange(index, 'questionId', value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a question" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Select a question</SelectItem>
                          {questions.map((question) => (
                            <SelectItem
                              key={question.id}
                              value={question.id.toString()}
                            >
                              {question.questionHeader}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`points-${index}`}>Points</Label>
                      <Input
                        id={`points-${index}`}
                        type="number"
                        min={1}
                        value={q.points}
                        onChange={(e) =>
                          handleQuestionChange(index, 'points', e.target.value)
                        }
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  {/* Show question preview if selected */}
                  {q.questionId > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {(() => {
                        const selectedQuestion = questions.find(
                          (question) => question.id === q.questionId
                        )
                        return selectedQuestion ? (
                          <div>
                            <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                              Preview: {selectedQuestion.questionHeader}
                            </p>
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                              Type: {selectedQuestion.type} | Options: {selectedQuestion.options.length}
                            </div>
                          </div>
                        ) : null
                      })()}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || formData.quizQuestions.length === 0}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Quiz' : 'Create Quiz'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default QuizForm
