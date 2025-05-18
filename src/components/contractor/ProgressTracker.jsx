import { motion } from "framer-motion";
import { Check } from "lucide-react";

const ProgressTracker = ({ currentStep = "building-type" }) => {
  const steps = [
    { id: "service-details", label: "Service Details" },
    { id: "additional-info", label: "Additional Information" },
    { id: "time-date", label: "Time & Date" },
    { id: "contact", label: "Contact Details" },
    { id: "complete", label: "Complete Booking" },
  ];

  // Map actual workflow steps to progress tracker steps
  const mapWorkflowToProgressStep = (workflowStep) => {
    // Mapping from workflow steps to progress tracker steps
    const stepMapping = {
      location: "service-details",
      "building-type": "service-details",
      "additional-services": "additional-info",
      "time-date": "time-date",
      contact: "contact",
      payment: "contact",
      complete: "complete",
    };

    return stepMapping[workflowStep] || workflowStep;
  };

  const getStepStatus = (stepId) => {
    const mappedCurrentStep = mapWorkflowToProgressStep(currentStep);
    const stepOrder = [
      "service-details",
      "additional-info",
      "time-date",
      "contact",
      "complete",
    ];
    const currentIndex = stepOrder.indexOf(mappedCurrentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    // Handle special cases for progress
    if (stepId === "service-details") {
      if (currentStep === "building-type") {
        return { status: "current", progress: 0.5 };
      } else if (currentStep === "location") {
        return { status: "current", progress: 0 };
      }
    }

    if (stepId === "contact" && currentStep === "payment") {
      return { status: "current", progress: 0.5 };
    }

    if (stepIndex < currentIndex) return { status: "complete", progress: 1 };
    if (stepIndex === currentIndex) return { status: "current", progress: 0 };
    return { status: "upcoming", progress: 0 };
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className="flex flex-col items-center w-full">
              <div className="flex items-center justify-center mb-2 relative w-full">
                {/* Line before */}
                {index > 0 && (
                  <div
                    className={`h-[2px] absolute right-1/2 w-full transition-colors duration-300 ${
                      getStepStatus(steps[index - 1].id).status === "complete"
                        ? "bg-primary-orange"
                        : "bg-grey-outline"
                    }`}
                  />
                )}

                {/* Circle with background ring */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    status.status === "complete"
                      ? "bg-primary-orange/20"
                      : "bg-grey-outline"
                  }`}
                >
                  <motion.div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center z-10 transition-colors duration-300 ${
                      status.status === "complete"
                        ? "bg-primary-orange text-white"
                        : status.status === "current"
                        ? "bg-white border-2 border-primary-orange"
                        : "bg-white border-2 border-grey-outline"
                    }`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {status.status === "complete" ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : null}
                  </motion.div>
                </div>

                {/* Line after */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-[2px] absolute left-1/2 w-full transition-colors duration-300 ${
                      status.status === "complete" ||
                      (status.status === "current" && status.progress >= 0.5)
                        ? "bg-primary-orange"
                        : "bg-grey-outline"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  status.status === "current" || status.status === "complete"
                    ? "text-primary-black"
                    : "text-primary-grey"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
