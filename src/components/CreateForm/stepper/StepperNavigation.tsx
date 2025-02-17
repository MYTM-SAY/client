import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const StepperNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
}: StepperNavigationProps) => {
  return (
    <div className="flex justify-between mt-4 border-t pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <Button onClick={onNext}>
        {currentStep < totalSteps ? (
          <>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </div>
  );
};
