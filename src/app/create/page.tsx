'use client'

import { Stepper } from '@/components/CreateForm/stepper/Stepper'
import { NameAndTags } from '@/components/CreateForm/steps/name-tags/NameAndTags'
import { BioSection } from '@/components/CreateForm/steps/bio/BioSection'
import { MediaSection } from '@/components/CreateForm/steps/media/MediaSection'
import { useState } from 'react'

const CreateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    tags: [] as string[],
    about: '',
    bio: '',
  })

  const isNextDisabled = (step: number) => {
    if (
      (formData.name.trim() === '' && step == 1) ||
      ((formData.bio.trim() === '' || formData.about.trim() == '') && step == 2)
    )
      return true
    return false
  }

  const steps = [
    {
      id: 1,
      title: 'Name and Tags',
      content: (
        <NameAndTags
          name={formData.name}
          tags={formData.tags}
          onChange={(name, tags) =>
            setFormData((prev) => ({ ...prev, name, tags }))
          }
        />
      ),
    },
    {
      id: 2,
      title: 'Bio Information',
      content: (
        <BioSection
          bio={formData.bio}
          about={formData.about}
          onChange={(bio, about) =>
            setFormData((prev) => ({ ...prev, bio, about }))
          }
        />
      ),
    },
    {
      id: 3,
      title: 'Media Upload',
      content: <MediaSection />,
    },
  ]

  return (
    <div className="w-full flex-col-center gap-16 p-4">
      <h1 className="h1">Create Your Own Community</h1>
      <Stepper
        steps={steps}
        isNextDisabled={(currentStep) => isNextDisabled(currentStep)}
      />
    </div>
  )
}

export default CreateForm
