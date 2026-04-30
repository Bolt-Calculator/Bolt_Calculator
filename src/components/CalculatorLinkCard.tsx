'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type CalculatorLinkCardProps = {
  message?: string;
  buttonText?: string;
};

function splitMessage(message?: string) {
  const lines =
    message
      ?.split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean) || [];

  return {
    heading: lines[0] || 'Ready to verify your structural integrity?',
    body:
      lines.slice(1).join(' ') ||
      'Access our precision bolt calculator to simulate axial loads, shear stress, and safety factors with industry-standard accuracy.',
  };
}

export default function CalculatorLinkCard({
  message,
  buttonText = 'Launch Bolt Calculator',
}: CalculatorLinkCardProps) {
  const content = splitMessage(message);

  return (
    <section className="my-10 w-full max-w-4xl">
      <div className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-950/50 transition-shadow hover:shadow-md dark:hover:shadow-slate-950/70">
        <div className="technical-grid pointer-events-none absolute inset-0 opacity-[0.03]" />

        <div className="relative flex flex-col gap-8 p-6 md:flex-row md:items-stretch md:p-8">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary dark:text-blue-400">
                BOLT CALCULATOR
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
                {content.heading}
              </h2>
              <p className="max-w-xl whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
                {content.body}
              </p>
            </div>
          </div>

          <div className="flex min-w-65 items-center justify-center md:border-l md:border-slate-100 dark:md:border-slate-800 md:pl-8">
            <div className="text-center md:text-left">
              <Link
                href="/input"
                className="group/button inline-flex items-center gap-3 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white no-underline shadow-lg shadow-primary/10 transition-all duration-300 hover:bg-blue-700 hover:no-underline active:scale-[0.98]"
              >
                <span>{buttonText}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute right-0 top-0 p-1 opacity-10">
          <div className="h-10 w-10 border-r-2 border-t-2 border-slate-400" />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 p-1 opacity-10">
          <div className="h-10 w-10 border-b-2 border-l-2 border-slate-400" />
        </div>
      </div>
    </section>
  );
}
