'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import ReportHeader from '../../components/report/ReportHeader';
import UserInputData from '../../components/report/UserInputData';
import SelectedBolt from '../../components/report/SelectedBolt';
import LoadVerificationTable from '../../components/report/LoadVerificationTable';
import ReportCTA from '../../components/report/ReportCTA';

function HistoryReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const [bolt, setBolt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bolt data from localStorage on client side only
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Get index from URL search params
      const indexParam = searchParams.get('index');

      // Validate: check if index is a valid number
      if (indexParam === null || indexParam === undefined) {
        setError('No history index provided');
        setBolt(null);
        setIsLoading(false);
        return;
      }

      const historyIndex = parseInt(indexParam, 10);

      if (isNaN(historyIndex) || historyIndex < 0) {
        setError('Invalid history index');
        setBolt(null);
        setIsLoading(false);
        return;
      }

      const storedData = localStorage.getItem('boltResultHistory');
      const boltHistoryData = JSON.parse(storedData) || [];

      // Validate: check if index is within bounds
      if (historyIndex >= boltHistoryData.length) {
        setError('History record not found');
        setBolt(null);
        setIsLoading(false);
        return;
      }

      const boltData = boltHistoryData[historyIndex];

      // Validate: check if bolt.curBolt exists before accessing
      if (!boltData || !boltData.curBolt) {
        setError('Invalid bolt data: missing bolt information');
        setBolt(null);
        setIsLoading(false);
        return;
      }

      // Validate: check if required nested properties exist
      if (
        !boltData.curBoltProperty ||
        !boltData.userInputData ||
        !boltData.obtainedValues ||
        !boltData.limits
      ) {
        setError('Invalid bolt data: missing required properties');
        setBolt(null);
        setIsLoading(false);
        return;
      }

      setBolt(boltData);
    } catch (error) {
      console.error('Error loading bolt data:', error);
      setError('Failed to load calculation history');
      setBolt(null);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-500">Loading report...</p>
        </div>
      </div>
    );
  }

  // Redirect if no bolt data found or error
  if (error || bolt === undefined || bolt === null) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-slate-500 mb-4">
            {error || 'The requested report could not be found.'}
          </p>
          <button
            onClick={() => router.push('/history')}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  // Transform bolt data into report format
  const reportData = {
    refId: `BOLT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9999)}`,
    boltName: bolt.curBolt.designation,
    date: new Date(bolt.userInputData.calculatedAt).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      },
    ),
    userInputs: [
      {
        label: 'Number of Bolts',
        value: `${bolt.userInputData.numberOfBolts ?? 'N/A'}`,
      },
      {
        label: 'Plate Thickness',
        value: `${bolt.userInputData.plateThickness.toFixed(2)} mm`,
      },
      { label: 'External Load', value: `${bolt.userInputData.externalLoad} N` },
      {
        label: 'Engaged Thread Length',
        value: `${bolt.userInputData.engagedThreadLength.toFixed(2)} mm`,
      },
      {
        label: 'Pre Load',
        value: `${bolt.userInputData.preLoad.toFixed(2)} N`,
      },
      {
        label: 'Lateral Load',
        value: `${bolt.userInputData.lateralLoad.toFixed(2)} N`,
      },
    ],
    boltDetails: [
      { label: 'Name', value: bolt.curBolt.designation },
      { label: 'Grade', value: bolt.curBoltProperty.className },
      { label: 'Diameter', value: `${bolt.curBolt.nominalDiameter} mm` }, // Default - adjust if available
      {
        label: 'Tensile Stress Area',
        value: `${bolt.curBolt.tensileStressArea.toFixed(2)} mm\u00B2`,
      },
      {
        label: 'Thread Mean Diameter',
        value: `${bolt.curBolt.threadMeanDiameter.toFixed(2)} mm`,
      },
    ],
    verification: [
      {
        name: 'Tensile Stress',
        description: 'Based on effective area',
        calculated: `${bolt.obtainedValues.tensileStress.toFixed(2)} MPa`,
        limit: `${bolt.limits.tensileStress.toFixed(2)} MPa`,
        utilization: Math.round(
          (bolt.obtainedValues.tensileStress / bolt.limits.tensileStress) * 100,
        ),
        status:
          bolt.obtainedValues.tensileStress <= bolt.limits.tensileStress
            ? 'PASS'
            : 'FAIL',
      },
      {
        name: 'Shear Stress',
        description: 'Cross-sectional resistance',
        calculated: `${bolt.obtainedValues.shearStress.toFixed(2)} MPa`,
        limit: `${bolt.limits.shearStress.toFixed(2)} MPa`,
        utilization: Math.round(
          (bolt.obtainedValues.shearStress / bolt.limits.shearStress) * 100,
        ),
        status:
          bolt.obtainedValues.shearStress <= bolt.limits.shearStress
            ? 'PASS'
            : 'FAIL',
      },
      {
        name: 'Bearing Stress',
        description: 'Plate bearing stress check',
        calculated: `${bolt.obtainedValues.plateBearingStress.toFixed(2)} MPa`,
        limit: `${bolt.limits.plateBearingStress.toFixed(2)} MPa`,
        utilization: Math.round(
          (bolt.obtainedValues.plateBearingStress /
            bolt.limits.plateBearingStress) *
            100,
        ),
        status:
          bolt.obtainedValues.plateBearingStress <=
          bolt.limits.plateBearingStress
            ? 'PASS'
            : 'FAIL',
      },
      {
        name: 'Thread Shear Stress',
        description: 'Engagement length check',
        calculated: `${bolt.obtainedValues.threadShearStress.toFixed(2)} MPa`,
        limit: `${bolt.limits.threadShearStress.toFixed(2)} MPa`,
        utilization: Math.round(
          (bolt.obtainedValues.threadShearStress /
            bolt.limits.threadShearStress) *
            100,
        ),
        status:
          bolt.obtainedValues.threadShearStress <= bolt.limits.threadShearStress
            ? 'PASS'
            : 'FAIL',
      },
      {
        name: 'Preload',
        description: 'Preload check',
        calculated: `${bolt.obtainedValues.preLoad.toFixed(2)} N`,
        limit: `${bolt.limits.preLoad.toFixed(2)} N`,
        utilization: Math.round(
          (bolt.obtainedValues.preLoad / bolt.limits.preLoad) * 100,
        ),
        status:
          bolt.obtainedValues.preLoad <= bolt.limits.preLoad ? 'PASS' : 'FAIL',
      },
      {
        name: 'Separation Load',
        description: 'Separation Load check',
        calculated: `${bolt.obtainedValues.separationLoad.toFixed(2)} MPa`,
        limit: `${bolt.limits.separationLoad.toFixed(2)} MPa`,
        utilization: Math.round(
          (bolt.limits.separationLoad / bolt.obtainedValues.separationLoad) *
            100,
        ),
        status:
          bolt.limits.separationLoad <= bolt.obtainedValues.separationLoad
            ? 'PASS'
            : 'FAIL',
      },
    ],
  };

  async function handleExportPDF() {
    console.log('[Report] bolt object:', bolt);
    console.log('[Report] bolt.userInputData:', bolt.userInputData);
    const { userInputData, ...rest } = bolt;
    const boltData = { ...rest, userInputData };
    console.log('[Report] Requesting PDF generation:', boltData);
    console.log('[Report] boltData.userInputData:', boltData.userInputData);
    setIsExporting(true);

    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(boltData),
      });

      // Check if response is an error
      if (!response.ok) {
        const contentType = response.headers.get('content-type');

        // If server returned JSON, it's an error message
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('[Report] PDF generation error:', errorData);
          alert(
            `Failed to generate PDF: ${errorData.details || errorData.error || 'Unknown error'}`,
          );
          return;
        }

        // Other error
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`,
        );
      }

      // Success - we have a PDF
      const blob = await response.blob();

      // Verify it's actually a PDF
      if (blob.type !== 'application/pdf' && blob.size === 0) {
        throw new Error('Received invalid PDF data');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bolt-report.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      console.log('[Report] PDF downloaded successfully');
    } catch (error) {
      console.error('[Report] PDF export failed:', error);
      alert(`Failed to download PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  }

  const handleBackToHistory = () => {
    router.back();
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReportHeader
          boltName={reportData.boltName}
          refId={reportData.refId}
          date={reportData.date}
          onExportPDF={handleExportPDF}
          isExporting={isExporting}
        />

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserInputData userInputs={reportData.userInputs} />
            <SelectedBolt boltDetails={reportData.boltDetails} />
          </div>

          <LoadVerificationTable verification={reportData.verification} />

          <ReportCTA onBackToHistory={handleBackToHistory} />
        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 dark:border-slate-800 mt-12 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2024 Bolt Analysis Pro. Certified Engineering Software.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="#"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Compliance Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HistoryReportPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-500">Loading report...</p>
          </div>
        </div>
      }
    >
      <HistoryReportContent />
    </Suspense>
  );
}
