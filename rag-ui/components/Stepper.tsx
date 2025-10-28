import React from 'react';
import { Step } from '../types';

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const StepItem: React.FC<{ step: Step, isCurrent: boolean, isCompleted: boolean }> = ({ step, isCurrent, isCompleted }) => {
    let circleClasses = 'flex h-8 w-8 items-center justify-center rounded-full font-bold ';
    let textClasses = 'text-sm font-medium ';

    if (isCompleted) {
        circleClasses += 'bg-blue-600 text-white';
        textClasses += 'text-slate-700';
    } else if (isCurrent) {
        circleClasses += 'border-2 border-blue-600 bg-white text-blue-600';
        textClasses += 'text-blue-600';
    } else {
        circleClasses += 'border-2 border-gray-300 bg-white text-gray-500';
        textClasses += 'text-gray-500';
    }

    return (
        <div className="relative flex flex-col items-center">
            <div className={circleClasses} aria-current={isCurrent ? 'step' : undefined}>
                <span>{step.id}</span>
            </div>
            <p className={`mt-2 text-center w-28 ${textClasses}`}>{step.name}</p>
        </div>
    );
};


export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-start justify-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex items-center">
                {/* Connector line */}
                {stepIdx > 0 && (
                    <div className="absolute left-[-50%] top-4 -z-10 w-full" aria-hidden="true">
                        <div className={`h-0.5 w-full ${step.id <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    </div>
                )}
                <StepItem step={step} isCurrent={step.id === currentStep} isCompleted={step.id < currentStep} />
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};