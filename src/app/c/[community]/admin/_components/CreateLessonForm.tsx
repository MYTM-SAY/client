// import { createClassroom } from '@/app/actions/classroom'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
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

interface CreateLessonFormProps {
  sectionId: number
  setShowLessonForm: (showLessonForm: boolean) => void
  handleNewLesson: (lesson: Lesson) => void
}

const createLessonSchema = z.object({
  name: z.string().min(1),
  notes: z.string().min(1),
  materialType: z.nativeEnum(MaterialType),
  fileUrl: z.string().min(1),
})

export default function CreateLessonForm({
  sectionId,
  setShowLessonForm,
  handleNewLesson,
}: CreateLessonFormProps) {
  const form = useForm<z.infer<typeof createLessonSchema>>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      name: '',
      notes: '',
      materialType: MaterialType.DOC,
      fileUrl: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof createLessonSchema>) => {
    try {
      const res = await instance.post(`/lessons`, {
        lesson: {
          name: data.name,
          notes: data.notes,
          sectionId,
        },
        materials: [
          {
            materialType: data.materialType,
            fileUrl: data.fileUrl,
          },
        ],
      })
      console.log({
        data: res.data,
      })

      if (res.data.success) {
        handleNewLesson({
          ...res.data.data,
          Material: {
            ...res.data.data.Materials[0],
            materialType: res.data.data.Materials[0].materialType,
            fileUrl: res.data.data.Materials[0].fileUrl,
          },
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    placeholder="Enter the name of your lesson"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-4">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    id="notes"
                    placeholder="Enter notes for your lesson."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-4">
          <FormField
            control={form.control}
            name="materialType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <SelectItem value={MaterialType.DOC}>Document</SelectItem>
                      <SelectItem value={MaterialType.VIDEO}>Video</SelectItem>
                      <SelectItem value={MaterialType.AUDIO}>Audio</SelectItem>
                      <SelectItem value={MaterialType.IMG}>Image</SelectItem>
                      <SelectItem value={MaterialType.FILE}>PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-4">
          <FormField
            control={form.control}
            name="fileUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            onClick={() => setShowLessonForm(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit">Create Lesson</Button>
        </div>
      </form>
    </Form>
  )
}
