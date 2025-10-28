import React, { useState } from 'react';
import { Header } from './components/Header';
import { Stepper } from './components/Stepper';
import { ConfigurationPage } from './components/ConfigurationPage';
import { DocumentProcessingPage } from './components/DocumentProcessingPage';
import { ReviewAndChatPage } from './components/ReviewAndChatPage';
import { Step } from './types';

const App: React.FC = () => {
  const steps: Step[] = [
    { id: 1, name: 'Configuration' },
    { id: 2, name: 'Document Processing' },
    { id: 3, name: 'Review & Chat' },
  ];

  const [currentStep, setCurrentStep] = useState(1);

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stepper steps={steps} currentStep={currentStep} />
        <div className="mt-12">
          {currentStep === 1 && <ConfigurationPage onNext={goToNextStep} />}
          {currentStep === 2 && <DocumentProcessingPage onBack={goToPrevStep} onNext={goToNextStep} />}
          {currentStep === 3 && <ReviewAndChatPage onBack={goToPrevStep} />}
        </div>
      </main>
    </div>
  );
};

export default App;