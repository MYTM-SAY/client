interface StepperContentProps {
  currentStep: number
  steps: Array<{
    id: number
    title: string
    content: React.ReactNode
  }>
}

export const StepperContent = ({ currentStep, steps }: StepperContentProps) => {
  return (
    <div className="flex-1 overflow-y-auto mt-4 mb-4">
      {steps.map(
        (step) =>
          currentStep === step.id && (
            <div key={step.id} className="animate-fade-in">
              <h2 className="text-lg font-semibold mb-4">{step.title}</h2>
              {step.content}
            </div>
          ),
      )}
    </div>
  )
}
