'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormContents from '../components/input/FormContents';
import FormDesc from '../components/input/FormDesc';
import ProgressBar from '../components/ProgressBar';
import NavBar from '../components/NavBar';
import Dashboard from '../components/Dashboard';
import { useResult } from '../context/ResultContext';
import { useState } from 'react';
import { validate } from '@/lib/utils/validate';
import { userInputSchema } from '@/lib/validation/input.schema';

export default function InputPage() {
  const router = useRouter();
  const {
    userInput,
    setUserInput,
    setResult,
    setIsLoading,
    isLoading,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useResult();
  const [formData, setFormData] = useState({
    numberOfBolts: '',
    plateThickness: '',
    engagedThreadLength: '',
    externalLoad: '',
    preLoad: '',
    lateralLoad: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const formatValidationErrors = (errors) => {
    if (!errors || typeof errors !== 'object') {
      return 'Invalid input. Please check all parameters.';
    }

    const firstMessage = Object.values(errors)
      .flat()
      .find((message) => typeof message === 'string' && message.trim().length);

    return firstMessage || 'Invalid input. Please check all parameters.';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmitForm(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Convert string values to numbers for API
    const numericData = {
      numberOfBolts: parseInt(formData.numberOfBolts, 10),
      plateThickness: parseFloat(formData.plateThickness),
      engagedThreadLength: parseFloat(formData.engagedThreadLength),
      externalLoad: parseFloat(formData.externalLoad),
      preLoad: parseFloat(formData.preLoad),
      lateralLoad: parseFloat(formData.lateralLoad),
    };

    // STRICT SCHEMA VALIDATION
    const validated = validate(userInputSchema, numericData);

    if (!validated.success) {
      setErrorMessage(formatValidationErrors(validated.errors));
      setIsLoading(false);
      return;
    }

    // const userData = { ...numericData, calculatedAt: Date.now() };
    // const userData = { ...validated.data, calculatedAt: Date.now() };
    const userData = { ...validated.data, calculatedAt: Date.now() };
    console.log(userData);
    setUserInput(userData);

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(numericData),
        body: JSON.stringify(validated.data),
      });

      if (!res.ok) {
        setTimeout(() => {
          setErrorMessage(
            "There doesn't exist a bolt for given inputs. Re-enter the input parameters.",
          );
        }, 300);
        throw new Error(`API returned ${res.status}: ${res.statusText}`);
      }

      const result = await res.json();

      // Validate result has required properties
      if (
        !result ||
        !result.curBolt ||
        !result.curBoltProperty ||
        !result.limits ||
        !result.obtainedValues
      ) {
        throw new Error('API response missing required fields');
      }

      setResult(result, userData);

      // Navigate to results page after a slight delay
      setTimeout(() => {
        router.push('/result');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch:', error);
      alert(`Calculation failed: ${error.message}. Please try again.`);
      setIsLoading(false);
    }
  }

  const handleReset = () => {
    setFormData({
      numberOfBolts: '',
      plateThickness: '',
      engagedThreadLength: '',
      externalLoad: '',
      preLoad: '',
      lateralLoad: '',
    });
  };

  if (isLoading) {
    return <ProgressBar done={false} />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col fixed inset-0 m-0 p-0 overflow-hidden">
      {/* Header */}
      <NavBar />

      <div className="flex flex-row flex-1 min-h-0 p-0 m-0">
        {/* Desktop Sidebar - Always visible on lg+ screens */}
        <aside className="hidden lg:flex lg:w-64 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex-col  overflow-y-auto">
          <Dashboard />
        </aside>

        {/* Mobile Overlay Sidebar - Only visible when menu is open on mobile */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu */}
            <aside className="relative w-64 h-full bg-surface-light dark:bg-surface-dark flex flex-col overflow-y-auto">
              <Dashboard />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-hide">
          {/* Form Content */}
          <div className="p-4 sm:p-6 mt-2 md:p-8 max-w-6xl mx-auto w-full">
            {errorMessage && (
              <div className="mb-6 rounded-2xl border border-amber-200/70 dark:border-amber-900/60 bg-linear-to-br from-amber-50/90 via-amber-50/60 to-amber-100/60 dark:from-amber-950/40 dark:via-amber-900/20 dark:to-amber-800/20 px-4 py-3 text-amber-900 dark:text-amber-200 shadow-lg shadow-amber-100/40 dark:shadow-amber-950/30 backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="text-lg leading-none">⚠️</span>
                  <p className="text-sm font-medium leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}
            <FormDesc />

            <FormContents
              formData={formData}
              onInputChange={handleInputChange}
              onSubmitForm={handleSubmitForm}
              onReset={handleReset}
            />
          </div>

          {/* Footer */}
          <footer className="mt-auto py-4 sm:py-6 px-4 sm:px-6 md:px-8 border-t border-border-light dark:border-border-dark text-slate-500 dark:text-slate-500 text-xs flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6">
              <span className="hidden sm:inline">
                © 2024 Engineering Calculation Suite
              </span>
              <span className="sm:hidden">© 2024 BoltCalcPro</span>
              <a className="hover:underline" href="#">
                Documentation
              </a>
              <a className="hover:underline" href="#">
                Support
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">All systems operational</span>
              <span className="sm:hidden">Operational</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
