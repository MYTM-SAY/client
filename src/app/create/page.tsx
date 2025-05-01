'use client'

import { Stepper } from '@/components/CreateForm/stepper/Stepper'
import { NameAndTags } from '@/components/CreateForm/steps/name-tags/NameAndTags'
import { BioSection } from '@/components/CreateForm/steps/bio/BioSection'
import { MediaSection } from '@/components/CreateForm/steps/media/MediaSection'
import { useState, useMemo } from 'react'
import { instance } from '@/lib/utils/axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { AxiosError } from 'axios'
interface CommunityFormData {
  name: string
  tags: string[]
  description: string
  bio: string
  coverImage?: File | null
  logoImage?: File | null
}

const useCommunityForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<CommunityFormData>({
    name: '',
    tags: [],
    description: '',
    bio: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateName = (name: string) => {
    setFormData((prev) => ({ ...prev, name }))
  }

  const updateTags = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }))
  }

  const updateBio = (bio: string) => {
    setFormData((prev) => ({ ...prev, bio }))
  }

  const updateDescription = (description: string) => {
    setFormData((prev) => ({ ...prev, description }))
  }

  const updateCoverImage = (coverImage: File | null) =>
    setFormData((prev) => ({ ...prev, coverImage }))
  const updateLogoImage = (logoImage: File | null) =>
    setFormData((prev) => ({ ...prev, logoImage }))

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim() !== ''
      case 2:
        return formData.bio.trim() !== '' && formData.description.trim() !== ''
      case 3:
        return true
      default:
        return false
    }
  }
  // const uploadImage = async (file: File): Promise<string> => {
  //   const formData = new FormData()
  //   formData.append('file', file)
  //   const response = await instance.post('/upload', formData)
  //   return response.data.url
  // }
  const submitCommunity = async () => {
    setIsSubmitting(true)
    setError(null)
    console.log(formData)
    try {
      const response = await instance.post('/communities', {
        name: formData.name,
        description: formData.description,
        bio: formData.bio,
        Tags: formData.tags,
        coverImgURL: 'https://example.com/cover.jpg',
        logoImgURL: 'https://example.com/logo.jpg',
      })
      toast.success('Community created successfully!')

      router.push(`/communities/${response.data.id}`)
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error('Error creating community:', err)
        setError(
          err.response?.data?.message ||
            'Failed to create community. Please try again.',
        )
        toast.error(err.response?.data?.message || 'Failed to create community')
      } else {
        console.error('Error creating community:', err)
        setError('Failed to create community. Please try again.')
        toast.error('Failed to create community')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    updateName,
    updateTags,
    updateBio,
    updateDescription,
    updateCoverImage,
    updateLogoImage,
    isStepValid,
    submitCommunity,
    isSubmitting,
    error,
  }
}

const CreateCommunityPage = () => {
  const {
    formData,
    updateName,
    updateTags,
    updateBio,
    updateDescription,
    updateCoverImage,
    updateLogoImage,
    isStepValid,
    submitCommunity,
    isSubmitting,
    error,
  } = useCommunityForm()

  const handleComplete = async () => {
    await submitCommunity()
  }

  const steps = useMemo(
    () => [
      {
        id: 1,
        title: 'Name and Tags',
        content: (
          <NameAndTags
            name={formData.name}
            tags={formData.tags}
            onChange={(name, tags) => {
              updateName(name)
              updateTags(tags)
            }}
          />
        ),
      },
      {
        id: 2,
        title: 'Bio Information',
        content: (
          <BioSection
            bio={formData.bio}
            description={formData.description}
            onChange={(bio, description) => {
              updateBio(bio)
              updateDescription(description)
            }}
          />
        ),
      },
      {
        id: 3,
        title: 'Media Upload',
        content: (
          <MediaSection
            onChangeCover={updateCoverImage}
            onChangeLogo={updateLogoImage}
          />
        ),
      },
    ],
    [
      formData,
      updateName,
      updateTags,
      updateBio,
      updateDescription,
      updateCoverImage,
      updateLogoImage,
    ],
  )

  return (
    <div className="w-full flex-col-center gap-16 p-4">
      <h1 className="h1">Create Your Own Community</h1>
      {error && (
        <div className="w-full max-w-3xl p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      <Stepper
        steps={steps}
        isNextDisabled={(currentStep) => !isStepValid(currentStep)}
        onComplete={handleComplete}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default CreateCommunityPage
