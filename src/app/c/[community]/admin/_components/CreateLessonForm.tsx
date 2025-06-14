// import { createClassroom } from '@/app/actions/classroom'

import * as z from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { instance } from '@/lib/utils/axios'
import { Lesson, MaterialType } from '@/types'
import { useState } from 'react'
import LessonFileUploader from '@/components/LessonFileUploader'
import { PlusIcon, X } from 'lucide-react'

interface CreateLessonFormProps {
  sectionId: number
  setShowLessonForm: (showLessonForm: boolean) => void
  handleNewLesson: (lesson: Lesson) => void
}

const createLessonSchema = z.object({
  name: z.string().min(1),
  notes: z.array(z.object({
    content: z.string().min(1, "Note content is required")
  })).min(1, "At least one note is required"),
  materialType: z.nativeEnum(MaterialType),
})

export default function CreateLessonForm({
  sectionId,
  setShowLessonForm,
  handleNewLesson,
}: CreateLessonFormProps) {
  const [fileUrl, setFileUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<z.infer<typeof createLessonSchema>>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      name: '',
      notes: [{ content: '' }],
      materialType: MaterialType.DOC,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "notes"
  })

  const materialType = form.watch('materialType')

  const onSubmit = async (data: z.infer<typeof createLessonSchema>) => {
    if (!fileUrl) {
      form.setError('root', { message: 'Please upload a file for the lesson material' })
      return
    }

    setIsSubmitting(true)
    try {
      // Send notes as array of strings (server expects array format)
      const notesArray = data.notes.map(note => note.content)
      
      const res = await instance.post(`/lessons`, {
        lesson: {
          name: data.name,
          notes: notesArray, // Send as array as expected by server
          sectionId,
        },
        materials: [
          {
            materialType: data.materialType,
            fileUrl: fileUrl,
          },
        ],
      })
      console.log({
        data: res.data,
      })

      if (res.data.success) {
        handleNewLesson({
          ...res.data.data,
          Materials: {
            ...res.data.data.Materials[0],
            materialType: res.data.data.Materials[0].materialType,
            fileUrl: res.data.data.Materials[0].fileUrl,
          },
        })
        
        // Reset form
        form.reset()
        setFileUrl('')
        setShowLessonForm(false)
      }
    } catch (error) {
      console.error(error)
      form.setError('root', { message: 'Failed to create lesson. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (uploadedFileUrl: string) => {
    setFileUrl(uploadedFileUrl)
    // Clear any previous file upload errors
    if (form.formState.errors.root) {
      form.clearErrors('root')
    }
  }

  const handleFileRemove = () => {
    setFileUrl('')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="flex-1 space-y-4">
        <div className="mb-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-200">Lesson Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    placeholder="Enter the name of your lesson"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-4">
          <FormLabel className="dark:text-gray-200">Notes</FormLabel>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`notes.${index}.content`}
                  render={({ field: noteField }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder={`Note ${index + 1}`}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                          {...noteField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    className="mt-0 px-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ content: '' })}
              className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <FormField
            control={form.control}
            name="materialType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-200">Material Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Reset file when material type changes
                      setFileUrl('')
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value={MaterialType.DOC} className="dark:text-white dark:hover:bg-gray-700">Document</SelectItem>
                      <SelectItem value={MaterialType.VIDEO} className="dark:text-white dark:hover:bg-gray-700">Video</SelectItem>
                      <SelectItem value={MaterialType.AUDIO} className="dark:text-white dark:hover:bg-gray-700">Audio</SelectItem>
                      <SelectItem value={MaterialType.IMG} className="dark:text-white dark:hover:bg-gray-700">Image</SelectItem>
                      <SelectItem value={MaterialType.FILE} className="dark:text-white dark:hover:bg-gray-700">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-4">
          <FormLabel className="dark:text-gray-200">Lesson Material</FormLabel>
          <div className="mt-2">
            <LessonFileUploader
              materialType={materialType}
              currentFileUrl={fileUrl}
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
              disabled={isSubmitting}
            />
          </div>
          {form.formState.errors.root && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <Button
            type="button"
            onClick={() => setShowLessonForm(false)}
            variant="outline"
            disabled={isSubmitting}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !fileUrl}
            className="dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {isSubmitting ? 'Creating...' : 'Create Lesson'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
