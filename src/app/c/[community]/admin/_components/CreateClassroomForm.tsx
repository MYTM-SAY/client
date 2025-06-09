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
import { useState } from 'react'
import ClassroomCoverUploader from '@/components/ClassroomCoverUploader'

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
  const [coverImageUrl, setCoverImageUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<z.infer<typeof createClassroomSchema>>({
    resolver: zodResolver(createClassroomSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof createClassroomSchema>) => {
    if (!coverImageUrl) {
      form.setError('root', { message: 'Please upload a cover image for the classroom' })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await instance.post(`/classrooms`, {
        communityId: communityId,
        name: data.title,
        description: data.description,
        coverImg: coverImageUrl,
      })
      if (res.data.success) {
        handleNewClassroom(res.data.data)
        
        // Reset form
        form.reset()
        setCoverImageUrl('')
        setShowClassroomForm(false)
      }
    } catch (error) {
      console.error(error)
      form.setError('root', { message: 'Failed to create classroom. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (uploadedImageUrl: string) => {
    setCoverImageUrl(uploadedImageUrl)
    // Clear any previous cover image errors
    if (form.formState.errors.root) {
      form.clearErrors('root')
    }
  }

  const handleImageRemove = () => {
    setCoverImageUrl('')
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
        <div className="mb-4">
          <FormLabel>Cover Image</FormLabel>
          <div className="mt-2">
            <ClassroomCoverUploader
              currentImageUrl={coverImageUrl}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              disabled={isSubmitting}
            />
          </div>
          {form.formState.errors.root && (
            <p className="text-sm text-red-500 mt-2">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            onClick={() => setShowClassroomForm(false)}
            variant="outline"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !coverImageUrl}>
            {isSubmitting ? 'Creating...' : 'Create Classroom'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
