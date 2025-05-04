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

import { instance } from '@/lib/utils/axios'
import { Classroom } from '@/types'

interface CreateClassroomFormProps {
  communityId: number
  setShowClassroomForm: (showClassroomForm: boolean) => void
  handleNewClassroom: (classroom: Classroom) => void
}

const createClassroomSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
})

export default function CreateClassroomForm({
  communityId,
  setShowClassroomForm,
  handleNewClassroom,
}: CreateClassroomFormProps) {
  const form = useForm<z.infer<typeof createClassroomSchema>>({
    resolver: zodResolver(createClassroomSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof createClassroomSchema>) => {
    // TODO: add cover image
    try {
      const res = await instance.post(`/classrooms`, {
        communityId: communityId,
        name: data.title,
        description: data.description,
        coverImg: 'https://picsum.photos/200/300',
      })
      if (res.data.success) {
        handleNewClassroom(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classroom Title</FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    placeholder="Enter the title of your classroom"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    placeholder="Enter a description for your classroom."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            onClick={() => setShowClassroomForm(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit">Create Classroom</Button>
        </div>
      </form>
    </Form>
  )
}
