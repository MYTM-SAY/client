import { cn } from "@/lib/utils";

interface StepperHeaderProps {
  steps: Array<{ id: number; title: string }>;
  currentStep: number;
}

export const StepperHeader = ({ steps, currentStep }: StepperHeaderProps) => {
  return (
    <ol className="flex items-center w-full mb-4 sm:mb-5">
      {steps.map((step) => (
        <li
          key={step.id}
          className={cn(
            "flex items-center",
            step.id !== steps.length && "w-full"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0",
              currentStep >= step.id
                ? "bg-blue-600"
                : "bg-gray-200 dark:bg-gray-700"
            )}
          >
            <span
              className={cn(
                "text-lg font-semibold",
                currentStep >= step.id
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-300"
              )}
            >
              {step.id}
            </span>
          </div>
          {step.id !== steps.length && (
            <div
              className={cn(
                "w-full h-1 mx-2",
                currentStep > step.id
                  ? "bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700"
              )}
            />
          )}
        </li>
      ))}
    </ol>
  );
};
