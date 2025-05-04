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
import { Section } from '@/types'

interface CreateSectionFormProps {
  classroomId: number
  setShowSectionForm: (showSectionForm: boolean) => void
  handleNewSection: (section: Section) => void
}

const createSectionSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
})

export default function CreateSectionForm({
  classroomId,
  setShowSectionForm,
  handleNewSection,
}: CreateSectionFormProps) {
  const form = useForm<z.infer<typeof createSectionSchema>>({
    resolver: zodResolver(createSectionSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof createSectionSchema>) => {
    try {
      const res = await instance.post(`/sections`, {
        classroomId: classroomId,
        name: data.name,
        description: data.description,
      })
      if (res.data.success) {
        handleNewSection({
          ...res.data.data,
          lessons: [],
        })
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    placeholder="Enter the name of your section"
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
                    placeholder="Enter a description for your section."
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
            onClick={() => setShowSectionForm(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit">Create Section</Button>
        </div>
      </form>
    </Form>
  )
}
