"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface StepperProps {
  steps: {
    id: number;
    title: string;
    content: React.ReactNode;
  }[];
}

export const Stepper = ({ steps }: StepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Stepper Header */}
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

      {/* Content */}
      <div className="mt-8 mb-8">
        {steps.map(
          (step) =>
            currentStep === step.id && (
              <div key={step.id}>
                <h2 className="text-lg font-semibold mb-4">{step.title}</h2>
                {step.content}
              </div>
            )
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStep < 3 ? (
            <>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
};
