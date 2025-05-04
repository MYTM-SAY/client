'use client'
import { useState } from 'react'
import { StepperHeader } from './StepperHeader'
import { StepperContent } from './StepperContent'
import { StepperNavigation } from './StepperNavigation'
interface StepperProps {
  steps: Array<{
    id: number
    title: string
    content: React.ReactNode
  }>
  isNextDisabled: (currentStep: number) => boolean
  onComplete: () => void
  isSubmitting: boolean
}

export const Stepper = ({
  steps,
  isNextDisabled,
  onComplete,
  isSubmitting,
}: StepperProps) => {
  const [currentStep, setCurrentStep] = useState(1)

  const handleNext = () => {
    if (currentStep < steps.length && !isNextDisabled(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 h-full flex flex-col">
      <StepperHeader steps={steps} currentStep={currentStep} />
      <StepperContent steps={steps} currentStep={currentStep} />
      <StepperNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isNextDisabled={isNextDisabled(currentStep)}
        onComplete={onComplete}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
